"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product, ChatMessage } from "@/lib/types";
import { Send, Bot, Loader2, Trash2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatSheetProps {
  product: Product;
  trigger: React.ReactNode;
}

export function ChatSheet({ product, trigger }: ChatSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSend(transcript);
        };

        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined") return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async (manualInput?: string) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          message: userMsg.content,
          history: messages,
        }),
      });

      const data = await response.json();
      const aiResponse = data.answer || "Sorry, I didn't get that.";

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      speakText(aiResponse);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    window.speechSynthesis.cancel();
  };

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) window.speechSynthesis.cancel();
      }}
    >
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent className="w-full sm:w-[540px] flex flex-col p-0 h-[100vh] bg-white z-[50]">

        {/* REQUIRED: hidden dialog title */}
        <VisuallyHidden>
          <DialogTitle>{product.name} Assistant</DialogTitle>
        </VisuallyHidden>

        {/* HEADER */}
        <SheetHeader className="p-4 border-b bg-slate-50 flex-none">
          <div className="flex items-center justify-between w-full">
            <SheetTitle className="flex items-center gap-2">
              <Bot className={`w-6 h-6 ${isSpeaking ? "text-green-500 animate-pulse" : "text-primary"}`} />
              <div>
                <div className="font-bold text-base">{product.name} Assistant</div>
                <div className="flex gap-2 text-xs font-normal mt-1">
                  <Badge variant="secondary" className="text-xs">{product.bank}</Badge>
                </div>
              </div>
            </SheetTitle>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  window.speechSynthesis.cancel();
                }}
                className="text-slate-400 hover:text-primary"
                title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>

              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearChat}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
          <div className="flex gap-3 bg-slate-100 p-3 rounded-lg w-[85%]">
            <Bot className="w-5 h-5 mt-1 text-slate-500 flex-shrink-0" />
            <p className="text-sm text-slate-700">
              Hi! Ask me about the <strong>{product.name}</strong>. You can use the microphone to talk to me! 🎙️
            </p>
          </div>

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <Bot className="w-5 h-5 mt-1 text-slate-500 flex-shrink-0" />
              )}
              <div
                className={`p-3 rounded-lg text-sm max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-slate-400 text-sm pl-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              AI is thinking...
            </div>
          )}

          <div ref={bottomRef} className="h-1" />
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-slate-50 flex-none mt-auto">
          {isListening && (
            <div className="mb-2 text-xs text-red-500 flex items-center justify-center animate-pulse font-medium">
              Listening... Speak now
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Button
              type="button"
              
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleListening}
              className={isListening ? "animate-pulse cursor-pointer" : "cursor-pointer"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Type or speak..."}
              disabled={isLoading}
              className="flex-1"
            />

            <Button type="submit" className="cursor-pointer" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

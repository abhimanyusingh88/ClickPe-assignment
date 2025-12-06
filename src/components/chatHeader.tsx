import { Bot, Trash2, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

export default function ChatHeader({
  product,
  messages,
  voiceEnabled,
  setVoiceEnabled,
  handleClearChat,
  isSpeaking
}: any) {
  return (
    <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className={`w-6 h-6 ${isSpeaking ? "text-green-500 animate-pulse" : "text-primary"}`} />
        <div>
          <div className="font-bold text-base">{product.name} Assistant</div>
          <Badge variant="secondary" className="text-xs mt-1">{product.bank}</Badge>
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setVoiceEnabled(!voiceEnabled);
            window.speechSynthesis.cancel();
          }}
          className="text-slate-400 hover:text-primary"
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
  );
}

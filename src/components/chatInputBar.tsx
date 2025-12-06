import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";

export default function ChatInputBar({
  input,
  setInput,
  isLoading,
  isListening,
  toggleListening,
  handleSend
}: any) {
  return (
    <div className="p-4 border-t bg-slate-50">
      {isListening && (
        <div className="mb-2 text-xs text-red-500 flex justify-center animate-pulse">
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
          className={isListening ? "animate-pulse" : ""}
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

        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}

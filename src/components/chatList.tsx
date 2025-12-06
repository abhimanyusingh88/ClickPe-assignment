
import { Bot, Loader2 } from "lucide-react";
import ChatBubble from "./chatBubble";

export default function ChatList({ product, messages, isLoading, bottomRef }: any) {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">

      <div className="flex gap-3 bg-slate-100 p-3 rounded-lg w-[85%]">
        <Bot className="w-5 h-5 mt-1 text-slate-500" />
        <p className="text-sm text-slate-700">
          Hi! Ask me about <strong>{product.name}</strong>. You can use the microphone! 🎙️
        </p>
      </div>

      {messages.map((m: any, i: number) => (
        <ChatBubble key={i} msg={m} />
      ))}

      {isLoading && (
        <div className="flex gap-3 items-center text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          AI is thinking...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

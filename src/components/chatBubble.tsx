import { Bot } from "lucide-react";

export default function ChatBubble({ msg }: any) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && <Bot className="w-5 h-5 mt-1 text-slate-500" />}
      <div
        className={`p-3 rounded-lg text-sm max-w-[85%] ${
          isUser ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

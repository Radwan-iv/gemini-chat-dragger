import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { FileUploadZone } from "@/components/FileUploadZone";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSubmit: (content: string) => Promise<void>;
  onFileProcess: (content: string) => void;
}

const ChatInterface = ({ messages, isLoading, onSubmit, onFileProcess }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await onSubmit(input);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 mb-8">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pr-24 py-6 text-base"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-2">
            <FileUploadZone 
              onFileProcess={onFileProcess}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="text-base">↵</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import { FileUploadZone } from "@/components/FileUploadZone";
import { generateAIResponse } from "@/utils/apiUtils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      if (input.toLowerCase().includes("who made you")) {
        setMessages(prev => [...prev, { role: "assistant", content: "I was made by Omar Radwan." }]);
        return;
      }

      const response = await generateAIResponse(input);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error: any) {
      let errorMessage = "Failed to get response from Gemini";
      
      if (error?.status === 429 || (error?.body && error.body.includes("RESOURCE_EXHAUSTED"))) {
        errorMessage = "API rate limit exceeded. Please try again in a few moments. If this persists, consider using a different API key.";
      } else if (error?.status === 400 && error?.body?.includes("max tokens limit")) {
        errorMessage = "Your message is too long. Please try sending a shorter message.";
      }
      
      console.error("API Error:", error);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Error: ${errorMessage}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileContent = (content: string) => {
    setInput(content);
    const submitEvent = new Event('submit') as unknown as React.FormEvent;
    handleSubmit(submitEvent);
  };

  return (
    <div className="space-y-4 mb-8">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Ask a question or drag & drop files here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="pr-24 py-6 text-base"
            disabled={isLoading || !localStorage.getItem("GEMINI_API_KEY")}
          />
          <div className="absolute right-2 flex items-center gap-2">
            <FileUploadZone 
              onFileProcess={handleFileContent}
              disabled={isLoading || !localStorage.getItem("GEMINI_API_KEY")}
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={isLoading || !input.trim() || !localStorage.getItem("GEMINI_API_KEY")}
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
}
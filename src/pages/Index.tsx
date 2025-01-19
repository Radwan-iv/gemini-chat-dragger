import { useState } from "react";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { Header } from "@/components/Header";
import { SuggestedQuestions } from "@/components/SuggestedQuestions";
import { generateResponse } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PumpIcon } from "@/components/PumpIcon";

interface Source {
  title: string;
  link: string;
  snippet: string;
  icon?: string;
}

interface Message {
  content: string;
  role: "user" | "assistant";
  sources?: Source[];
  imageUrl?: string | null;
  additionalImages?: string[];
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (message: string, useWebSearch?: boolean) => {
    if (!message.trim()) return;
    
    setMessages((prev) => [...prev, { content: message, role: "user" }]);
    setIsLoading(true);

    try {
      const data = await generateResponse(message, useWebSearch, "gemini-1.5-pro");
      
      setMessages((prev) => [
        ...prev,
        { 
          content: data.response, 
          role: "assistant",
          sources: data.sources,
          imageUrl: data.imageUrl,
          additionalImages: data.additionalImages
        },
      ]);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 pt-32 pb-32">
        <div className="text-center mb-16">
          <div className="mb-6">
            <PumpIcon className="w-16 h-16 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Discover Smarter Search</h1>
          <p className="text-muted-foreground">
            Unlock intelligent search with our generative UI.
          </p>
        </div>

        {messages.length === 0 && (
          <div className="w-full mb-8">
            <SuggestedQuestions onQuestionClick={handleSubmit} />
          </div>
        )}

        <div className="w-full max-w-3xl space-y-6 mb-8">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              content={message.content}
              role={message.role}
              animate={index === messages.length - 1}
              sources={message.sources}
              imageUrl={message.imageUrl}
              additionalImages={message.additionalImages}
            />
          ))}
        </div>

        <div className="fixed bottom-8 left-4 right-4">
          <ChatInput 
            onSubmit={handleSubmit}
            isLoading={isLoading} 
          />
        </div>

        <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-end items-center bg-background/80 backdrop-blur-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/terms">Terms & Conditions</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </footer>
      </main>
    </div>
  );
};

export default Index;
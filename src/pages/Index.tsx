import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "@/hooks/use-toast";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SuggestedQuestions } from "@/components/SuggestedQuestions";
import { generateImage } from "@/components/ImageGeneration";
import ChatInterface from "@/components/ChatInterface";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (input: string) => {
    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (input.toLowerCase().includes("generate") && input.toLowerCase().includes("image")) {
        const imageBase64 = await generateImage(input);
        if (imageBase64) {
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: `![Generated Image](data:image/png;base64,${imageBase64})`
          }]);
        }
      } else {
        const { data: { secret: geminiApiKey }, error: secretError } = await supabase
          .from('secrets')
          .select('secret')
          .eq('name', 'GEMINI_API_KEY')
          .single();

        if (secretError || !geminiApiKey) {
          throw new Error('Gemini API key not found');
        }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(input);
        const response = await result.response;
        const text = response.text();
        setMessages(prev => [...prev, { role: "assistant", content: text }]);
      }
    } catch (error: any) {
      let errorMessage = "Failed to get response";
      
      if (error?.status === 400 && error?.body?.includes("max tokens limit")) {
        errorMessage = "Your message is too long. Please try sending a shorter message.";
      }
      else if (error?.status === 429 || (error?.body && error.body.includes("RESOURCE_EXHAUSTED"))) {
        errorMessage = "API rate limit exceeded. Please wait a moment before trying again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileContent = (content: string) => {
    handleSubmit(content);
  };

  const handleSuggestionSelect = (prompt: string) => {
    handleSubmit(prompt);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-background text-foreground relative">
      <div className="absolute left-4 top-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHistory(!showHistory)}
          className="relative"
          title="Search History"
        >
          <History className="h-5 w-5 text-foreground" />
        </Button>
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-7xl mx-auto pt-16 pb-24">
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/968021f0-74de-4bc8-8197-4762b5129888.png" 
            alt="Oil Pump Icon" 
            className="w-12 h-12 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-2">NCTU Petrolume Tech Smarter Search</h1>
          <p className="text-muted-foreground">Experience the power of intelligent search with our cutting-edge generative UI.</p>
        </div>

        <SuggestedQuestions onSelect={handleSuggestionSelect} />

        {showHistory && (
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h2 className="font-semibold mb-4">Chat History</h2>
            <div className="space-y-2">
              {messages.map((msg, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-medium">{msg.role}: </span>
                  {msg.content.substring(0, 50)}...
                </div>
              ))}
            </div>
          </div>
        )}

        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onFileProcess={handleFileContent}
        />
      </div>
    </div>
  );
};

export default Index;
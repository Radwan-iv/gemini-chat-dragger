import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatMessage from "@/components/ChatMessage";
import ApiKeyInput from "@/components/ApiKeyInput";
import { FileUploadZone } from "@/components/FileUploadZone";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const apiKey = localStorage.getItem("GEMINI_API_KEY");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key first.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(input);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (error: any) {
      let errorMessage = "Failed to get response from Gemini";
      
      // Check for token limit error
      if (error?.status === 400 && error?.body?.includes("max tokens limit")) {
        errorMessage = "Your message is too long. Please try sending a shorter message.";
      }
      // Check for rate limit error
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

  const handleFileContent = async (content: string) => {
    setInput(content);
  };

  // Check if API key exists
  const apiKey = localStorage.getItem("GEMINI_API_KEY");

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
      
      <div className="w-full max-w-3xl mx-auto pt-16 pb-24">
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/968021f0-74de-4bc8-8197-4762b5129888.png" 
            alt="Oil Pump Icon" 
            className="w-12 h-12 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-2">Discover Smarter Search</h1>
          <p className="text-muted-foreground">Unlock intelligent search with our generative UI.</p>
        </div>

        {!localStorage.getItem("GEMINI_API_KEY") && (
          <div className="mb-8">
            <ApiKeyInput />
          </div>
        )}

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
    </div>
  );
};

export default Index;
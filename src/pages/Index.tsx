import { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PaperclipIcon } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import ApiKeyInput from "@/components/ApiKeyInput";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const validFiles = files.filter(file => supportedTypes.includes(file.type));

    if (validFiles.length === 0) {
      toast({
        title: "Unsupported file type",
        description: "Please upload images (JPEG, PNG, GIF) or PDF files.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Files received",
      description: `Processing ${validFiles.length} file(s)`,
    });
  };

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
      toast({
        title: "Error",
        description: error.message || "Failed to get response from Gemini",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if API key exists
  const apiKey = localStorage.getItem("GEMINI_API_KEY");

  return (
    <div className="min-h-screen flex flex-col items-center px-4 bg-white">
      <div className="w-full max-w-3xl mx-auto pt-16 pb-24">
        <div className="text-center mb-12">
          <img 
            src="/lovable-uploads/b877689e-8ae9-46d7-87a4-7e33e215ac22.png" 
            alt="Logo" 
            className="w-12 h-12 mx-auto mb-6"
          />
          <h1 className="text-4xl font-bold mb-2">Discover Smarter Search</h1>
          <p className="text-gray-600">Unlock intelligent search with our generative UI.</p>
        </div>

        {!apiKey && (
          <div className="mb-8">
            <ApiKeyInput />
          </div>
        )}

        <div className="space-y-4 mb-8">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative"
          onDragEnter={handleDrag}
        >
          {dragActive && (
            <div
              className="absolute inset-0 bg-black/5 rounded-lg border-2 border-dashed border-black/20 flex items-center justify-center"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <p className="text-sm text-gray-600">Drop your files here</p>
              </div>
            </div>
          )}

          <div className="relative flex items-center">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={cn(
                "pr-20 py-6 text-base",
                dragActive && "pointer-events-none"
              )}
              disabled={isLoading || !apiKey}
            />
            <div className="absolute right-2 flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                accept="image/*,.pdf"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !apiKey}
              >
                <PaperclipIcon className="h-5 w-5 text-gray-400" />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading || !input.trim() || !apiKey}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-xs">↵</span>
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
import { History, RefreshCw, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApiKeyInput from "@/components/ApiKeyInput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SuggestedQuestions } from "@/components/SuggestedQuestions";
import { SearchConfigManager } from "@/components/SearchConfigManager";
import { Chat } from "@/components/Chat";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider
} from "@/components/ui/sidebar";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const handleClearHistory = () => {
    // We'll implement this in a future update with proper state management
    toast({
      title: "History cleared",
      description: "Your chat history has been cleared.",
    });
  };

  const handleRefreshHistory = () => {
    toast({
      title: "History refreshed",
      description: "Your chat history has been refreshed.",
    });
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <SearchConfigManager />
      <div className="min-h-screen flex bg-background text-foreground relative">
        {showHistory && (
          <Sidebar className="w-80 border-r">
            <SidebarHeader className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <h2 className="font-semibold">History</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefreshHistory}
                  title="Refresh History"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearHistory}
                  title="Clear History"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent className="p-4">
              <div className="text-center text-muted-foreground py-8">
                No search history
              </div>
            </SidebarContent>
          </Sidebar>
        )}

        <div className="flex-1 flex flex-col items-center px-4">
          <div className="absolute right-4 top-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleHistory}
              className="h-8 w-8"
            >
              <History className="h-4 w-4" />
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

            {!localStorage.getItem("GEMINI_API_KEY") && (
              <div className="mb-8">
                <ApiKeyInput />
              </div>
            )}

            <SuggestedQuestions onSelect={(prompt) => console.log(prompt)} />
            
            <Chat />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

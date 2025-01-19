import { Button } from "@/components/ui/button";
import { History, RefreshCw, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface SearchHistoryItem {
  id: string;
  query: string;
  created_at: string;
  response?: string;
}

export const Header = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const handleHistoryClick = async () => {
    try {
      const { data: history, error } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (history) {
        setSearchHistory(history);
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch history",
        variant: "destructive",
      });
    }
    setHistoryOpen(true);
  };

  const handleClearHistory = async () => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .not('id', 'is', null);
      
      if (error) throw error;
      
      setSearchHistory([]);
      toast({
        title: "History cleared",
        description: "Your search history has been cleared successfully.",
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 p-2 flex justify-between items-center z-50 bg-background/80 backdrop-blur-sm">
        <img 
          src="https://i.ibb.co/DQHQ4ZM/nctu-petroleum-tech.png" 
          alt="Logo" 
          width="150" 
          height="40"
          className="object-contain"
        />
        <div className="flex gap-2 items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleNewChat}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleHistoryClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" className="w-[400px] sm:w-[540px]">
          <SheetHeader className="space-y-4">
            <SheetTitle>Chat History</SheetTitle>
            <Button
              onClick={handleClearHistory}
              variant="destructive"
              className="flex gap-2 items-center"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </Button>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-10rem)] mt-6 pr-4">
            <div className="flex flex-col gap-4">
              {searchHistory.map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex flex-col gap-2">
                    <p className="font-medium">Question:</p>
                    <p className="text-sm text-muted-foreground">{item.query}</p>
                    {item.response && (
                      <>
                        <p className="font-medium mt-2">Response:</p>
                        <p className="text-sm text-muted-foreground">{item.response}</p>
                      </>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
};
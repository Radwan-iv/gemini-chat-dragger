import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface HistorySidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messages: Message[];
  onClearHistory: () => void;
}

const HistorySidebar = ({ open, onOpenChange, messages, onClearHistory }: HistorySidebarProps) => {
  const userMessages = messages.filter(msg => msg.role === "user");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[400px] bg-background p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <span>History</span>
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-auto p-4">
            {userMessages.map((message, index) => (
              <div
                key={index}
                className="mb-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <p className="text-sm text-foreground">{message.content}</p>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {new Date().toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <Button
              variant="destructive"
              className="w-full"
              onClick={onClearHistory}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySidebar;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mic, SkipForward, Globe2, MicOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  onSubmit: (message: string, useWebSearch?: boolean) => void;
  onFileUpload?: (file: File) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSubmit, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  const saveToHistory = async (query: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .insert({
          query,
          created_at: new Date().toISOString(),
          user_id: '00000000-0000-0000-0000-000000000000'
        });

      if (error) {
        console.error('Error saving to history:', error);
        toast({
          title: "Warning",
          description: "Failed to save to search history",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to save to history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Submit the chat message
    onSubmit(input, useWebSearch);
    
    // Try to save to history in the background
    await saveToHistory(input);

    // Clear input and reset transcript
    setInput("");
    resetTranscript();
  };

  const toggleVoiceInput = () => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Error",
        description: "Your browser doesn't support voice input",
        variant: "destructive",
      });
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      SpeechRecognition.startListening({ continuous: true });
      setIsListening(true);
      toast({
        title: "Voice Input Active",
        description: "Speak now...",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative">
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={useWebSearch}
              onCheckedChange={setUseWebSearch}
              id="web-search"
            />
            <label htmlFor="web-search" className="text-sm flex items-center gap-1 cursor-pointer">
              <Globe2 className="h-4 w-4" />
              Web Search
            </label>
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask a question or use voice input..."}
            className="chat-input pr-24"
            disabled={isLoading}
          />
          <div className="absolute right-2 flex gap-2">
            <Button
              type="button"
              size="icon"
              variant={isListening ? "default" : "ghost"}
              className="h-8 w-8"
              onClick={toggleVoiceInput}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-8 w-8"
            >
              {isLoading ? (
                <SkipForward className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
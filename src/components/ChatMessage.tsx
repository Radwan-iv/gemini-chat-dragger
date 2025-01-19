import { cn } from "@/lib/utils";
import { User, ThumbsUp, ThumbsDown, Copy, Check, Link2 } from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface Source {
  title: string;
  link: string;
  snippet: string;
  icon?: string;
}

interface ChatMessageProps {
  content: string;
  role: "assistant" | "user";
  animate?: boolean;
  sources?: Source[];
  imageUrl?: string | null;
  additionalImages?: string[];
}

export const ChatMessage = ({ 
  content, 
  role, 
  animate, 
  sources,
  imageUrl,
  additionalImages = []
}: ChatMessageProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const allImages = imageUrl ? [imageUrl, ...additionalImages] : additionalImages;

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (reaction === type) {
      // If clicking the same reaction, remove it
      setReaction(null);
      return;
    }

    try {
      const messageId = btoa(content).slice(0, 20);
      const { error } = await supabase
        .from('message_reactions')
        .upsert(
          { 
            message_id: messageId,
            likes: type === 'like' ? 1 : 0,
            dislikes: type === 'dislike' ? 1 : 0
          },
          { 
            onConflict: 'message_id'
          }
        );

      if (error) throw error;
      setReaction(type);
      
    } catch (error) {
      console.error('Error updating reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive",
      });
    }
  };

  const formatContent = (text: string) => {
    // Split by double newlines to separate sections
    const sections = text.split(/\n\n/).filter(Boolean);
    
    return sections.map((section, index) => {
      // Check if it's a main heading (all caps)
      if (/^[A-Z][A-Z\s]+:/.test(section)) {
        return (
          <div key={index} className="mt-6 mb-4">
            <h2 className="text-2xl font-bold text-primary">{section}</h2>
          </div>
        );
      }
      
      // Check if it's a subheading (ends with :)
      if (section.trim().endsWith(':')) {
        const bullets = section.split('• ').filter(Boolean);
        if (bullets.length > 1) {
          return (
            <div key={index} className="mt-4 mb-2">
              <h3 className="text-xl font-semibold text-primary mb-3">{bullets[0]}</h3>
              <ul className="list-none space-y-2">
                {bullets.slice(1).map((bullet, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-primary mr-2 mt-1.5">•</span>
                    <span>{bullet.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        return (
          <div key={index} className="mt-4 mb-2">
            <h3 className="text-xl font-semibold text-primary">{section}</h3>
          </div>
        );
      }

      // Handle bullet points
      if (section.includes('• ')) {
        const bullets = section.split('• ').filter(Boolean);
        return (
          <ul key={index} className="list-none space-y-2 mt-2 mb-4">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start">
                <span className="text-primary mr-2 mt-1.5">•</span>
                <span>{bullet.trim()}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Format bold and underlined text
      const formattedText = section
        .split(/(\*\*.*?\*\*|__.*?__)/g)
        .map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="text-primary">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('__') && part.endsWith('__')) {
            return <u key={i}>{part.slice(2, -2)}</u>;
          }
          return part;
        });

      // Regular paragraph
      return (
        <p key={index} className="mb-4">
          {formattedText}
        </p>
      );
    });
  };

  return (
    <>
      <motion.div
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex gap-3 p-6 rounded-lg",
          role === "assistant" ? "bg-black/90 text-white" : "bg-black/80 text-white"
        )}
      >
        <div className="w-6">
          {role === "assistant" ? (
            <img 
              src="/lovable-uploads/b91b5378-537b-4b24-8643-42181f7b958d.png" 
              alt="Assistant" 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div className="prose prose-sm max-w-none prose-invert">
            {formatContent(content)}
          </div>

          {allImages && allImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {allImages.map((img, index) => (
                <div 
                  key={index} 
                  className="relative cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`Related image ${index + 1}`}
                    className="rounded-lg object-cover w-full h-auto"
                  />
                </div>
              ))}
            </div>
          )}

          {sources && sources.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <Link2 className="w-4 h-4" />
                <span>Sources</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {sources.map((source, index) => (
                  <Card 
                    key={index} 
                    className="bg-black/50 border-gray-800 hover:bg-black/60 transition-colors overflow-hidden"
                  >
                    <a
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-stretch"
                    >
                      {source.icon && (
                        <div className="w-32 h-24 flex-shrink-0">
                          <img 
                            src={source.icon} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1">
                        <h5 className="font-medium text-sm text-gray-200 line-clamp-1 mb-2">
                          {source.title}
                        </h5>
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {source.snippet}
                        </p>
                      </div>
                    </a>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {role === "assistant" && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction('like')}
                className={cn(
                  "text-gray-400 hover:text-white",
                  reaction === 'like' && "text-green-500 hover:text-green-600"
                )}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReaction('dislike')}
                className={cn(
                  "text-gray-400 hover:text-white",
                  reaction === 'dislike' && "text-red-500 hover:text-red-600"
                )}
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-gray-400 hover:text-white"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>Copy</span>
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

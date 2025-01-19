import { Button } from "@/components/ui/button";
import { Construction, Fuel, Gauge, Droplets, Sparkles } from "lucide-react";

interface SuggestedQuestionsProps {
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions = ({ onQuestionClick }: SuggestedQuestionsProps) => {
  const suggestions = [
    {
      title: "Image Generation",
      description: "Create stunning images from text descriptions",
      icon: Construction,
      question: "Generate an image of a mountain landscape at sunset",
      gradient: "from-[#9b87f5] via-[#7E69AB] to-[#8B5CF6]"
    },
    {
      title: "Creative Writing",
      description: "Get help with copywriting and content creation",
      icon: Fuel,
      question: "Write an engaging ad copy for a new fitness app",
      gradient: "from-[#0EA5E9] via-[#1EAEDB] to-[#0FA0CE]"
    },
    {
      title: "Q&A Assistant",
      description: "Get answers to your questions instantly",
      icon: Gauge,
      question: "Explain how blockchain technology works",
      gradient: "from-[#E5DEFF] via-[#9b87f5] to-[#7E69AB]"
    },
    {
      title: "Content Summary",
      description: "Summarize any text into key points",
      icon: Droplets,
      question: "Summarize this article into main points",
      gradient: "from-[#8B5CF6] via-[#7E69AB] to-[#1A1F2C]"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-5xl mx-auto p-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-auto p-6 flex flex-col items-start gap-3 hover:scale-102 group transition-all duration-300 relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
          onClick={() => onQuestionClick(suggestion.question)}
        >
          <div 
            className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${suggestion.gradient}`}
            style={{ 
              backgroundSize: '200% 200%',
              animation: 'gradient 8s ease infinite'
            }}
          />
          
          <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-colors duration-300">
            <suggestion.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>

          <div className="relative z-10 text-left space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-white">{suggestion.title}</h3>
              <Sparkles className="w-4 h-4 text-white/60" />
            </div>
            <p className="text-sm text-white/70 line-clamp-2 group-hover:text-white/90 transition-colors">
              {suggestion.description}
            </p>
          </div>

          <div className="relative z-10 mt-auto pt-3 flex items-center text-sm text-white/60 gap-2 group-hover:text-white/90 transition-colors">
            Try this prompt
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Button>
      ))}
    </div>
  );
};
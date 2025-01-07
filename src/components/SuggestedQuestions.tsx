import { Image, Text, FileText, FileStack } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SuggestionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const SuggestionCard = ({ icon, title, description, onClick }: SuggestionCardProps) => (
  <Card 
    className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg bg-white dark:bg-gray-800"
    onClick={onClick}
  >
    <CardHeader>
      <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
        {icon}
      </div>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

export const SuggestedQuestions = ({ onSelect }: { onSelect: (prompt: string) => void }) => {
  const suggestions = [
    {
      icon: <Image className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Image Generation",
      description: "Produce images in various sizes and styles from text prompts, perfect for all your creative needs.",
      prompt: "Can you help me generate an image description for..."
    },
    {
      icon: <Text className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Ad Copywriting",
      description: "Create efficient copywriting that attracts your audience, driving engagement and conversions across channels.",
      prompt: "Write an engaging ad copy for..."
    },
    {
      icon: <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Helpdesk Article",
      description: "Develop detailed support articles to guide users through troubleshooting steps and product usage tips.",
      prompt: "Create a helpdesk article about..."
    },
    {
      icon: <FileStack className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Summary",
      description: "Efficiently summarize video, audio, or text content, choosing between long or short formats.",
      prompt: "Can you summarize this content..."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {suggestions.map((suggestion, index) => (
        <SuggestionCard
          key={index}
          icon={suggestion.icon}
          title={suggestion.title}
          description={suggestion.description}
          onClick={() => onSelect(suggestion.prompt)}
        />
      ))}
    </div>
  );
};
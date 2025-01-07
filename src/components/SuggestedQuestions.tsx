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
      title: "Generate Oil Field Image",
      description: "Create detailed images of oil fields, rigs, and industrial equipment using AI.",
      prompt: "Generate a photorealistic image of a modern oil field with multiple pump jacks during sunset, showing industrial equipment and storage tanks in the background."
    },
    {
      icon: <Text className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Technical Diagrams",
      description: "Generate technical diagrams and schematics for petroleum equipment.",
      prompt: "Create a detailed technical diagram of an oil pump jack mechanism with labels and annotations."
    },
    {
      icon: <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Safety Illustrations",
      description: "Create safety-related illustrations and warning signs for oil field operations.",
      prompt: "Generate a safety illustration showing proper PPE usage in an oil field environment."
    },
    {
      icon: <FileStack className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Process Visualization",
      description: "Visualize oil extraction and refining processes through detailed illustrations.",
      prompt: "Create a detailed visualization of the oil extraction process from underground reservoirs to surface collection."
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
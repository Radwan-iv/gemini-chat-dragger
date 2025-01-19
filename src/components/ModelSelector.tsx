import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ModelType = "gemini-1.5-pro" | "llama-3.1-70b-versatile";

interface ModelSelectorProps {
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
}

export const ModelSelector = ({ selectedModel, onModelSelect }: ModelSelectorProps) => {
  const models = [
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
    { id: "llama-3.1-70b-versatile", name: "Llama 3.1 70B" },
  ] as const;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {models.find(m => m.id === selectedModel)?.name || "Select Model"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelSelect(model.id)}
            className="flex items-center justify-between"
          >
            {model.name}
            {selectedModel === model.id && <Check className="w-4 h-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
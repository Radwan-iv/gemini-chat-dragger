import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("GEMINI_API_KEY", apiKey.trim());
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
    setApiKey("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your Gemini API key"
        className="w-full"
      />
      <Button type="submit" className="w-full">
        Save API Key
      </Button>
    </form>
  );
};

export default ApiKeyInput;
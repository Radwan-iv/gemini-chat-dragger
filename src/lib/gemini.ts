import { supabase } from "@/integrations/supabase/client";
import type { ModelType } from "@/components/ModelSelector";

interface Source {
  title: string;
  link: string;
  snippet: string;
  icon?: string;
}

interface ChatResponse {
  response: string;
  sources?: Source[];
  imageUrl?: string | null;
  additionalImages?: string[];
}

export async function generateResponse(
  prompt: string, 
  useWebSearch?: boolean,
  model: ModelType = "gemini-1.5-pro"
): Promise<ChatResponse> {
  try {
    console.log("Sending message to generateResponse:", prompt, "useWebSearch:", useWebSearch, "model:", model);
    
    // Create the request body
    const requestBody = {
      prompt,
      useWebSearch: useWebSearch || false,
      model
    };

    console.log("Sending request body:", requestBody);

    const { data, error } = await supabase.functions.invoke('chat', {
      body: requestBody, // Supabase client will handle JSON stringification
    });

    if (error) {
      console.error("Supabase function error:", error);
      throw error;
    }

    console.log("Received response from Supabase function:", data);
    return data;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw error;
  }
}
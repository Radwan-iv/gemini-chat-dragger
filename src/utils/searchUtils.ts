import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  imageUrl?: string;
}

export const performSearch = async (query: string, apiKey: string): Promise<SearchResult[]> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const searchPrompt = `
    Search query: "${query}"
    Please provide 3 relevant sources with accurate information about this topic.
    Format the response as a JSON array with objects containing:
    - title: The title of the source
    - url: The URL of the source
    - description: A brief description of the content
    - imageUrl (optional): URL of a relevant image if available
    
    Focus on reliable sources like industry reports, academic papers, and official websites.
  `;

  try {
    const result = await model.generateContent(searchPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    
    const results: SearchResult[] = JSON.parse(jsonMatch[0]);
    return results.slice(0, 3); // Limit to 3 results
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};
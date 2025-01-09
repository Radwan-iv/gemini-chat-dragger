import { GoogleGenerativeAI } from "@google/generative-ai";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateAIResponse(input: string, retries = 3): Promise<string> {
  const apiKey = localStorage.getItem("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("API key is required");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await model.generateContent(input);
      const response = await result.response;
      return response.text();
    } catch (error: any) {
      if (error?.status === 429 || (error?.body && error.body.includes("RESOURCE_EXHAUSTED"))) {
        console.log(`Rate limit hit, attempt ${attempt + 1} of ${retries}`);
        if (attempt === retries - 1) {
          throw error;
        }
        // Exponential backoff: wait longer between each retry
        await delay(Math.pow(2, attempt) * 1000);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Failed after maximum retries");
}
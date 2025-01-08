import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const generateImage = async (prompt: string) => {
  try {
    const { data: { secret: togetherApiKey }, error: secretError } = await supabase
      .from('secrets')
      .select('secret')
      .eq('name', 'TOGETHER_API_KEY')
      .single();

    if (secretError || !togetherApiKey) {
      throw new Error('API key not found');
    }

    const response = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${togetherApiKey}`
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: prompt,
        negative_prompt: "blurry, bad quality, distorted",
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.output.choices[0].image_base64;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
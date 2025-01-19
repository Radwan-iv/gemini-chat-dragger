import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      })
    }

    const { prompt, useWebSearch, model } = await req.json()
    console.log("Received request:", { prompt, useWebSearch, model })

    // Format the response with a clear structure
    const formattedPrompt = `
Please provide a well-organized response following this structure:

${prompt}

Response Guidelines:
• Use MAIN HEADINGS in caps followed by colon (e.g., "KEY FEATURES:")
• Place each heading and subheading on its own line
• Use subheadings with normal case followed by colon
• Use bullet points (•) for lists
• Keep paragraphs short and focused
• Add clear spacing between sections
• Highlight **key terms** in bold

Example Format:
MAIN HEADING:
This is an introduction paragraph.

Subheading:
• First bullet point
• Second bullet point

ANOTHER HEADING:
More content here.
`

    let searchResults = []
    if (useWebSearch) {
      try {
        const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${Deno.env.get('GOOGLE_API_KEY')}&cx=${Deno.env.get('GOOGLE_SEARCH_ENGINE_ID')}&q=${encodeURIComponent(prompt)}`
        const searchResponse = await fetch(searchUrl)
        const searchData = await searchResponse.json()

        if (!searchResponse.ok) {
          throw new Error(`Google Search API error: ${searchResponse.status} ${searchResponse.statusText}`)
        }

        searchResults = searchData.items?.map(item => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          icon: item.pagemap?.cse_image?.[0]?.src
        })) || []
      } catch (error) {
        console.error("Error in web search:", error)
        throw new Error(`Web search error: ${error.message}`)
      }
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const geminiModel = genAI.getGenerativeModel({ model: model || "gemini-1.5-pro" })

    // Prepare context from search results with structured format
    let context = ""
    if (searchResults.length > 0) {
      context = `Based on these search results:

Reference Materials:
${searchResults.map((result, index) => `
${index + 1}. ${result.title}
   • Source: ${result.link}
   • Summary: ${result.snippet}
`).join('\n')}

Please provide a comprehensive answer using the specified format above:
`
    }

    // Generate response
    const result = await geminiModel.generateContent(context + formattedPrompt)
    const response = await result.response
    const text = response.text()

    return new Response(
      JSON.stringify({
        response: text,
        sources: searchResults
      }),
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString() 
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

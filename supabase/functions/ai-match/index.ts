import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.length > 500) {
      return new Response(JSON.stringify({ error: "Invalid query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Fetch all businesses from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const bizResp = await fetch(`${supabaseUrl}/rest/v1/businesses?select=id,name,slug,category,description,phone,website,address,image_url,verified`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    const businesses = await bizResp.json();

    const businessList = businesses.map((b: any) => 
      `- ${b.name} (${b.category.replace(/-/g, " ")}): ${b.description || "No description"}. Address: ${b.address || "N/A"}. Phone: ${b.phone || "N/A"}. Verified: ${b.verified ? "Yes" : "No"}.`
    ).join("\n");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are the Alief Locals AI Matchmaker. You help residents of Alief, Houston TX find the perfect local business for their needs.

Given a resident's request in plain language, match them with the best businesses from this directory:

${businessList}

Rules:
- Return a JSON array of matches (max 5)
- Each match: { "name": string, "slug": string, "reason": string, "confidence": "high"|"medium"|"low" }
- "reason" should be a friendly, concise explanation of WHY this business fits
- If no businesses match, return an empty array with a "suggestion" field
- Consider language preferences, specialty needs, location proximity
- Be warm and community-focused in your reasoning`
          },
          { role: "user", content: query }
        ],
        tools: [{
          type: "function",
          function: {
            name: "match_businesses",
            description: "Return matched businesses for the user's request",
            parameters: {
              type: "object",
              properties: {
                matches: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      slug: { type: "string" },
                      reason: { type: "string" },
                      confidence: { type: "string", enum: ["high", "medium", "low"] }
                    },
                    required: ["name", "slug", "reason", "confidence"]
                  }
                },
                suggestion: { type: "string", description: "Friendly suggestion if no matches found" }
              },
              required: ["matches"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "match_businesses" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ matches: [], suggestion: "I couldn't find a match right now. Try searching our directory!" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-match error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

function getOpenAIClient(): { client: OpenAI; model: string } {
  // Prefer the user's own OpenAI API key (gpt-4o)
  const ownKey = process.env["OPENAI_API_KEY"];
  if (ownKey) {
    return {
      client: new OpenAI({ apiKey: ownKey }),
      model: "gpt-4o",
    };
  }

  // Fall back to Replit-managed AI proxy
  const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];
  if (!baseURL || !apiKey) {
    throw new Error("No OpenAI API key or Replit AI integration configured.");
  }
  return {
    client: new OpenAI({ baseURL, apiKey }),
    model: "gpt-4o-mini",
  };
}

const SYSTEM_PROMPT = `You are KisanMitra (किसान मित्र), an expert AI agricultural advisor for Indian farmers. 
You have deep knowledge of Indian farming practices, crops, soil types, weather patterns, government schemes, and market prices.

Your expertise includes:
- Crop cultivation (wheat, rice, tomato, onion, potato, cotton, sugarcane, pulses, vegetables)
- Soil health and fertilizer recommendations
- Pest and disease management with both organic and chemical solutions
- Irrigation methods (drip, sprinkler, flood)
- Weather-based farming advice
- Post-harvest storage and management
- Government schemes (PM-KISAN, Fasal Bima, Kisan Credit Card, etc.)
- Mandi prices and when to sell crops
- Organic and sustainable farming

Guidelines:
- Always respond in the same language as the user's question (Hindi or English)
- If in Hindi, use simple Hindi that rural farmers can understand (avoid complex Sanskrit words)
- Keep advice practical and actionable for small/marginal farmers
- Mention specific product names, quantities, and timings when relevant
- Be empathetic and encouraging to farmers
- If a question is not agriculture-related, gently redirect to farming topics
- Always end with a helpful follow-up suggestion or tip`;

router.post("/chat", async (req, res) => {
  const { message, language = "en" } = req.body as { message: string; language?: string };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    const { client: openai, model } = getOpenAIClient();

    const userMessage = language === "hi"
      ? `${message}\n\n(Please reply in Hindi)`
      : message;

    const stream = await openai.chat.completions.create({
      model,
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      stream: true,
    });

    let fullReply = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullReply += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    const suggestions =
      language === "hi"
        ? [
            "गेहूं की उपज कैसे बढ़ाएं?",
            "टमाटर में कीट से कैसे बचाएं?",
            "पीएम-किसान योजना क्या है?",
            "फसल बीमा कैसे कराएं?",
            "मंडी में अच्छा भाव कब मिलता है?",
          ]
        : [
            "How to increase wheat yield?",
            "How to protect tomatoes from pests?",
            "What is PM-KISAN scheme?",
            "How to get crop insurance?",
            "When do I get best mandi prices?",
          ];

    res.write(`data: ${JSON.stringify({ done: true, suggestions })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "Failed to get AI response. Please try again." })}\n\n`);
    res.end();
  }
});

export default router;

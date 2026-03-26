import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

type AIClient = { client: OpenAI; model: string };

function getUserClient(): AIClient | null {
  const ownKey = process.env["OPENAI_API_KEY"];
  if (!ownKey) return null;
  return { client: new OpenAI({ apiKey: ownKey }), model: "gpt-4o" };
}

function getReplitClient(): AIClient | null {
  const baseURL = process.env["AI_INTEGRATIONS_OPENAI_BASE_URL"];
  const apiKey = process.env["AI_INTEGRATIONS_OPENAI_API_KEY"];
  if (!baseURL || !apiKey) return null;
  return { client: new OpenAI({ baseURL, apiKey }), model: "gpt-4o-mini" };
}

function isQuotaError(err: any): boolean {
  return (
    err?.status === 429 ||
    err?.error?.code === "insufficient_quota" ||
    err?.error?.type === "insufficient_quota"
  );
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
- Always respond in the same language as the user's question (Hindi, Kannada, or English)
- If in Hindi, use simple Hindi that rural farmers can understand (avoid complex Sanskrit words)
- If in Kannada, use simple Kannada that rural Karnataka farmers can understand
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

  const langInstruction =
    language === "hi" ? "\n\n(Please reply in Hindi / हिंदी में जवाब दें)" :
    language === "kn" ? "\n\n(Please reply in Kannada / ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರ ನೀಡಿ)" :
    "";
  const userMessage = message + langInstruction;

  const suggestions =
    language === "hi"
      ? [
          "गेहूं की उपज कैसे बढ़ाएं?",
          "टमाटर में कीट से कैसे बचाएं?",
          "पीएम-किसान योजना क्या है?",
          "फसल बीमा कैसे कराएं?",
          "मंडी में अच्छा भाव कब मिलता है?",
        ]
      : language === "kn"
      ? [
          "ಗೋಧಿ ಇಳುವರಿ ಹೇಗೆ ಹೆಚ್ಚಿಸುವುದು?",
          "ಟೊಮೇಟೋ ಗಿಡಗಳಲ್ಲಿ ಕೀಟ ನಿಯಂತ್ರಣ ಹೇಗೆ?",
          "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ ಎಂದರೇನು?",
          "ಬೆಳೆ ವಿಮೆ ಹೇಗೆ ಪಡೆಯುವುದು?",
          "ಮಂಡಿಯಲ್ಲಿ ಉತ್ತಮ ಬೆಲೆ ಯಾವಾಗ ಸಿಗುತ್ತದೆ?",
        ]
      : [
          "How to increase wheat yield?",
          "How to protect tomatoes from pests?",
          "What is PM-KISAN scheme?",
          "How to get crop insurance?",
          "When do I get best mandi prices?",
        ];

  // Build ordered list of clients to try: user key first, Replit proxy as fallback
  const clients: AIClient[] = [];
  const userClient = getUserClient();
  if (userClient) clients.push(userClient);
  const replitClient = getReplitClient();
  if (replitClient) clients.push(replitClient);

  if (clients.length === 0) {
    res.write(`data: ${JSON.stringify({ error: "No AI service configured." })}\n\n`);
    res.end();
    return;
  }

  for (let i = 0; i < clients.length; i++) {
    const { client: openai, model } = clients[i];
    try {
      const stream = await openai.chat.completions.create({
        model,
        max_tokens: 2048,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, suggestions })}\n\n`);
      res.end();
      return; // success — stop trying further clients
    } catch (err: any) {
      const isLast = i === clients.length - 1;
      if (isQuotaError(err) && !isLast) {
        // Quota exceeded on this client — silently try the next one
        console.warn(`[AI] Client ${i} quota exceeded, falling back to next client`);
        continue;
      }
      // Final failure or non-quota error
      console.error("[AI route error]", err?.status, err?.message, err?.error);
      res.write(`data: ${JSON.stringify({ error: "Failed to get AI response. Please try again." })}\n\n`);
      res.end();
      return;
    }
  }
});

export default router;

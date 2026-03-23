import { Router, type IRouter } from "express";
import { AiChatBody, AiChatResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const cropResponses: Record<string, { en: string; hi: string }> = {
  wheat: {
    en: "Wheat grows best in cool weather (15-20°C). Sow in November-December. Water 4-6 times during the season. Apply DAP fertilizer at sowing. Watch out for yellow rust disease and aphids. Harvest when grains are hard and golden yellow.",
    hi: "गेहूं ठंडे मौसम (15-20°C) में सबसे अच्छा उगता है। नवंबर-दिसंबर में बोएं। मौसम में 4-6 बार पानी दें। बुवाई के समय DAP खाद डालें। पीली रस्ट बीमारी और एफिड कीट से सावधान रहें।",
  },
  rice: {
    en: "Rice needs warm temperatures (20-35°C) and plenty of water. Transplant seedlings after 25-30 days. Keep 5cm water in fields. Apply nitrogen fertilizer in 3 splits. Harvest when 80% grains turn golden.",
    hi: "चावल को गर्म तापमान (20-35°C) और भरपूर पानी चाहिए। 25-30 दिन बाद पौधे रोपें। खेतों में 5 सेमी पानी रखें। नाइट्रोजन खाद 3 बार में डालें।",
  },
  tomato: {
    en: "Tomatoes need 6-8 hours sunlight daily. Water regularly but avoid waterlogging. Use drip irrigation for best results. Support plants with stakes. Common pests: fruit borer, whitefly. Spray neem oil for organic control.",
    hi: "टमाटर को रोजाना 6-8 घंटे धूप चाहिए। नियमित पानी दें लेकिन जलभराव से बचें। ड्रिप सिंचाई सबसे अच्छी है। पौधों को खूंटों से सहारा दें। सामान्य कीट: फल छेदक, सफेद मक्खी।",
  },
  onion: {
    en: "Onions need well-drained sandy loam soil. Transplant seedlings at 4-6 leaf stage. Reduce water 2 weeks before harvest. Cure bulbs in shade for 7-10 days after harvest. Store in cool, dry place with good ventilation.",
    hi: "प्याज के लिए अच्छी जल निकासी वाली बलुई दोमट मिट्टी चाहिए। 4-6 पत्ती अवस्था में पौधे रोपें। कटाई से 2 सप्ताह पहले पानी कम करें। कटाई के बाद 7-10 दिन छाया में सुखाएं।",
  },
  potato: {
    en: "Potatoes grow best in loose, well-drained soil. Plant certified seed potatoes in October-November. Earth up plants when they are 15cm tall. Stop watering 2-3 weeks before harvest. Common disease: late blight — use copper-based fungicide.",
    hi: "आलू ढीली, अच्छी जल निकासी वाली मिट्टी में सबसे अच्छा उगता है। अक्टूबर-नवंबर में प्रमाणित बीज आलू लगाएं। 15 सेमी ऊंचे होने पर मिट्टी चढ़ाएं। कटाई से 2-3 सप्ताह पहले पानी बंद करें।",
  },
  default: {
    en: "Thank you for your question! For best crop advice, ensure your soil is well-prepared with proper nutrients. Use certified seeds, follow recommended spacing, water adequately without waterlogging, and apply fertilizers as per soil test recommendations. Contact your local KVK (Krishi Vigyan Kendra) for crop-specific guidance.",
    hi: "आपके प्रश्न के लिए धन्यवाद! सर्वोत्तम फसल सलाह के लिए, अपनी मिट्टी को उचित पोषक तत्वों के साथ तैयार करें। प्रमाणित बीजों का उपयोग करें, अनुशंसित दूरी का पालन करें, जलभराव के बिना पर्याप्त पानी दें। फसल-विशिष्ट मार्गदर्शन के लिए अपने स्थानीय KVK से संपर्क करें।",
  },
};

const suggestions = {
  en: [
    "How to increase wheat yield?",
    "What fertilizer is best for tomatoes?",
    "How to prevent pest attacks?",
    "When should I irrigate my crop?",
    "Which crops are best for summer?",
  ],
  hi: [
    "गेहूं की उपज कैसे बढ़ाएं?",
    "टमाटर के लिए कौन सी खाद सबसे अच्छी है?",
    "कीट हमलों को कैसे रोकें?",
    "फसल को कब सिंचाई करनी चाहिए?",
    "गर्मियों के लिए कौन सी फसलें सबसे अच्छी हैं?",
  ],
};

router.post("/chat", (req, res) => {
  const body = AiChatBody.parse(req.body);
  const message = body.message.toLowerCase();
  const lang = (body.language ?? "en") as "en" | "hi";

  let reply = "";
  if (message.includes("wheat") || message.includes("गेहूं")) {
    reply = cropResponses.wheat[lang];
  } else if (message.includes("rice") || message.includes("paddy") || message.includes("चावल") || message.includes("धान")) {
    reply = cropResponses.rice[lang];
  } else if (message.includes("tomato") || message.includes("टमाटर")) {
    reply = cropResponses.tomato[lang];
  } else if (message.includes("onion") || message.includes("प्याज")) {
    reply = cropResponses.onion[lang];
  } else if (message.includes("potato") || message.includes("आलू")) {
    reply = cropResponses.potato[lang];
  } else {
    reply = cropResponses.default[lang];
  }

  const data = AiChatResponse.parse({
    reply,
    suggestions: suggestions[lang],
  });

  res.json(data);
});

export default router;

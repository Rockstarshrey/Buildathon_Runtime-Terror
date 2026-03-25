import { CommunityPost } from "../models/CommunityPost";
import { MandiPrice } from "../models/MandiPrice";
import { GovernmentScheme } from "../models/GovernmentScheme";
import { logger } from "./logger";

const communityPosts = [
  {
    author: "Ramesh Kumar",
    location: "Muzaffarpur, Bihar",
    content: "My wheat crop is showing yellow leaves. What could be the reason? I irrigated well last week.",
    contentHindi: "मेरी गेहूं की फसल में पीले पत्ते आ रहे हैं। कारण क्या हो सकता है? मैंने पिछले हफ्ते अच्छी सिंचाई की थी।",
    category: "question",
    timestamp: new Date("2026-03-23T09:15:00Z"),
    likes: 12,
  },
  {
    author: "Sunita Devi",
    location: "Amritsar, Punjab",
    content: "Tip: Spraying neem oil solution once a week greatly reduces pest attacks on tomato plants. Works very well for me!",
    contentHindi: "टिप: नीम का तेल घोल सप्ताह में एक बार छिड़कने से टमाटर के पौधों पर कीट का हमला काफी कम हो जाता है।",
    category: "tip",
    timestamp: new Date("2026-03-22T14:30:00Z"),
    likes: 45,
  },
  {
    author: "Mahesh Patel",
    location: "Nashik, Maharashtra",
    content: "Onion prices at Nashik mandi have increased to ₹2800 per quintal today. Farmers should consider selling now.",
    contentHindi: "नासिक मंडी में आज प्याज की कीमतें बढ़कर ₹2800 प्रति क्विंटल हो गई हैं। किसानों को अभी बेचने पर विचार करना चाहिए।",
    category: "news",
    timestamp: new Date("2026-03-23T07:00:00Z"),
    likes: 89,
  },
  {
    author: "Dharmendra Singh",
    location: "Lucknow, Uttar Pradesh",
    content: "Heavy rain forecast for next 3 days in eastern UP. Farmers should harvest their rabi crops urgently.",
    contentHindi: "पूर्वी यूपी में अगले 3 दिनों के लिए भारी बारिश का पूर्वानुमान है। किसानों को तुरंत रबी फसल काटनी चाहिए।",
    category: "weather",
    timestamp: new Date("2026-03-22T18:00:00Z"),
    likes: 134,
  },
  {
    author: "Kavita Sharma",
    location: "Jaipur, Rajasthan",
    content: "I applied for PM-KISAN and received ₹6000 in my account. The process is very easy — apply at your nearest CSC center!",
    contentHindi: "मैंने पीएम-किसान के लिए आवेदन किया और मेरे खाते में ₹6000 मिल गए। प्रक्रिया बहुत आसान है — नजदीकी CSC केंद्र पर आवेदन करें!",
    category: "tip",
    timestamp: new Date("2026-03-21T11:30:00Z"),
    likes: 67,
  },
  {
    author: "Baldev Rao",
    location: "Warangal, Telangana",
    content: "Cotton crop suffering from pink bollworm attack. Which pesticide should I use? Please advise urgently.",
    contentHindi: "कपास की फसल गुलाबी सुंडी के हमले से पीड़ित है। कौन सा कीटनाशक इस्तेमाल करूं? कृपया तुरंत सलाह दें।",
    category: "question",
    timestamp: new Date("2026-03-23T08:45:00Z"),
    likes: 23,
  },
];

const mandiPrices = [
  // ── Wheat ──────────────────────────────────────────────────────────────────
  { crop: "Wheat",       cropHindi: "गेहूं",      market: "Azadpur Mandi",       state: "Delhi",             minPrice: 2100, maxPrice: 2350, modalPrice: 2200, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Wheat",       cropHindi: "गेहूं",      market: "Ludhiana Mandi",      state: "Punjab",            minPrice: 2050, maxPrice: 2300, modalPrice: 2150, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Wheat",       cropHindi: "गेहूं",      market: "Bhopal Mandi",        state: "Madhya Pradesh",    minPrice: 1950, maxPrice: 2200, modalPrice: 2080, unit: "quintal", date: "2026-03-25", trend: "up"     },
  // ── Rice ───────────────────────────────────────────────────────────────────
  { crop: "Rice",        cropHindi: "चावल",       market: "Karnal Mandi",        state: "Haryana",           minPrice: 1900, maxPrice: 2400, modalPrice: 2100, unit: "quintal", date: "2026-03-25", trend: "up"     },
  { crop: "Rice",        cropHindi: "चावल",       market: "Cuttack Mandi",       state: "Odisha",            minPrice: 1800, maxPrice: 2200, modalPrice: 2000, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Rice",        cropHindi: "चावल",       market: "Thanjavur Mandi",     state: "Tamil Nadu",        minPrice: 2200, maxPrice: 2700, modalPrice: 2450, unit: "quintal", date: "2026-03-25", trend: "up"     },
  // ── Vegetables ─────────────────────────────────────────────────────────────
  { crop: "Tomato",      cropHindi: "टमाटर",      market: "Nashik Mandi",        state: "Maharashtra",       minPrice:  800, maxPrice: 1400, modalPrice: 1100, unit: "quintal", date: "2026-03-25", trend: "up"     },
  { crop: "Tomato",      cropHindi: "टमाटर",      market: "Kolar Mandi",         state: "Karnataka",         minPrice:  600, maxPrice: 1200, modalPrice:  950, unit: "quintal", date: "2026-03-25", trend: "down"   },
  { crop: "Onion",       cropHindi: "प्याज",      market: "Lasalgaon Mandi",     state: "Maharashtra",       minPrice: 2600, maxPrice: 3400, modalPrice: 3000, unit: "quintal", date: "2026-03-25", trend: "up"     },
  { crop: "Onion",       cropHindi: "प्याज",      market: "Mahabaleshwar Mandi", state: "Maharashtra",       minPrice: 2400, maxPrice: 3200, modalPrice: 2800, unit: "quintal", date: "2026-03-25", trend: "up"     },
  { crop: "Potato",      cropHindi: "आलू",        market: "Agra Mandi",          state: "Uttar Pradesh",     minPrice:  700, maxPrice: 1100, modalPrice:  900, unit: "quintal", date: "2026-03-25", trend: "down"   },
  { crop: "Potato",      cropHindi: "आलू",        market: "Jalandhar Mandi",     state: "Punjab",            minPrice:  750, maxPrice: 1050, modalPrice:  875, unit: "quintal", date: "2026-03-25", trend: "down"   },
  { crop: "Cauliflower", cropHindi: "फूलगोभी",    market: "Hooghly Mandi",       state: "West Bengal",       minPrice:  300, maxPrice:  700, modalPrice:  480, unit: "quintal", date: "2026-03-25", trend: "down"   },
  { crop: "Spinach",     cropHindi: "पालक",        market: "Chennai Mandi",       state: "Tamil Nadu",        minPrice:  400, maxPrice:  900, modalPrice:  620, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Garlic",      cropHindi: "लहसुन",       market: "Mandsaur Mandi",      state: "Madhya Pradesh",    minPrice: 4500, maxPrice: 7000, modalPrice: 5800, unit: "quintal", date: "2026-03-25", trend: "down"   },
  // ── Cash Crops ─────────────────────────────────────────────────────────────
  { crop: "Cotton",      cropHindi: "कपास",        market: "Rajkot Mandi",        state: "Gujarat",           minPrice: 6200, maxPrice: 7400, modalPrice: 6800, unit: "quintal", date: "2026-03-25", trend: "up"     },
  { crop: "Sugarcane",   cropHindi: "गन्ना",       market: "Muzaffarnagar Mandi", state: "Uttar Pradesh",     minPrice:  350, maxPrice:  420, modalPrice:  390, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Soybean",     cropHindi: "सोयाबीन",    market: "Indore Mandi",        state: "Madhya Pradesh",    minPrice: 4100, maxPrice: 4900, modalPrice: 4500, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Mustard",     cropHindi: "सरसों",       market: "Jaipur Mandi",        state: "Rajasthan",         minPrice: 5200, maxPrice: 6100, modalPrice: 5650, unit: "quintal", date: "2026-03-25", trend: "up"     },
  { crop: "Groundnut",   cropHindi: "मूंगफली",     market: "Junagadh Mandi",      state: "Gujarat",           minPrice: 5500, maxPrice: 6500, modalPrice: 5900, unit: "quintal", date: "2026-03-25", trend: "up"     },
  // ── Pulses ─────────────────────────────────────────────────────────────────
  { crop: "Chickpea",    cropHindi: "चना",         market: "Akola Mandi",         state: "Maharashtra",       minPrice: 4800, maxPrice: 5600, modalPrice: 5200, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Maize",       cropHindi: "मक्का",       market: "Davangere Mandi",     state: "Karnataka",         minPrice: 1700, maxPrice: 2100, modalPrice: 1900, unit: "quintal", date: "2026-03-25", trend: "down"   },
  // ── Spices & Fruits ────────────────────────────────────────────────────────
  { crop: "Turmeric",    cropHindi: "हल्दी",       market: "Nizamabad Mandi",     state: "Telangana",         minPrice: 7000, maxPrice: 9500, modalPrice: 8200, unit: "quintal", date: "2026-03-25", trend: "up"     },
  { crop: "Banana",      cropHindi: "केला",        market: "Anand Mandi",         state: "Gujarat",           minPrice: 1200, maxPrice: 1800, modalPrice: 1500, unit: "quintal", date: "2026-03-25", trend: "stable" },
  { crop: "Apple",       cropHindi: "सेब",         market: "Shimla Mandi",        state: "Himachal Pradesh",  minPrice: 4500, maxPrice: 6800, modalPrice: 5600, unit: "quintal", date: "2026-03-25", trend: "up"     },
];

const governmentSchemes = [
  {
    name: "PM-KISAN",
    nameHindi: "पीएम किसान सम्मान निधि",
    description: "Pradhan Mantri Kisan Samman Nidhi provides income support of ₹6,000 per year to all small and marginal farmer families across India.",
    descriptionHindi: "प्रधानमंत्री किसान सम्मान निधि योजना के तहत सभी छोटे और सीमांत किसान परिवारों को प्रति वर्ष ₹6,000 की आय सहायता प्रदान की जाती है।",
    benefit: "₹6,000 per year (₹2,000 every 4 months)",
    eligibility: "All landholding farmer families with cultivable land up to 2 hectares",
    applyLink: "https://pmkisan.gov.in",
    category: "income",
    icon: "💰",
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana",
    nameHindi: "प्रधानमंत्री फसल बीमा योजना",
    description: "Comprehensive crop insurance scheme that provides financial support to farmers suffering crop loss/damage due to unforeseen events like natural calamities, pests, and diseases.",
    descriptionHindi: "यह व्यापक फसल बीमा योजना प्राकृतिक आपदाओं, कीटों और बीमारियों जैसी अप्रत्याशित घटनाओं के कारण फसल नुकसान से पीड़ित किसानों को वित्तीय सहायता प्रदान करती है।",
    benefit: "Full compensation for crop loss. Premium as low as 2% for Kharif and 1.5% for Rabi crops",
    eligibility: "All farmers growing notified crops in notified areas. Compulsory for loanee farmers",
    applyLink: "https://pmfby.gov.in",
    category: "insurance",
    icon: "🛡️",
  },
  {
    name: "Kisan Credit Card",
    nameHindi: "किसान क्रेडिट कार्ड",
    description: "Provides farmers with timely and adequate credit support from the banking system for their cultivation and other needs at low interest rates.",
    descriptionHindi: "यह योजना किसानों को बैंकिंग प्रणाली से खेती और अन्य जरूरतों के लिए कम ब्याज दरों पर समय पर पर्याप्त ऋण सहायता प्रदान करती है।",
    benefit: "Credit up to ₹3 lakh at 4% interest rate per annum (with interest subvention)",
    eligibility: "All farmers, sharecroppers, oral lessees, and tenant farmers",
    applyLink: "https://www.nabard.org",
    category: "credit",
    icon: "💳",
  },
  {
    name: "Soil Health Card Scheme",
    nameHindi: "मृदा स्वास्थ्य कार्ड योजना",
    description: "Provides farmers with soil health cards carrying crop-wise recommendations of nutrients and fertilizers required for individual farms to help improve productivity.",
    descriptionHindi: "किसानों को मृदा स्वास्थ्य कार्ड प्रदान करता है जिसमें उत्पादकता सुधार के लिए फसल-वार पोषक तत्व और उर्वरक सिफारिशें होती हैं।",
    benefit: "Free soil testing and nutrient recommendations to reduce fertilizer costs by up to 30%",
    eligibility: "All farmers. Soil tested once every 2 years",
    applyLink: "https://soilhealth.dac.gov.in",
    category: "advisory",
    icon: "🌱",
  },
  {
    name: "PM Krishi Sinchayee Yojana",
    nameHindi: "पीएम कृषि सिंचाई योजना",
    description: "Aims to enhance water use efficiency through the principle of 'More Crop Per Drop'.",
    descriptionHindi: "'प्रति बूंद अधिक फसल' के सिद्धांत के माध्यम से जल उपयोग दक्षता बढ़ाने का लक्ष्य रखती है।",
    benefit: "55% subsidy on micro-irrigation systems (drip/sprinkler). SC/ST farmers get 45% additional subsidy",
    eligibility: "All farmers. Priority to small, marginal and tribal farmers",
    applyLink: "https://pmksy.gov.in",
    category: "infrastructure",
    icon: "💧",
  },
  {
    name: "eNAM - National Agriculture Market",
    nameHindi: "ई-नाम - राष्ट्रीय कृषि बाजार",
    description: "An online trading platform for agricultural commodities that networks existing mandis to create a unified national market.",
    descriptionHindi: "कृषि वस्तुओं के लिए एक ऑनलाइन ट्रेडिंग प्लेटफॉर्म जो मौजूदा मंडियों को जोड़कर एकीकृत राष्ट्रीय बाजार बनाता है।",
    benefit: "Better price discovery, reduced transaction costs, access to wider market",
    eligibility: "All registered farmers, traders, and FPOs",
    applyLink: "https://enam.gov.in",
    category: "market",
    icon: "🏪",
  },
];

export async function seedDatabase() {
  const postCount = await CommunityPost.countDocuments();
  if (postCount === 0) {
    await CommunityPost.insertMany(communityPosts);
    logger.info("Seeded community posts");
  }

  const priceCount = await MandiPrice.countDocuments();
  if (priceCount < mandiPrices.length) {
    await MandiPrice.deleteMany({});
    await MandiPrice.insertMany(mandiPrices);
    logger.info(`Seeded ${mandiPrices.length} mandi prices`);
  }

  const schemeCount = await GovernmentScheme.countDocuments();
  if (schemeCount === 0) {
    await GovernmentScheme.insertMany(governmentSchemes);
    logger.info("Seeded government schemes");
  }
}

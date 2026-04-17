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
    description: "Pradhan Mantri Kisan Samman Nidhi provides direct income support of ₹6,000 per year to all farmer families across India, transferred directly to bank accounts in three equal installments.",
    descriptionHindi: "प्रधानमंत्री किसान सम्मान निधि योजना के तहत सभी किसान परिवारों को प्रति वर्ष ₹6,000 की सीधी आय सहायता तीन किस्तों में बैंक खाते में दी जाती है।",
    benefit: "₹6,000 per year (₹2,000 every 4 months) direct bank transfer",
    eligibility: "All landholding farmer families. Excludes institutional landholders, government employees, income tax payers",
    applyLink: "https://pmkisan.gov.in",
    category: "income",
    icon: "💰",
  },
  {
    name: "PM Fasal Bima Yojana (PMFBY)",
    nameHindi: "प्रधानमंत्री फसल बीमा योजना",
    description: "Comprehensive crop insurance covering pre-sowing to post-harvest losses due to natural calamities, pests and diseases. Uses satellite and drone technology for faster claim settlement.",
    descriptionHindi: "बुआई पूर्व से कटाई के बाद तक प्राकृतिक आपदाओं, कीटों और बीमारियों के कारण फसल नुकसान के लिए व्यापक बीमा। उपग्रह और ड्रोन तकनीक से त्वरित दावा निपटान।",
    benefit: "Full insured sum for crop loss. Premium: 2% (Kharif), 1.5% (Rabi), 5% (commercial/horticultural crops)",
    eligibility: "All farmers growing notified crops. Mandatory for loanee farmers, voluntary for others",
    applyLink: "https://pmfby.gov.in",
    category: "insurance",
    icon: "🛡️",
  },
  {
    name: "Kisan Credit Card (KCC)",
    nameHindi: "किसान क्रेडिट कार्ड",
    description: "Flexible revolving credit for crop cultivation, post-harvest expenses, allied activities and consumption needs. Includes personal accident insurance and ATM-enabled RuPay card.",
    descriptionHindi: "फसल उत्पादन, कटाई के बाद के खर्च, संबद्ध गतिविधियों और उपभोग जरूरतों के लिए लचीला ऋण। व्यक्तिगत दुर्घटना बीमा और रुपे कार्ड शामिल।",
    benefit: "Credit up to ₹3 lakh at 4% p.a. (7% with 3% govt subvention). Up to ₹5 lakh for allied activities",
    eligibility: "All farmers, sharecroppers, oral lessees, tenant farmers, SHGs/JLGs of farmers",
    applyLink: "https://www.nabard.org/kisan-credit-card.aspx",
    category: "credit",
    icon: "💳",
  },
  {
    name: "Soil Health Card Scheme",
    nameHindi: "मृदा स्वास्थ्य कार्ड योजना",
    description: "Free soil testing at government labs with crop-wise fertilizer and nutrient recommendations printed on a card. Helps farmers reduce input costs while improving soil fertility and productivity.",
    descriptionHindi: "सरकारी प्रयोगशालाओं में मुफ्त मिट्टी परीक्षण और फसल-वार उर्वरक व पोषक तत्व सिफारिशें। किसानों को लागत कम करने और मिट्टी की उर्वरता बढ़ाने में मदद करता है।",
    benefit: "Free soil testing every 2 years. Recommendations reduce fertilizer costs by 20–30%",
    eligibility: "All farmers across India. Soil tested at government labs free of cost",
    applyLink: "https://soilhealth.dac.gov.in",
    category: "advisory",
    icon: "🌱",
  },
  {
    name: "PM Krishi Sinchayee Yojana (PMKSY)",
    nameHindi: "पीएम कृषि सिंचाई योजना",
    description: "Expands irrigation coverage and improves water use efficiency through drip and sprinkler systems under 'Har Khet Ko Pani, More Crop Per Drop'. Integrates watershed development and groundwater management.",
    descriptionHindi: "'हर खेत को पानी, प्रति बूंद अधिक फसल' के तहत ड्रिप और स्प्रिंकलर प्रणाली से सिंचाई क्षेत्र का विस्तार। जलग्रहण विकास और भूजल प्रबंधन एकीकृत।",
    benefit: "55% subsidy on micro-irrigation. SC/ST and small/marginal farmers: up to 100% subsidy in some states",
    eligibility: "All farmers. Priority to small, marginal, SC/ST and tribal farmers",
    applyLink: "https://pmksy.gov.in",
    category: "infrastructure",
    icon: "💧",
  },
  {
    name: "eNAM – National Agriculture Market",
    nameHindi: "ई-नाम – राष्ट्रीय कृषि बाजार",
    description: "Pan-India electronic trading portal linking 1,000+ APMCs enabling farmers to sell produce online for better price discovery. Enables payment via NEFT/RTGS directly to farmer accounts.",
    descriptionHindi: "1,000+ APMCs को जोड़ने वाला अखिल भारतीय ई-ट्रेडिंग पोर्टल जिससे किसान ऑनलाइन उपज बेच सकते हैं। NEFT/RTGS से सीधे किसान खाते में भुगतान।",
    benefit: "Better price discovery, transparent bidding, lower transaction costs, direct bank payment",
    eligibility: "All registered farmers, traders, commission agents and FPOs in states on eNAM platform",
    applyLink: "https://enam.gov.in",
    category: "market",
    icon: "🏪",
  },
  {
    name: "PM-KUSUM Scheme",
    nameHindi: "पीएम कुसुम योजना",
    description: "Pradhan Mantri Kisan Urja Suraksha Utthan Mahabhiyan supports solarisation of agricultural pumps and grid-connected solar plants. Farmers can earn extra income by selling surplus solar power to DISCOMs.",
    descriptionHindi: "कृषि पंपों के सौरीकरण और ग्रिड से जुड़े सौर संयंत्रों का समर्थन। किसान अतिरिक्त सौर ऊर्जा DISCOMs को बेचकर अतिरिक्त आय कमा सकते हैं।",
    benefit: "60% subsidy (30% central + 30% state) on solar pumps. Earn ₹15,000–₹20,000/acre/year selling surplus power",
    eligibility: "Individual farmers, water user associations, FPOs, panchayats with agricultural land",
    applyLink: "https://pmkusum.mnre.gov.in",
    category: "infrastructure",
    icon: "☀️",
  },
  {
    name: "PM Kisan Maan Dhan Yojana",
    nameHindi: "पीएम किसान मान-धन योजना",
    description: "Voluntary pension scheme for small and marginal farmers providing guaranteed monthly pension of ₹3,000 after age 60. Government contributes matching amount to each farmer's contribution.",
    descriptionHindi: "छोटे और सीमांत किसानों के लिए स्वैच्छिक पेंशन योजना जो 60 वर्ष की आयु के बाद ₹3,000 मासिक पेंशन की गारंटी देती है।",
    benefit: "₹3,000/month pension after age 60. Govt matches farmer's monthly contribution (₹55–₹200)",
    eligibility: "Small/marginal farmers aged 18–40 with landholding up to 2 hectares. Not covered under other pension schemes",
    applyLink: "https://maandhan.in",
    category: "pension",
    icon: "👴",
  },
  {
    name: "Rashtriya Krishi Vikas Yojana (RKVY)",
    nameHindi: "राष्ट्रीय कृषि विकास योजना",
    description: "Flexible grant funding to states for agriculture and allied sectors to fill gaps not covered by other schemes. Supports infrastructure, post-harvest management, agri-startups and farmer producer organisations.",
    descriptionHindi: "राज्यों को कृषि और संबद्ध क्षेत्रों में अन्य योजनाओं से न कवर होने वाले अंतरालों को भरने के लिए लचीला अनुदान। बुनियादी ढांचे, स्टार्टअप और FPO का समर्थन।",
    benefit: "Infrastructure grants, innovation funding, agri-startup incubation support up to ₹25 lakh per project",
    eligibility: "State governments, farmer groups, FPOs, agri-enterprises and agri-startups",
    applyLink: "https://rkvy.nic.in",
    category: "infrastructure",
    icon: "🚜",
  },
  {
    name: "Sub-Mission on Agricultural Mechanisation (SMAM)",
    nameHindi: "कृषि यंत्रीकरण पर उप-मिशन",
    description: "Provides subsidies on farm machinery and equipment including tractors, combine harvesters, power tillers, seed drills and post-harvest machinery to reduce manual labour and cost of cultivation.",
    descriptionHindi: "ट्रैक्टर, कंबाइन हार्वेस्टर, पावर टिलर, सीड ड्रिल और कटाई के बाद की मशीनरी पर सब्सिडी। मैनुअल श्रम और खेती की लागत कम करता है।",
    benefit: "25–50% subsidy on farm machinery. SC/ST/women farmers get higher subsidy upto 50%",
    eligibility: "All farmers, custom hiring centres, FPOs, gram panchayats. Priority to small & marginal farmers",
    applyLink: "https://agrimachinery.nic.in",
    category: "machinery",
    icon: "⚙️",
  },
  {
    name: "Paramparagat Krishi Vikas Yojana (PKVY)",
    nameHindi: "परंपरागत कृषि विकास योजना",
    description: "Promotes organic farming through cluster-based approach. Farmers get financial assistance for 3 years to cover certification, organic input costs and marketing of organic produce.",
    descriptionHindi: "क्लस्टर आधारित दृष्टिकोण से जैविक खेती को बढ़ावा। किसानों को 3 वर्ष तक प्रमाणीकरण, जैविक इनपुट लागत और जैविक उपज की मार्केटिंग के लिए वित्तीय सहायता।",
    benefit: "₹50,000/hectare over 3 years. Covers organic inputs, certification and marketing. Premium prices for certified organic produce",
    eligibility: "Farmer clusters of minimum 20 hectares. All farmers willing to adopt organic farming",
    applyLink: "https://pgsindia-ncof.gov.in",
    category: "advisory",
    icon: "🌿",
  },
  {
    name: "Agriculture Infrastructure Fund (AIF)",
    nameHindi: "कृषि अवसंरचना कोष",
    description: "Medium-long term debt financing for investment in post-harvest management and community farming assets like cold chains, warehouses, primary processing units, assaying units and silos.",
    descriptionHindi: "कोल्ड चेन, गोदाम, प्राथमिक प्रसंस्करण इकाइयों और साइलो जैसी कटाई के बाद प्रबंधन और सामुदायिक खेती की परिसंपत्तियों के लिए मध्यम-दीर्घकालिक ऋण वित्तपोषण।",
    benefit: "3% interest subvention on loans up to ₹2 crore. Credit guarantee coverage via CGTMSE",
    eligibility: "Farmers, FPOs, cooperatives, SHGs, agri-entrepreneurs, startups and APMCs",
    applyLink: "https://agriinfra.dac.gov.in",
    category: "credit",
    icon: "🏗️",
  },
  {
    name: "National Horticulture Mission (NHM)",
    nameHindi: "राष्ट्रीय बागवानी मिशन",
    description: "Supports holistic development of horticulture covering fruits, vegetables, flowers, spices and plantation crops through area expansion, rejuvenation, post-harvest management and marketing support.",
    descriptionHindi: "फल, सब्जी, फूल, मसाले और बागान फसलों के समग्र विकास के लिए क्षेत्र विस्तार, नवीनीकरण, कटाई के बाद प्रबंधन और विपणन सहायता।",
    benefit: "40–50% subsidy on planting material, drip irrigation, greenhouses, cold storage and pack houses",
    eligibility: "All horticulture farmers. Cooperatives, FPOs and SHGs eligible for group projects",
    applyLink: "https://nhm.nic.in",
    category: "infrastructure",
    icon: "🍅",
  },
  {
    name: "PM Annadata Aay SanraksHan Abhiyan (PM-AASHA)",
    nameHindi: "पीएम अन्नदाता आय संरक्षण अभियान",
    description: "Umbrella scheme to ensure remunerative prices to farmers for their produce by covering Price Support Scheme (PSS), Price Deficiency Payment Scheme (PDPS) and Private Procurement & Stockist Scheme (PPSS).",
    descriptionHindi: "किसानों को उनकी उपज के लिए लाभकारी मूल्य सुनिश्चित करने वाली छत्र योजना। मूल्य समर्थन, मूल्य न्यूनता भुगतान और निजी खरीद स्कीम शामिल।",
    benefit: "MSP guaranteed for notified crops. Up to 25% of notified production purchased at MSP per state",
    eligibility: "All farmers growing notified crops (oilseeds, pulses, copra) in notified states",
    applyLink: "https://agricoop.gov.in",
    category: "income",
    icon: "🌾",
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
  if (schemeCount !== governmentSchemes.length) {
    await GovernmentScheme.deleteMany({});
    await GovernmentScheme.insertMany(governmentSchemes);
    logger.info(`Seeded ${governmentSchemes.length} government schemes`);
  }
}

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, Languages } from "lucide-react";
import { useAiChat } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  suggestions?: string[];
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I am your KisanConnect AI Assistant. How can I help you with your farming today?\n\nनमस्ते! मैं आपका किसान कनेक्ट एआई सहायक हूँ। आज मैं आपकी खेती में कैसे मदद कर सकता हूँ?",
      suggestions: ["What crop should I plant in summer?", "How to cure tomato blight?", "Tell me about PM-Kisan scheme"]
    }
  ]);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending } = useAiChat({
    mutation: {
      onSuccess: (data) => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "ai",
          content: data.reply,
          suggestions: data.suggestions
        }]);
      },
      onError: () => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: "ai",
          content: "Sorry, I am having trouble connecting right now. Please try again later.\n\nक्षमा करें, मुझे अभी जुड़ने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें।"
        }]);
      }
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPending]);

  const handleSend = (text: string) => {
    if (!text.trim() || isPending) return;

    // Add user message optimistically
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: "user",
      content: text
    }]);
    
    setInput("");

    // Trigger API
    sendMessage({
      data: { message: text, language }
    });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-80px)] bg-muted/20">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3 sm:px-6 lg:px-8 shrink-0 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-green-50 shrink-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/ai-bot.png`} 
              alt="AI Assistant" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
              Krishi AI <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-xs font-medium text-primary">कृषि एआई सहायक</p>
          </div>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setLanguage(l => l === "en" ? "hi" : "en")}
          className="rounded-full border-primary/20 text-primary hover:bg-primary/10 font-semibold"
        >
          <Languages className="w-4 h-4 mr-2" />
          {language === "en" ? "Switch to Hindi" : "Switch to English"}
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                  msg.role === "user" ? "bg-foreground border-foreground text-white" : "bg-white border-primary/20 text-primary"
                }`}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] ${msg.role === "user" ? "items-end flex flex-col" : "items-start flex flex-col"}`}>
                  <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user" 
                      ? "bg-foreground text-white rounded-tr-none" 
                      : "bg-white border border-border/60 text-foreground rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-full border border-primary/20 text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isPending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="bg-white border border-border/60 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-border p-4 sm:p-6 shrink-0 z-10">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder={language === "en" ? "Ask a farming question..." : "खेती से जुड़ा सवाल पूछें..."}
            className="w-full h-14 pl-6 pr-16 bg-muted/30 border-border rounded-full text-base shadow-inner focus-visible:ring-primary/20 focus-visible:border-primary"
            disabled={isPending}
          />
          <Button 
            size="icon"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isPending}
            className="absolute right-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/30"
          >
            <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

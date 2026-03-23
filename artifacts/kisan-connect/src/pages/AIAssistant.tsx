import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  suggestions?: string[];
  streaming?: boolean;
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hello! I am KisanMitra, your AI crop advisor powered by GPT. Ask me anything about farming — crops, pests, soil, schemes, or mandi prices!\n\nनमस्ते! मैं किसानमित्र हूँ, आपका एआई कृषि सलाहकार। खेती के बारे में कोई भी सवाल पूछें!",
      suggestions: [
        "How do I increase wheat yield?",
        "My tomatoes have yellow leaves — why?",
        "Tell me about PM-KISAN scheme",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsgId = Date.now().toString();
      const aiMsgId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text },
        { id: aiMsgId, role: "ai", content: "", streaming: true },
      ]);
      setInput("");
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(`${BASE}/api/ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, language }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) throw new Error("Stream failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw) continue;

            try {
              const event = JSON.parse(raw);

              if (event.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId
                      ? { ...m, content: m.content + event.content }
                      : m
                  )
                );
              }

              if (event.done) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId
                      ? { ...m, streaming: false, suggestions: event.suggestions }
                      : m
                  )
                );
              }

              if (event.error) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId
                      ? {
                          ...m,
                          content:
                            "Sorry, something went wrong. Please try again.\nक्षमा करें, कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
                          streaming: false,
                        }
                      : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? {
                    ...m,
                    content:
                      "Connection error. Please check your internet and try again.\nकनेक्शन त्रुटि। कृपया पुनः प्रयास करें।",
                    streaming: false,
                  }
                : m
            )
          );
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, language]
  );

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
              KisanMitra AI <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-xs font-medium text-primary">
              किसानमित्र एआई सहायक · Powered by GPT
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
          className="rounded-full border-primary/20 text-primary hover:bg-primary/10 font-semibold"
        >
          <Languages className="w-4 h-4 mr-2" />
          {language === "en" ? "हिंदी में पूछें" : "Ask in English"}
        </Button>
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6"
        ref={scrollRef}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm ${
                    msg.role === "user"
                      ? "bg-foreground border-foreground text-white"
                      : "bg-white border-primary/20 text-primary"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-6 h-6" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] ${msg.role === "user" ? "items-end flex flex-col" : "items-start flex flex-col"}`}
                >
                  <div
                    className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-foreground text-white rounded-tr-none"
                        : "bg-white border border-border/60 text-foreground rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                    {msg.streaming && (
                      <span className="inline-block ml-1 animate-pulse text-primary font-bold">
                        ▌
                      </span>
                    )}
                    {msg.streaming && msg.content === "" && (
                      <span className="flex items-center gap-1 text-muted-foreground text-sm">
                        <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                      </span>
                    )}
                  </div>

                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          disabled={isStreaming}
                          className="text-xs font-semibold px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50 transition-colors rounded-full border border-primary/20 text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
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
            placeholder={
              language === "en"
                ? "Ask about crops, pests, soil, schemes..."
                : "फसल, कीट, मिट्टी, योजनाओं के बारे में पूछें..."
            }
            className="w-full h-14 pl-6 pr-16 bg-muted/30 border-border rounded-full text-base shadow-inner focus-visible:ring-primary/20 focus-visible:border-primary"
            disabled={isStreaming}
          />
          <Button
            size="icon"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/30"
          >
            <Send className="w-5 h-5 -ml-0.5 mt-0.5" />
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Powered by Replit AI · किसान खेती सलाह के लिए
        </p>
      </div>
    </div>
  );
}

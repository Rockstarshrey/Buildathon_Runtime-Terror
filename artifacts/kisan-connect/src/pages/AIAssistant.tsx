import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Bot, User, Sparkles, Languages, Mic, RotateCcw,
  Copy, Check, Leaf, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  suggestions?: string[];
  streaming?: boolean;
  timestamp: Date;
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// Prompt suggestion groups shown before first message
const STARTERS = [
  { icon: "🌾", text: "How do I increase wheat yield?", hi: "गेहूं की पैदावार कैसे बढ़ाएं?" },
  { icon: "🍅", text: "My tomatoes have yellow leaves — why?", hi: "टमाटर के पत्ते पीले क्यों हो रहे हैं?" },
  { icon: "💰", text: "Tell me about PM-KISAN scheme", hi: "पीएम-किसान योजना के बारे में बताएं" },
  { icon: "🌧️", text: "Best crops to grow in monsoon season", hi: "मानसून में कौन सी फसल लगाएं?" },
  { icon: "🐛", text: "How to control pink bollworm in cotton?", hi: "कपास में गुलाबी सुंडी कैसे रोकें?" },
  { icon: "🌱", text: "Organic farming tips for small farmers", hi: "छोटे किसानों के लिए जैविक खेती" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors opacity-0 group-hover:opacity-100">
      {copied ? <Check className="w-3.5 h-3.5 text-lime-600" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="w-2 h-2 rounded-full bg-lime-500"
          animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }} />
      ))}
    </span>
  );
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      timestamp: new Date(),
      content:
        "Hello! I am **KisanMitra**, your AI crop advisor powered by GPT.\n\nAsk me anything about farming — crops, pests, soil, weather, government schemes, or mandi prices. I can answer in English or Hindi!\n\nनमस्ते! मैं किसानमित्र हूँ। खेती के बारे में कोई भी सवाल पूछें।",
      suggestions: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hasUserMessages = messages.some((m) => m.role === "user");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [input]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsgId = Date.now().toString();
      const aiMsgId = (Date.now() + 1).toString();

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: text, timestamp: new Date() },
        { id: aiMsgId, role: "ai", content: "", streaming: true, timestamp: new Date() },
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
                  prev.map((m) => m.id === aiMsgId ? { ...m, content: m.content + event.content } : m)
                );
              }
              if (event.done) {
                setMessages((prev) =>
                  prev.map((m) => m.id === aiMsgId ? { ...m, streaming: false, suggestions: event.suggestions } : m)
                );
              }
              if (event.error) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId
                      ? { ...m, content: "Sorry, something went wrong. Please try again.\nक्षमा करें, कुछ गलत हुआ। कृपया पुनः प्रयास करें।", streaming: false }
                      : m
                  )
                );
              }
            } catch { /* ignore */ }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsgId
                ? { ...m, content: "Connection error. Please check your internet and try again.\nकनेक्शन त्रुटि। कृपया पुनः प्रयास करें।", streaming: false }
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)]"
      style={{ background: "linear-gradient(135deg, #f7ffe8 0%, #ecfdf5 50%, #f0fdf4 100%)" }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="shrink-0 bg-gradient-to-r from-green-800 via-lime-700 to-green-700 shadow-lg z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Bot avatar with glow ring */}
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-lime-300/60 shadow-lg shadow-lime-900/30">
                <img
                  src={`${import.meta.env.BASE_URL}images/ai-bot.png`}
                  alt="KisanMitra AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-lime-400 border-2 border-white shadow-sm" />
            </div>
            <div>
              <h1 className="font-bold text-white flex items-center gap-2 leading-tight">
                KisanMitra AI
                <Sparkles className="w-4 h-4 text-lime-300" />
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-lime-200 font-medium">
                <Zap className="w-3 h-3 text-lime-300" />
                <span>GPT-powered · Always available</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMessages([{
                  id: "welcome",
                  role: "ai",
                  timestamp: new Date(),
                  content: "Hello! I am **KisanMitra**, your AI crop advisor. Ask me anything about farming!\n\nनमस्ते! मैं किसानमित्र हूँ। खेती के बारे में कोई भी सवाल पूछें।",
                  suggestions: [],
                }]);
              }}
              className="text-lime-200 hover:text-white hover:bg-white/15 rounded-xl h-9 px-3 gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage((l) => (l === "en" ? "hi" : "en"))}
              className="text-lime-200 hover:text-white hover:bg-white/15 rounded-xl h-9 px-3 gap-1.5 text-xs font-semibold border border-lime-300/30"
            >
              <Languages className="w-3.5 h-3.5" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Chat area ──────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-1"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgba(132,204,22,0.12) 1.5px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      >
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Messages first (welcome message is part of this) */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {msg.role === "ai" ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-lime-200 shadow-md shrink-0 mt-1">
                    <img
                      src={`${import.meta.env.BASE_URL}images/ai-bot.png`}
                      alt="KisanMitra"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center shrink-0 mt-1 shadow-md border-2 border-white">
                    <User className="w-4.5 h-4.5 text-white" />
                  </div>
                )}

                <div className={`max-w-[82%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {/* Bubble */}
                  <div className={`relative group rounded-2xl px-4 py-3 shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-lime-500 to-green-600 text-white rounded-tr-sm shadow-lime-200/50"
                      : "bg-white border border-lime-100 text-foreground rounded-tl-sm shadow-black/5"
                  }`}>
                    {msg.content}

                    {/* Typing indicator */}
                    {msg.streaming && msg.content === "" && <TypingDots />}

                    {/* Streaming cursor */}
                    {msg.streaming && msg.content !== "" && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="inline-block ml-0.5 w-0.5 h-4 bg-lime-500 rounded-full align-middle"
                      />
                    )}

                    {/* Copy button for AI messages */}
                    {msg.role === "ai" && !msg.streaming && msg.content && (
                      <div className="absolute -bottom-2 right-2">
                        <CopyButton text={msg.content} />
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-muted-foreground px-1">
                    {format(msg.timestamp, "h:mm a")}
                  </span>

                  {/* Follow-up suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && !msg.streaming && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-2 mt-1"
                    >
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          disabled={isStreaming}
                          className="text-xs font-semibold px-3.5 py-2 bg-white/90 text-lime-700 border border-lime-300 hover:bg-lime-500 hover:text-white hover:border-lime-500 disabled:opacity-40 transition-all duration-150 rounded-full shadow-sm"
                        >
                          {sug}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Starter suggestion cards — shown BELOW the welcome message, before any user message */}
          <AnimatePresence>
            {!hasUserMessages && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, delay: 0.15 }}
              >
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Leaf className="w-3 h-3 text-lime-600" />
                  Try asking…
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STARTERS.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.18 + i * 0.06 }}
                      onClick={() => handleSend(s.text)}
                      disabled={isStreaming}
                      className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur rounded-xl border border-lime-200/60 hover:border-lime-400/70 hover:bg-white hover:shadow-sm hover:shadow-lime-100 text-left transition-all duration-150 group"
                    >
                      <span className="text-base leading-none shrink-0">{s.icon}</span>
                      <p className="text-xs font-medium text-foreground group-hover:text-lime-800 leading-snug line-clamp-2">{s.text}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Input area ──────────────────────────────────────── */}
      <div className="shrink-0 bg-white/90 backdrop-blur-md border-t border-lime-100 px-4 sm:px-6 py-4 shadow-[0_-4px_20px_rgba(132,204,22,0.08)]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-white rounded-2xl border border-lime-200 shadow-md shadow-lime-100/50 px-4 py-3 focus-within:border-lime-400 focus-within:shadow-lg focus-within:shadow-lime-100 transition-all duration-200">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                language === "en"
                  ? "Ask about crops, soil, pests, or government schemes… (Shift+Enter for new line)"
                  : "फसल, मिट्टी, कीट, या योजनाओं के बारे में पूछें…"
              }
              rows={1}
              disabled={isStreaming}
              className="flex-1 border-0 shadow-none focus-visible:ring-0 resize-none text-[15px] leading-relaxed bg-transparent p-0 min-h-[28px] max-h-[140px] placeholder:text-muted-foreground/60"
            />
            <div className="flex items-center gap-2 shrink-0 pb-0.5">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  size="icon"
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isStreaming}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 disabled:from-muted disabled:to-muted text-white shadow-md shadow-lime-200 border-0 transition-all duration-150"
                >
                  {isStreaming
                    ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><RotateCcw className="w-4 h-4" /></motion.div>
                    : <Send className="w-4 h-4 -ml-0.5" />
                  }
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2.5 px-1">
            <p className="text-[11px] text-muted-foreground">
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">Enter</kbd> to send ·{" "}
              <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">Shift+Enter</kbd> for new line
            </p>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-lime-500" />
              Powered by GPT · किसान खेती सलाह
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

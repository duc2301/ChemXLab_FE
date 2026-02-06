import { FlaskConical, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import type { MessageHistory } from "../../../entities/Chatbot";
import ChatMessage from "./ChatMessage";

interface ChatAreaProps {
    messages: MessageHistory[];
    isLoading: boolean;
    sessionTopic?: string;
}

const suggestions = [
    { emoji: "⚗️", text: "Cân bằng phương trình: Fe + O₂ → Fe₂O₃" },
    { emoji: "🔬", text: "Phân tích cấu trúc phân tử H₂SO₄" },
    { emoji: "📚", text: "Giải thích phản ứng oxi-hóa khử" },
    { emoji: "🧪", text: "Tính khối lượng mol của NaCl" },
];

const ChatArea = ({ messages, isLoading }: ChatAreaProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Empty state - Gemini style
    if (messages.length === 0 && !isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center px-6">
                <div className="max-w-2xl w-full text-center">
                    {/* Logo */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 mb-6 shadow-xl shadow-blue-500/30">
                        <FlaskConical className="w-8 h-8 text-white" />
                    </div>

                    {/* Greeting */}
                    <div className="mb-2">
                        <span className="text-blue-400">✦</span>
                        <span className="text-slate-400 ml-2">Xin chào!</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Tôi có thể giúp gì cho bạn?
                    </h1>

                    {/* Suggestions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                        {suggestions.map((item, idx) => (
                            <button
                                key={idx}
                                className="flex items-start gap-3 p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all text-left group"
                            >
                                <span className="text-xl">{item.emoji}</span>
                                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                                    {item.text}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="max-w-3xl mx-auto py-6 px-4 md:px-6">
                {/* Messages */}
                {messages.map((message, idx) => (
                    <ChatMessage key={idx} message={message} />
                ))}

                {/* Loading */}
                {isLoading && (
                    <div className="flex gap-4 py-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                            <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 pt-1">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-500 flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4" />
                                    Đang phân tích...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={scrollRef} />
            </div>
        </div>
    );
};

export default ChatArea;

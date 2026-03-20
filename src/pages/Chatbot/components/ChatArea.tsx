import { FileText, FlaskConical, Plus, Scale, Share2, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import type { MessageHistory } from "../../../entities/Chatbot";
import ChatMessage from "./ChatMessage";

interface ChatAreaProps {
    messages: MessageHistory[];
    isLoading: boolean;
    sessionTopic?: string;
    onSuggestionClick?: (text: string) => void;
}

const suggestions = [
    { icon: <Plus className="w-4 h-4 text-[#438BC4]" strokeWidth={2.5} />, text: "Cân bằng phản ứng" },
    { icon: <Share2 className="w-3.5 h-3.5 text-[#438BC4]" strokeWidth={2.5} />, text: "Cơ chế phản ứng" },
    { icon: <FileText className="w-3.5 h-3.5 text-[#438BC4]" strokeWidth={2.5} />, text: "Tính khối lượng mol" },
    { icon: <Share2 className="w-3.5 h-3.5 text-[#438BC4]" strokeWidth={2.5} />, text: "Cấu trúc Lewis" },
    { icon: <Scale className="w-3.5 h-3.5 text-[#438BC4]" strokeWidth={2.5} />, text: "Cân bằng hoá học" },
];

const ChatArea = ({ messages, isLoading, onSuggestionClick }: ChatAreaProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Empty state 
    if (messages.length === 0 && !isLoading) {
        return (
            <div className="h-full flex flex-col items-center justify-center px-6 relative z-10 w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center w-full mt-[-5vh]">

                    {/* Greeting */}
                    <h1 className="font-space font-bold text-[40px] md:text-[56px] leading-[1.2] text-[#12284B] tracking-tight mb-5">
                        Xin chào! Tôi có thể<br />
                        giúp gì cho bạn <span className="text-[#438BC4]">hôm nay?</span>
                    </h1>

                    <p className="font-inter font-medium text-[15px] leading-[22px] text-slate-500 mb-10 max-w-[670px]">
                        Hỏi về phản ứng hoá học, cấu trúc phân tử, cơ chế phản ứng, hay bất kỳ chủ đề nào trong hoá học.
                    </p>

                    {/* Suggestion Pills */}
                    <div className="flex flex-wrap justify-center gap-3 w-full max-w-[800px]">
                        {suggestions.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSuggestionClick?.(item.text)}
                                className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] rounded-full hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                {item.icon}
                                <span className="font-inter font-semibold text-[13.5px] text-slate-600">{item.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto hide-scrollbar relative z-10 w-full flex justify-center">
            <div className="w-[85%] max-w-[900px] py-8 px-4 md:px-8">
                {/* Messages */}
                {messages.map((message, idx) => (
                    <ChatMessage key={idx} message={message} />
                ))}

                {/* Loading */}
                {isLoading && (
                    <div className="flex gap-4 py-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#438BC4] to-[#2A6BA6] flex items-center justify-center flex-shrink-0 shadow-[0_4px_15px_rgba(67,139,196,0.3)] border border-white/20">
                            <FlaskConical className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 pt-1.5 flex items-center gap-3">
                            <div className="flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="w-2 h-2 bg-[#438BC4] rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-[#12284B]/60 flex items-center gap-1.5 ml-2">
                                <Sparkles className="w-4 h-4 text-[#438BC4]" />
                                Đang phân tích...
                            </span>
                        </div>
                    </div>
                )}

                <div ref={scrollRef} className="h-4" />
            </div>
        </div>
    );
};

export default ChatArea;

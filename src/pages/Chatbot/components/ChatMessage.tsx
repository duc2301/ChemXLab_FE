import "katex/dist/katex.min.css";
import { FlaskConical, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { MessageHistory } from "../../../entities/Chatbot";
import AnalysisPanel from "./AnalysisPanel";
import ToolsUsedBadge from "./ToolsUsedBadge";

interface ChatMessageProps {
    message: MessageHistory;
    analysisData?: Record<string, unknown> | null;
}

const ChatMessage = ({ message, analysisData }: ChatMessageProps) => {
    const isUser = message.role === "user";

    return (
        <div className={`flex gap-4 py-5 ${isUser ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser
                    ? "bg-gradient-to-br from-[#12284B]/20 to-[#12284B]/40"
                    : "bg-gradient-to-br from-[#438BC4] to-[#2A6BA6] shadow-[0_4px_15px_rgba(67,139,196,0.3)] border border-white/20"
                    } shadow-md`}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white" />
                ) : (
                    <FlaskConical className="w-4 h-4 text-white" />
                )}
            </div>

            {/* Content */}
            <div className={`flex-1 min-w-0 ${isUser ? "flex flex-col items-end" : ""}`}>
                {/* Sender label */}
                <div className={`mb-1.5 ${isUser ? "text-right" : ""}`}>
                    <span className="text-xs font-semibold text-[#12284B]/50 tracking-wide uppercase">
                        {isUser ? "Bạn" : "ChemX AI"}
                    </span>
                </div>

                {/* Message */}
                {isUser ? (
                    <div className="inline-block max-w-[85%] bg-gradient-to-br from-[#F0F7FF] to-[#E0EFFF] border border-[#B8DCFF] shadow-sm rounded-2xl rounded-tr-sm px-5 py-3.5">
                        <p className="text-[15px] leading-[22px] font-inter font-medium text-[#12284B] whitespace-pre-wrap">{message.content}</p>
                    </div>
                ) : (
                    <div className="max-w-full prose prose-sm prose-[#12284B]">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-xl font-bold text-[#003D7A] mt-4 mb-2 first:mt-0 font-space tracking-tight">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-lg font-bold text-[#004A94] mt-4 mb-2 first:mt-0 font-space tracking-tight">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-base font-semibold text-[#005BB5] mt-3 mb-1.5 first:mt-0 font-inter">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-[15px] text-[#12284B] mb-3 last:mb-0 leading-[24px] font-inter font-medium">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="text-[15px] font-inter font-medium text-[#12284B] list-disc pl-5 mb-3 space-y-1.5 marker:text-[#438BC4]">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="text-[15px] font-inter font-medium text-[#12284B] list-decimal pl-5 mb-3 space-y-1.5 marker:text-[#438BC4]">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => <li>{children}</li>,
                                strong: ({ children }) => (
                                    <strong className="text-[#003D7A] font-bold">{children}</strong>
                                ),
                                em: ({ children }) => (
                                    <em className="text-[#475569] italic">{children}</em>
                                ),
                                code: ({ className, children }) => {
                                    const isInline = !className;
                                    if (isInline) {
                                        return (
                                            <code className="bg-[#E6F4FF] text-[#438BC4] border border-[#B8DCFF] px-1.5 py-0.5 rounded text-[13px] font-mono font-semibold">
                                                {children}
                                            </code>
                                        );
                                    }
                                    return (
                                        <code className="block bg-white/80 border border-[#E0EFFF] shadow-sm text-[#004A94] p-4 rounded-xl text-sm font-mono overflow-x-auto my-3 font-medium">
                                            {children}
                                        </code>
                                    );
                                },
                                pre: ({ children }) => (
                                    <pre className="bg-transparent border-0 rounded-none overflow-x-auto my-0 p-0 shadow-none">
                                        {children}
                                    </pre>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-[#438BC4] bg-[#F0F7FF] pl-4 py-2 my-3 text-[#12284B]/80 rounded-r-lg italic">
                                        {children}
                                    </blockquote>
                                ),
                                table: ({ children }) => (
                                    <div className="overflow-x-auto my-4 shadow-sm border border-[#B8DCFF] rounded-xl flex">
                                        <table className="min-w-full text-sm font-inter text-left border-collapse">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className="bg-[#E6F4FF]/50 border-b border-[#B8DCFF]">{children}</thead>
                                ),
                                th: ({ children }) => (
                                    <th className="px-4 py-3 font-bold text-[#003D7A] whitespace-nowrap">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="px-4 py-3 text-[#12284B] font-medium border-b border-[#E0EFFF] last:border-0 relative bg-white/50">
                                        {children}
                                    </td>
                                ),
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0072E5] hover:text-[#005BB5] underline underline-offset-2 font-semibold"
                                    >
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>

                        {/* Tools */}
                        {message.toolsUsed && message.toolsUsed.length > 0 && (
                            <ToolsUsedBadge tools={message.toolsUsed} />
                        )}

                        {/* Analysis */}
                        {analysisData && <AnalysisPanel data={analysisData} />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;

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
                    ? "bg-gradient-to-br from-purple-500 to-pink-500"
                    : "bg-gradient-to-br from-blue-500 to-cyan-400"
                    } shadow-lg ${isUser ? "shadow-purple-500/20" : "shadow-blue-500/20"}`}
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
                    <span className="text-xs font-medium text-slate-500">
                        {isUser ? "Bạn" : "ChemXLab AI"}
                    </span>
                </div>

                {/* Message */}
                {isUser ? (
                    <div className="inline-block max-w-[85%] bg-blue-600/20 border border-blue-500/30 rounded-2xl rounded-tr-md px-4 py-3">
                        <p className="text-sm text-white whitespace-pre-wrap">{message.content}</p>
                    </div>
                ) : (
                    <div className="max-w-full prose prose-invert prose-sm">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-xl font-bold text-blue-400 mt-4 mb-2 first:mt-0">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-lg font-bold text-blue-400 mt-4 mb-2 first:mt-0">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-base font-semibold text-blue-300 mt-3 mb-1.5 first:mt-0">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-sm text-slate-200 mb-3 last:mb-0 leading-relaxed">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="text-sm text-slate-200 list-disc pl-5 mb-3 space-y-1.5">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="text-sm text-slate-200 list-decimal pl-5 mb-3 space-y-1.5">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => <li className="text-slate-200">{children}</li>,
                                strong: ({ children }) => (
                                    <strong className="text-cyan-300 font-semibold">{children}</strong>
                                ),
                                em: ({ children }) => (
                                    <em className="text-blue-300 italic">{children}</em>
                                ),
                                code: ({ className, children }) => {
                                    const isInline = !className;
                                    if (isInline) {
                                        return (
                                            <code className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">
                                                {children}
                                            </code>
                                        );
                                    }
                                    return (
                                        <code className="block bg-slate-900 border border-slate-700 text-cyan-300 p-4 rounded-xl text-xs font-mono overflow-x-auto my-3">
                                            {children}
                                        </code>
                                    );
                                },
                                pre: ({ children }) => (
                                    <pre className="bg-slate-900 border border-slate-700 rounded-xl overflow-x-auto my-3">
                                        {children}
                                    </pre>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-4 border-blue-500 bg-slate-800/50 pl-4 py-2 my-3 text-slate-300 rounded-r-lg">
                                        {children}
                                    </blockquote>
                                ),
                                table: ({ children }) => (
                                    <div className="overflow-x-auto my-4">
                                        <table className="min-w-full text-sm border border-slate-700 rounded-xl overflow-hidden">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className="bg-slate-800">{children}</thead>
                                ),
                                th: ({ children }) => (
                                    <th className="px-4 py-2.5 text-left font-semibold text-blue-300 border-b border-slate-700">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="px-4 py-2.5 text-slate-200 border-b border-slate-800">
                                        {children}
                                    </td>
                                ),
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
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

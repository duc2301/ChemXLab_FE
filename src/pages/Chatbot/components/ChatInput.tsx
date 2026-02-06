import { Loader2, Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput("");
            // Reset textarea height
            const textarea = document.getElementById("chat-input") as HTMLTextAreaElement;
            if (textarea) textarea.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = "auto";
        target.style.height = Math.min(target.scrollHeight, 200) + "px";
    };

    return (
        <div className="border-t border-slate-800 bg-[#0F172A] p-4">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="relative flex items-end gap-2 bg-slate-800/60 border border-slate-700 rounded-2xl p-2 focus-within:border-blue-500/50 focus-within:bg-slate-800/80 transition-all">
                        <textarea
                            id="chat-input"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onInput={handleInput}
                            placeholder="Hỏi ChemXLab AI..."
                            disabled={isLoading}
                            rows={1}
                            className="flex-1 bg-transparent px-3 py-2 text-white placeholder-slate-500 focus:outline-none resize-none text-sm min-h-[40px] max-h-[200px] disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>

                <p className="text-xs text-slate-600 text-center mt-2">
                    Enter để gửi · Shift + Enter để xuống dòng
                </p>
            </div>
        </div>
    );
};

export default ChatInput;

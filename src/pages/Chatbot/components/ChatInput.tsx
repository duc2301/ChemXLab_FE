import { Send } from "lucide-react";

interface ChatInputProps {
    value: string;
    onChange: (val: string) => void;
    onSend: (message: string) => void;
    isLoading: boolean;
}

const ChatInput = ({ value, onChange, onSend, isLoading }: ChatInputProps) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim() && !isLoading) {
            onSend(value.trim());
            onChange("");
            const textarea = document.getElementById("chat-input") as HTMLTextAreaElement;
            if (textarea) textarea.style.height = "24px"; // reset to base height
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
        target.style.height = "24px";
        const newHeight = Math.min(target.scrollHeight, 200);
        target.style.height = newHeight + "px";
        target.style.overflowY = target.scrollHeight > 200 ? "auto" : "hidden";
    };

    return (
        <div className="w-[85%] max-w-[900px] flex justify-center pb-8 z-20 mx-auto">
            <div className="w-full bg-white border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[24px] p-4 flex flex-col gap-4 relative">
                <form onSubmit={handleSubmit} className="w-full flex flex-col relative">
                    {/* Text Area & Built-in Action Row */}
                    <div className="flex w-full items-start justify-between relative gap-4 px-2">
                        <textarea
                            id="chat-input"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onInput={handleInput}
                            placeholder="Hỏi về bất kỳ chủ đề hoá học nào..."
                            disabled={isLoading}
                            rows={1}
                            className="w-full flex-1 bg-transparent border-none focus:outline-none resize-none overflow-hidden font-inter font-medium text-[15px] leading-[24px] text-[#12284B] placeholder:text-slate-400 disabled:opacity-50 min-h-[24px] max-h-[200px] pt-2"
                        />

                        {/* Send Button placed top right aligned */}
                        <button
                            type="submit"
                            disabled={!value.trim() || isLoading}
                            className="w-[42px] h-[42px] shrink-0 flex items-center justify-center bg-[#438BC4] rounded-[14px] text-white transition-all disabled:opacity-40 disabled:grayscale hover:bg-[#3271a3] active:scale-95"
                        >
                            <Send className="w-[18px] h-[18px] ml-0.5" strokeWidth={2.5} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInput;

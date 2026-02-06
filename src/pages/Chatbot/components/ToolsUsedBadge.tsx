import { Calculator, FlaskConical, Search, Sparkles } from "lucide-react";
import type { ChatToolType } from "../../../entities/Chatbot";

interface ToolsUsedBadgeProps {
    tools: string[];
}

const toolConfig: Record<
    ChatToolType,
    { label: string; icon: React.ReactNode; color: string }
> = {
    EquationBalancer: {
        label: "Cân bằng PT",
        icon: <Calculator className="w-3 h-3" />,
        color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    MolecularAnalyzer: {
        label: "Phân tích PT",
        icon: <FlaskConical className="w-3 h-3" />,
        color: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    },
    ReactionChecker: {
        label: "Kiểm tra PƯ",
        icon: <Search className="w-3 h-3" />,
        color: "bg-green-500/15 text-green-400 border-green-500/30",
    },
    GeneralAI: {
        label: "AI",
        icon: <Sparkles className="w-3 h-3" />,
        color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
};

const ToolsUsedBadge = ({ tools }: ToolsUsedBadgeProps) => {
    if (!tools || tools.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-500">Công cụ sử dụng:</span>
            {tools.map((tool) => {
                const config = toolConfig[tool as ChatToolType] || {
                    label: tool,
                    icon: <Sparkles className="w-3 h-3" />,
                    color: "bg-slate-500/15 text-slate-400 border-slate-500/30",
                };

                return (
                    <span
                        key={tool}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.color}`}
                    >
                        {config.icon}
                        {config.label}
                    </span>
                );
            })}
        </div>
    );
};

export default ToolsUsedBadge;

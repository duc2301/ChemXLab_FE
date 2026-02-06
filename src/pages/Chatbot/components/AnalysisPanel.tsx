import { ChevronDown, ChevronRight, FlaskConical } from "lucide-react";
import { useState } from "react";

interface AnalysisPanelProps {
    data: Record<string, unknown> | null;
}

const AnalysisPanel = ({ data }: AnalysisPanelProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!data || Object.keys(data).length === 0) return null;

    const renderValue = (value: unknown, depth = 0): React.ReactNode => {
        if (value === null || value === undefined) {
            return <span className="text-slate-500">null</span>;
        }
        if (typeof value === "boolean") {
            return (
                <span className={value ? "text-green-400" : "text-red-400"}>
                    {value ? "✓ Có" : "✗ Không"}
                </span>
            );
        }
        if (typeof value === "number") {
            return <span className="text-amber-400">{value}</span>;
        }
        if (typeof value === "string") {
            return <span className="text-cyan-400">{value}</span>;
        }
        if (Array.isArray(value)) {
            return (
                <div className="ml-4 space-y-0.5">
                    {value.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <span className="text-slate-600">•</span>
                            {renderValue(item, depth + 1)}
                        </div>
                    ))}
                </div>
            );
        }
        if (typeof value === "object") {
            return (
                <div className="ml-4 space-y-0.5">
                    {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                        <div key={k} className="flex items-start gap-2">
                            <span className="text-slate-400 font-medium">{k}:</span>
                            {renderValue(v, depth + 1)}
                        </div>
                    ))}
                </div>
            );
        }
        return <span>{String(value)}</span>;
    };

    return (
        <div className="mt-4 bg-slate-900/60 rounded-xl border border-slate-700/50 overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 transition-colors"
            >
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                ) : (
                    <ChevronRight className="w-4 h-4" />
                )}
                <FlaskConical className="w-4 h-4" />
                <span>Dữ liệu phân tích chi tiết</span>
            </button>

            {isExpanded && (
                <div className="px-4 py-3 border-t border-slate-700/50 text-xs font-mono space-y-1.5">
                    {Object.entries(data).map(([key, value]) => (
                        <div key={key}>
                            <span className="text-blue-400 font-semibold">{key}:</span>
                            {renderValue(value)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalysisPanel;

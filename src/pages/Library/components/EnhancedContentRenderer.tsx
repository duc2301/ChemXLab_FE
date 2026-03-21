import {
    AlertTriangle,
    ArrowRight,
    Atom,
    Beaker,
    BookOpen,
    CheckCircle,
    FlaskConical,
    Lightbulb,
    Sparkles,
    Zap
} from "lucide-react";
import React from "react";

interface EnhancedContentProps {
    content: string;
    keyPoints?: string[];
}

// Component to render chemical equations with visual styling
function ChemicalEquation({ equation }: { equation: string }) {
    // Parse and style the equation
    const parts = equation.split(/(\+|→|=|↔)/);

    return (
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-[#F0F7FF] via-[#E0F0FF] to-[#F0F7FF] border border-[#3398DB]/20 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <Beaker className="w-4 h-4 text-[#3398DB]" />
                <span className="text-[#04306E] text-xs font-semibold uppercase tracking-wider font-inter">Phương trình hóa học</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-lg font-mono">
                {parts.map((part, idx) => {
                    const trimmed = part.trim();
                    if (trimmed === '+') {
                        return <span key={idx} className="text-[#64748B] font-bold">+</span>;
                    }
                    if (trimmed === '→' || trimmed === '=' || trimmed === '↔') {
                        return (
                            <span key={idx} className="text-[#F59E0B] font-bold mx-2 flex items-center">
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        );
                    }
                    // Style the chemical formula
                    return (
                        <span key={idx} className="px-2 py-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg text-[#04306E] font-bold shadow-sm">
                            {styleChemicalFormula(trimmed)}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

// Helper to style chemical formulas with subscripts
function styleChemicalFormula(formula: string) {
    // Replace numbers with subscript styling
    const styled = formula.replace(/(\d+)/g, '<sub class="text-xs">$1</sub>');
    return <span dangerouslySetInnerHTML={{ __html: styled }} />;
}

// Tip/Note box component
function TipBox({ content, type = 'tip' }: { content: string; type?: 'tip' | 'warning' | 'note' | 'example' }) {
    const configs = {
        tip: {
            icon: Lightbulb,
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            iconColor: 'text-emerald-600',
            textColor: 'text-emerald-800',
            label: 'Mẹo hay'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            iconColor: 'text-orange-600',
            textColor: 'text-orange-800',
            label: 'Lưu ý'
        },
        note: {
            icon: BookOpen,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-600',
            textColor: 'text-blue-800',
            label: 'Ghi nhớ'
        },
        example: {
            icon: FlaskConical,
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            iconColor: 'text-purple-600',
            textColor: 'text-purple-800',
            label: 'Ví dụ'
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className={`my-4 p-4 rounded-xl ${config.bgColor} border ${config.borderColor} shadow-sm`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${config.bgColor} border ${config.borderColor} shadow-sm`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div>
                    <p className={`text-xs font-bold uppercase tracking-wider ${config.iconColor} mb-1 font-inter`}>
                        {config.label}
                    </p>
                    <p className={`${config.textColor} text-sm leading-relaxed font-medium`}>{content}</p>
                </div>
            </div>
        </div>
    );
}

// Definition card component
function DefinitionCard({ term, definition }: { term: string; definition: string }) {
    return (
        <div className="my-4 p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-400"></div>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 shadow-sm flex items-center justify-center flex-shrink-0">
                    <Atom className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                    <h4 className="text-[#04306E] font-bold text-lg mb-1.5 font-space">{term}</h4>
                    <p className="text-[#475569] text-sm leading-relaxed font-medium">{definition}</p>
                </div>
            </div>
        </div>
    );
}

// Process step component
function ProcessStep({ number, title, description }: { number: number; title: string; description?: string }) {
    return (
        <div className="flex gap-4 my-4 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3398DB] to-[#04306E] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#3398DB]/30 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm font-space">{number}</span>
            </div>
            <div className="flex-1 mt-1">
                <h5 className="text-[#04306E] font-bold font-inter text-base">{title}</h5>
                {description && <p className="text-[#64748B] text-sm mt-1.5 leading-relaxed">{description}</p>}
            </div>
        </div>
    );
}

export default function EnhancedContentRenderer({ content, keyPoints }: EnhancedContentProps) {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        // Skip empty lines
        if (!trimmedLine) {
            elements.push(<div key={index} className="h-2" />);
            return;
        }

        // Check for chemical equations (contains → or = with chemical formulas)
        if (trimmedLine.includes('→') && /[A-Z][a-z]?\d*/.test(trimmedLine)) {
            elements.push(<ChemicalEquation key={index} equation={trimmedLine} />);
            return;
        }

        // Check for definitions (format: **Term**: definition)
        const definitionMatch = trimmedLine.match(/^\*\*([^*]+)\*\*:\s*(.+)$/);
        if (definitionMatch) {
            elements.push(
                <DefinitionCard key={index} term={definitionMatch[1]} definition={definitionMatch[2]} />
            );
            return;
        }

        // Headers (bold text on its own line)
        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
            const headerText = trimmedLine.replace(/\*\*/g, '');
            elements.push(
                <h3 key={index} className="text-xl font-bold font-space text-[#04306E] mt-8 mb-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#3398DB]" />
                    {headerText}
                </h3>
            );
            return;
        }

        // Tip boxes (lines starting with 💡 or [TIP])
        if (trimmedLine.startsWith('💡') || trimmedLine.toLowerCase().startsWith('[tip]')) {
            const tipContent = trimmedLine.replace(/^💡\s*/, '').replace(/^\[tip\]\s*/i, '');
            elements.push(<TipBox key={index} content={tipContent} type="tip" />);
            return;
        }

        // Warning boxes
        if (trimmedLine.startsWith('⚠️') || trimmedLine.toLowerCase().startsWith('[warning]')) {
            const warningContent = trimmedLine.replace(/^⚠️\s*/, '').replace(/^\[warning\]\s*/i, '');
            elements.push(<TipBox key={index} content={warningContent} type="warning" />);
            return;
        }

        // Example boxes
        if (trimmedLine.toLowerCase().startsWith('[example]') || trimmedLine.startsWith('📝')) {
            const exampleContent = trimmedLine.replace(/^\[example\]\s*/i, '').replace(/^📝\s*/, '');
            elements.push(<TipBox key={index} content={exampleContent} type="example" />);
            return;
        }

        // List items with arrows
        if (trimmedLine.startsWith('→') || trimmedLine.startsWith('-')) {
            const listContent = trimmedLine.replace(/^[→-]\s*/, '');
            elements.push(
                <div key={index} className="flex items-start gap-3 my-2 ml-2">
                    <div className="w-5 h-5 rounded-full bg-[#E0F0FF] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-[#3398DB]" />
                    </div>
                    <p
                        className="text-[#475569] text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: listContent
                                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[#04306E] font-semibold">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="bg-[#F1F5F9] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#04306E] text-xs font-mono shadow-sm">$1</code>')
                        }}
                    />
                </div>
            );
            return;
        }

        // Numbered steps (format: 1. or Bước 1:)
        const stepMatch = trimmedLine.match(/^(?:(\d+)\.\s*|Bước\s*(\d+):\s*)(.+)$/i);
        if (stepMatch) {
            const stepNum = parseInt(stepMatch[1] || stepMatch[2]);
            const stepText = stepMatch[3];
            elements.push(<ProcessStep key={index} number={stepNum} title={stepText} />);
            return;
        }

        // Regular paragraph with inline formatting
        elements.push(
            <p
                key={index}
                className="text-[#334155] font-inter leading-relaxed my-3"
                dangerouslySetInnerHTML={{
                    __html: trimmedLine
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[#04306E] font-bold">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="bg-[#F1F5F9] border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#04306E] text-xs font-mono shadow-sm">$1</code>')
                        .replace(/→/g, '<span class="text-[#F59E0B] mx-1 font-bold">→</span>')
                        .replace(/↑/g, '<span class="text-emerald-500 font-bold ml-0.5">↑</span>')
                        .replace(/↓/g, '<span class="text-rose-500 font-bold ml-0.5">↓</span>')
                }}
            />
        );
    });

    return (
        <div className="space-y-1">
            {elements}

            {/* Key Points Section */}
            {keyPoints && keyPoints.length > 0 && (
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h4 className="text-[#04306E] font-space font-bold text-lg">Điểm chính cần nhớ</h4>
                    </div>
                    <div className="grid gap-3 relative z-10">
                        {keyPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Zap className="w-3 h-3 text-emerald-600" />
                                </div>
                                <p className="text-emerald-900 font-medium text-sm leading-relaxed">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

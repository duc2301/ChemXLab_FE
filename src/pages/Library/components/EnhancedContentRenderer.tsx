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
        <div className="my-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
                <Beaker className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Phương trình hóa học</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-lg font-mono">
                {parts.map((part, idx) => {
                    const trimmed = part.trim();
                    if (trimmed === '+') {
                        return <span key={idx} className="text-slate-400 font-bold">+</span>;
                    }
                    if (trimmed === '→' || trimmed === '=' || trimmed === '↔') {
                        return (
                            <span key={idx} className="text-yellow-400 font-bold mx-2 flex items-center">
                                <ArrowRight className="w-5 h-5" />
                            </span>
                        );
                    }
                    // Style the chemical formula
                    return (
                        <span key={idx} className="px-2 py-1 bg-slate-700/50 rounded-lg text-white font-semibold">
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
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/30',
            iconColor: 'text-emerald-400',
            textColor: 'text-emerald-200',
            label: 'Mẹo hay'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-orange-500/10',
            borderColor: 'border-orange-500/30',
            iconColor: 'text-orange-400',
            textColor: 'text-orange-200',
            label: 'Lưu ý'
        },
        note: {
            icon: BookOpen,
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            iconColor: 'text-blue-400',
            textColor: 'text-blue-200',
            label: 'Ghi nhớ'
        },
        example: {
            icon: FlaskConical,
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/30',
            iconColor: 'text-purple-400',
            textColor: 'text-purple-200',
            label: 'Ví dụ'
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className={`my-4 p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider ${config.iconColor} mb-1`}>
                        {config.label}
                    </p>
                    <p className={`${config.textColor} text-sm leading-relaxed`}>{content}</p>
                </div>
            </div>
        </div>
    );
}

// Definition card component
function DefinitionCard({ term, definition }: { term: string; definition: string }) {
    return (
        <div className="my-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
                    <Atom className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <h4 className="text-white font-bold text-lg mb-1">{term}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{definition}</p>
                </div>
            </div>
        </div>
    );
}

// Process step component
function ProcessStep({ number, title, description }: { number: number; title: string; description?: string }) {
    return (
        <div className="flex gap-4 my-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-sm">{number}</span>
            </div>
            <div className="flex-1">
                <h5 className="text-white font-semibold">{title}</h5>
                {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
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
                <h3 key={index} className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
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
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ArrowRight className="w-3 h-3 text-blue-400" />
                    </div>
                    <p
                        className="text-slate-300 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                            __html: listContent
                                .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="bg-slate-700 px-1.5 py-0.5 rounded text-cyan-300 text-xs font-mono">$1</code>')
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
                className="text-slate-300 leading-relaxed my-2"
                dangerouslySetInnerHTML={{
                    __html: trimmedLine
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="bg-slate-700/50 px-1.5 py-0.5 rounded text-cyan-300 text-xs font-mono">$1</code>')
                        .replace(/→/g, '<span class="text-yellow-400 mx-1">→</span>')
                        .replace(/↑/g, '<span class="text-green-400">↑</span>')
                        .replace(/↓/g, '<span class="text-red-400">↓</span>')
                }}
            />
        );
    });

    return (
        <div className="space-y-1">
            {elements}

            {/* Key Points Section */}
            {keyPoints && keyPoints.length > 0 && (
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="text-white font-bold text-lg">Điểm chính cần nhớ</h4>
                    </div>
                    <div className="grid gap-3">
                        {keyPoints.map((point, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Zap className="w-3 h-3 text-emerald-400" />
                                </div>
                                <p className="text-emerald-100 text-sm">{point}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

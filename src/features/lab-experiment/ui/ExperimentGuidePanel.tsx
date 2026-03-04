import { Beaker, BookOpen, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, FlaskConical, HelpCircle, ShieldAlert, Sparkles, Target } from 'lucide-react';
import { useState } from 'react';
import { GUIDED_EXPERIMENTS } from '../services/equipmentRegistry';

interface ExperimentGuidePanelProps {
    experimentId: string;
}

export const ExperimentGuidePanel = ({ experimentId }: ExperimentGuidePanelProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
    const [showObservations, setShowObservations] = useState(false);
    const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
    const [activeStep, setActiveStep] = useState(0);

    const experiment = GUIDED_EXPERIMENTS.find(e => e.id === experimentId);
    const guide = experiment?.guide;

    if (!guide) return null;

    const toggleStep = (index: number) => {
        const newExpanded = new Set(expandedSteps);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedSteps(newExpanded);
        setActiveStep(index);
    };

    const toggleAnswer = (index: number) => {
        const newRevealed = new Set(revealedAnswers);
        if (newRevealed.has(index)) {
            newRevealed.delete(index);
        } else {
            newRevealed.add(index);
        }
        setRevealedAnswers(newRevealed);
    };

    const PANEL_WIDTH = 420;

    return (
        <div
            style={{
                width: isCollapsed ? 52 : PANEL_WIDTH,
                minWidth: isCollapsed ? 52 : PANEL_WIDTH,
                background: 'linear-gradient(180deg, #0f1729 0%, #111827 50%, #0f172a 100%)',
                borderRight: '1px solid rgba(56, 189, 248, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                transition: 'width 0.3s ease, min-width 0.3s ease',
                overflow: 'hidden',
            }}
        >
            {isCollapsed ? (
                /* ═══ COLLAPSED STATE ═══ */
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingTop: 16,
                    gap: 12,
                    height: '100%',
                    minWidth: 52,
                }}>
                    <button
                        onClick={() => setIsCollapsed(false)}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        title="Mở hướng dẫn thí nghiệm"
                    >
                        <ChevronRight size={20} color="white" />
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <BookOpen size={18} color="#60a5fa" />
                        <span style={{
                            writingMode: 'vertical-rl',
                            color: '#93c5fd',
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 2,
                        }}>
                            HƯỚNG DẪN
                        </span>
                    </div>
                </div>
            ) : (
                /* ═══ EXPANDED STATE ═══ */
                <>
                    {/* ═══ HEADER ═══ */}
                    <div
                        style={{
                            padding: '14px 18px',
                            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: 8,
                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 10px rgba(59, 130, 246, 0.3)',
                            }}>
                                <BookOpen size={17} color="white" />
                            </div>
                            <div>
                                <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>Hướng dẫn thí nghiệm</div>
                                <div style={{ color: '#93c5fd', fontSize: 11, fontWeight: 500 }}>Làm theo từng bước nhé! 🎯</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(true)}
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                            title="Thu nhỏ"
                        >
                            <ChevronLeft size={16} color="#94a3b8" />
                        </button>
                    </div>

                    {/* ═══ SCROLLABLE CONTENT ═══ */}
                    <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="custom-scrollbar">

                        {/* ─── Title Card ─── */}
                        <div style={{
                            margin: '16px 14px',
                            padding: '18px 20px',
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <Sparkles size={16} color="#a78bfa" />
                                <span style={{ color: '#c4b5fd', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    {guide.reference}
                                </span>
                            </div>
                            <h3 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: '4px 0 6px', lineHeight: 1.3 }}>
                                {guide.title}
                            </h3>
                            <p style={{ color: '#93c5fd', fontSize: 14, fontWeight: 600, margin: 0 }}>
                                {guide.subtitle}
                            </p>
                        </div>

                        {/* ─── Equation Card ─── */}
                        <div style={{
                            margin: '0 14px 14px',
                            padding: '14px 18px',
                            borderRadius: 14,
                            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <FlaskConical size={15} color="#fbbf24" />
                                <span style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Phương trình phản ứng
                                </span>
                            </div>
                            <div style={{
                                fontFamily: "'Fira Code', 'Consolas', monospace",
                                fontSize: 18,
                                fontWeight: 700,
                                color: '#fef3c7',
                                letterSpacing: 1,
                                textAlign: 'center',
                                padding: '6px 0',
                            }}>
                                {guide.equation}
                            </div>
                        </div>

                        {/* ─── Objective ─── */}
                        <div style={{
                            margin: '0 14px 14px',
                            padding: '14px 16px',
                            borderRadius: 14,
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.15)',
                            display: 'flex',
                            gap: 12,
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: 10,
                                background: 'rgba(16, 185, 129, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <Target size={16} color="#34d399" />
                            </div>
                            <div>
                                <div style={{ color: '#34d399', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>🎯 Mục đích</div>
                                <p style={{ color: '#d1d5db', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                                    {guide.objective}
                                </p>
                            </div>
                        </div>

                        {/* ─── Steps ─── */}
                        <div style={{ padding: '0 14px 14px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginBottom: 14,
                            }}>
                                <Beaker size={18} color="#60a5fa" />
                                <span style={{ color: 'white', fontSize: 15, fontWeight: 700 }}>Các bước tiến hành</span>
                                <span style={{
                                    marginLeft: 'auto',
                                    fontSize: 11,
                                    color: '#64748b',
                                    fontWeight: 600,
                                }}>
                                    {activeStep + 1}/{guide.steps.length}
                                </span>
                            </div>

                            {/* Progress dots */}
                            <div style={{ display: 'flex', gap: 4, marginBottom: 14, paddingLeft: 2 }}>
                                {guide.steps.map((_, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            flex: 1,
                                            height: 4,
                                            borderRadius: 2,
                                            background: i <= activeStep
                                                ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
                                                : 'rgba(255,255,255,0.08)',
                                            transition: 'background 0.3s',
                                        }}
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {guide.steps.map((step, index) => {
                                    const isExpanded = expandedSteps.has(index);
                                    const isActive = activeStep === index;

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                borderRadius: 14,
                                                border: isActive
                                                    ? '1.5px solid rgba(99, 102, 241, 0.4)'
                                                    : '1px solid rgba(255,255,255,0.08)',
                                                background: isActive
                                                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.05))'
                                                    : 'rgba(255,255,255,0.03)',
                                                overflow: 'hidden',
                                                transition: 'all 0.25s ease',
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleStep(index)}
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {/* Step icon circle */}
                                                <div style={{
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: 12,
                                                    background: isActive
                                                        ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                                                        : 'rgba(255,255,255,0.06)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 18,
                                                    flexShrink: 0,
                                                    boxShadow: isActive ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none',
                                                    transition: 'all 0.25s',
                                                }}>
                                                    {step.icon}
                                                </div>
                                                <span style={{
                                                    flex: 1,
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color: isActive ? '#93c5fd' : '#cbd5e1',
                                                }}>
                                                    {step.title}
                                                </span>
                                                {isExpanded
                                                    ? <ChevronUp size={16} color="#64748b" />
                                                    : <ChevronDown size={16} color="#64748b" />
                                                }
                                            </button>

                                            {isExpanded && (
                                                <div style={{ padding: '0 16px 16px' }}>
                                                    <p style={{
                                                        color: '#d1d5db',
                                                        fontSize: 13,
                                                        lineHeight: 1.7,
                                                        margin: '0 0 10px',
                                                        paddingLeft: 50,
                                                    }}>
                                                        {step.content}
                                                    </p>
                                                    {step.tip && (
                                                        <div style={{
                                                            marginLeft: 50,
                                                            padding: '10px 14px',
                                                            borderRadius: 10,
                                                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05))',
                                                            border: '1px solid rgba(96, 165, 250, 0.2)',
                                                        }}>
                                                            <p style={{ color: '#93c5fd', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                                                                <span style={{ fontWeight: 700 }}>💡 Mẹo:</span> {step.tip}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ─── Observations / Questions ─── */}
                        <div style={{ padding: '0 14px 14px' }}>
                            <button
                                onClick={() => setShowObservations(!showObservations)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 14,
                                    background: showObservations
                                        ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(139, 92, 246, 0.06))'
                                        : 'rgba(255,255,255,0.03)',
                                    border: showObservations
                                        ? '1px solid rgba(168, 85, 247, 0.25)'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 10,
                                    background: 'rgba(168, 85, 247, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <HelpCircle size={16} color="#c084fc" />
                                </div>
                                <span style={{ flex: 1, color: '#e9d5ff', fontSize: 14, fontWeight: 700, textAlign: 'left' }}>
                                    🤔 Câu hỏi quan sát
                                </span>
                                <span style={{
                                    background: 'rgba(168, 85, 247, 0.2)',
                                    color: '#c084fc',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 20,
                                }}>
                                    {guide.observations.length}
                                </span>
                                {showObservations
                                    ? <ChevronUp size={16} color="#a78bfa" />
                                    : <ChevronDown size={16} color="#a78bfa" />
                                }
                            </button>

                            {showObservations && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                                    {guide.observations.map((obs, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: '14px 16px',
                                                borderRadius: 12,
                                                background: 'rgba(255,255,255,0.03)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                            }}
                                        >
                                            <p style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.6, margin: '0 0 10px' }}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 22,
                                                    height: 22,
                                                    borderRadius: 7,
                                                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                                    color: 'white',
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    marginRight: 8,
                                                    verticalAlign: 'middle',
                                                }}>
                                                    {index + 1}
                                                </span>
                                                {obs.question}
                                            </p>
                                            {revealedAnswers.has(index) ? (
                                                <div style={{
                                                    padding: '10px 14px',
                                                    borderRadius: 10,
                                                    background: 'rgba(16, 185, 129, 0.08)',
                                                    borderLeft: '3px solid #34d399',
                                                }}>
                                                    <p style={{ color: '#6ee7b7', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                                                        ✅ {obs.answer}
                                                    </p>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => toggleAnswer(index)}
                                                    style={{
                                                        padding: '6px 14px',
                                                        borderRadius: 8,
                                                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))',
                                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                                        color: '#a5b4fc',
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                    onMouseEnter={e => {
                                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(139, 92, 246, 0.15))';
                                                    }}
                                                    onMouseLeave={e => {
                                                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.1))';
                                                    }}
                                                >
                                                    👁 Xem đáp án
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ─── Safety Notes ─── */}
                        <div style={{
                            margin: '0 14px 18px',
                            padding: '16px 18px',
                            borderRadius: 14,
                            background: 'rgba(239, 68, 68, 0.06)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                <ShieldAlert size={16} color="#f87171" />
                                <span style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700 }}>⚠️ Lưu ý an toàn</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {guide.safetyNotes.map((note, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 8,
                                            padding: '8px 10px',
                                            borderRadius: 8,
                                            background: 'rgba(239, 68, 68, 0.05)',
                                        }}
                                    >
                                        <span style={{ color: '#f87171', fontSize: 14, flexShrink: 0, marginTop: 1 }}>•</span>
                                        <p style={{ color: '#d1d5db', fontSize: 12, lineHeight: 1.6, margin: 0 }}>{note}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};


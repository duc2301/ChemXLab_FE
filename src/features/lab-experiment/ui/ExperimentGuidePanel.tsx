import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { GuideStep } from '../services/equipmentRegistry';
import { getEquipmentById, GUIDED_EXPERIMENTS } from '../services/equipmentRegistry';
import { useExperimentStore } from '../services/experimentStore';
import { generateUUID } from '../services/idGenerator';

interface ExperimentGuidePanelProps { experimentId: string; }

// ─── Design tokens ────────────────────────────
const bg = '#0d1b2e';
const bgSurface = 'rgba(255,255,255,0.03)';
const border = 'rgba(67,139,196,0.14)';
const borderMid = 'rgba(67,139,196,0.28)';

const textPrimary = '#e8f1f9';
const textSecond = '#7aa8c8';
const textMuted = 'rgba(122,168,200,0.5)';

const accent = '#438BC4';   // Bluebird
const accentB = '#0055A0';   // Blueberry
const green = '#34d399';
const red = '#f87171';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

.egp, .egp * { box-sizing:border-box; -webkit-font-smoothing:antialiased; font-family:'Inter',sans-serif !important; }
.egp .mono    { font-family:'JetBrains Mono',monospace !important; }

.egp-scroll::-webkit-scrollbar       { width:3px; }
.egp-scroll::-webkit-scrollbar-track { background:transparent; }
.egp-scroll::-webkit-scrollbar-thumb { background:rgba(67,139,196,0.2); border-radius:4px; }

@keyframes egp-in { from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none} }
.egp-in { animation:egp-in 0.18s ease forwards; }

.egp-step:hover  { background:rgba(67,139,196,0.05) !important; }
.egp-obs:hover   { background:rgba(67,139,196,0.05) !important; }
.egp-tab:hover   { color:${textPrimary} !important; }
.egp-collapse:hover { background:rgba(67,139,196,0.08) !important; border-color:rgba(67,139,196,0.3) !important; }
`;

// ─── Reusable section label ───────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
        textTransform: 'uppercase', color: textMuted,
        marginBottom: 10,
    }}>{children}</div>
);

const Divider = () => (
    <div style={{ height: 1, background: border, margin: '4px 0' }} />
);

export const ExperimentGuidePanel = ({ experimentId }: ExperimentGuidePanelProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
    const [showObs, setShowObs] = useState(false);
    const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());
    const [activeStep, setActiveStep] = useState(0);
    const [activeTab, setActiveTab] = useState<'guide' | 'tools'>('guide');

    const { addDroppedItem, clearItems } = useExperimentStore();
    const experiment = GUIDED_EXPERIMENTS.find(e => e.id === experimentId);
    const guide = experiment?.guide;
    if (!guide || !experiment) return null;

    const toggleStep = (i: number) => {
        const s = new Set(expandedSteps);
        s.has(i) ? s.delete(i) : s.add(i);
        setExpandedSteps(s); setActiveStep(i);
    };
    const toggleAnswer = (i: number) => {
        const s = new Set(revealedAnswers);
        s.has(i) ? s.delete(i) : s.add(i);
        setRevealedAnswers(s);
    };
    const setupTable = () => {
        clearItems();
        experiment.equipment.forEach(item => {
            const eq = getEquipmentById(item.id);
            if (!eq) return;
            addDroppedItem({
                id: generateUUID(), equipmentId: eq.id,
                position: item.position as [number, number, number],
                rotation: item.rotation as [number, number, number],
                timestamp: Date.now(), collider: 'cuboid',
            });
        });
    };

    /* ── Collapsed ── */
    if (isCollapsed) return (
        <>
            <style>{CSS}</style>
            <div className="egp" style={{
                width: 48, minWidth: 48, height: '100%', background: bg,
                borderRight: `1px solid ${border}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16, gap: 16,
            }}>
                <button onClick={() => setIsCollapsed(false)} style={{
                    width: 32, height: 32, borderRadius: 8, border: `1px solid ${borderMid}`,
                    background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = `rgba(67,139,196,0.12)`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <ChevronRight size={14} color={accent} />
                </button>
                <span style={{
                    writingMode: 'vertical-rl', color: textMuted,
                    fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase',
                }}>Guide</span>
            </div>
        </>
    );

    /* ── Expanded ── */
    return (
        <>
            <style>{CSS}</style>
            <div className="egp" style={{
                width: 400, minWidth: 400, height: '100%',
                background: bg, borderRight: `1px solid ${border}`,
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}>

                {/* ══ HEADER ══ */}
                <div style={{
                    padding: '14px 18px 13px',
                    borderBottom: `1px solid ${border}`,
                    flexShrink: 0,
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
                }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: textPrimary, fontWeight: 800, fontSize: 16, letterSpacing: -0.4, lineHeight: 1.2 }}>
                            Hướng dẫn thí nghiệm
                        </div>
                        <div style={{
                            color: textMuted, fontSize: 11, fontWeight: 500, marginTop: 4,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {guide.reference}
                        </div>
                    </div>
                    <button className="egp-collapse" onClick={() => setIsCollapsed(true)} style={{
                        width: 28, height: 28, borderRadius: 7, background: 'transparent',
                        border: `1px solid ${border}`, cursor: 'pointer', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}>
                        <ChevronLeft size={13} color={textMuted} />
                    </button>
                </div>

                {/* ══ EXPERIMENT CARD ══ */}
                <div style={{
                    margin: '12px 18px 0', borderRadius: 10,
                    background: 'rgba(0,85,160,0.12)',
                    border: `1px solid rgba(67,139,196,0.22)`,
                    padding: '12px 16px', flexShrink: 0,
                }}>
                    <div style={{ color: textMuted, fontSize: 10, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 6 }}>
                        Bài học hóa học
                    </div>
                    <div style={{ color: textPrimary, fontSize: 15, fontWeight: 800, lineHeight: 1.3, marginBottom: 4, letterSpacing: -0.3 }}>
                        {guide.title}
                    </div>
                    <div style={{ color: textSecond, fontSize: 12, lineHeight: 1.6 }}>
                        {guide.subtitle}
                    </div>
                </div>

                {/* ══ TABS ══ */}
                <div style={{
                    margin: '12px 18px 0', flexShrink: 0,
                    display: 'flex', gap: 4, padding: '4px',
                    background: bgSurface, borderRadius: 10, border: `1px solid ${border}`,
                }}>
                    {(['guide', 'tools'] as const).map(tab => {
                        const on = activeTab === tab;
                        return (
                            <button key={tab} className={on ? '' : 'egp-tab'} onClick={() => setActiveTab(tab)} style={{
                                flex: 1, height: 30, borderRadius: 7,
                                background: on ? `linear-gradient(135deg, ${accentB}, ${accent})` : 'transparent',
                                border: 'none',
                                color: on ? '#fff' : textMuted,
                                fontSize: 12, fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.18s',
                                boxShadow: on ? '0 2px 8px rgba(0,85,160,0.35)' : 'none',
                            }}>
                                {tab === 'guide' ? 'Hướng dẫn' : 'Dụng cụ'}
                            </button>
                        );
                    })}
                </div>

                {/* ══ SCROLL BODY ══ */}
                <div className="egp-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', marginTop: 12 }}>

                    {/* ── GUIDE TAB ── */}
                    {activeTab === 'guide' && (
                        <div className="egp-in" style={{ padding: '0 18px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Phương trình */}
                            <div>
                                <SectionLabel>Phương trình phản ứng</SectionLabel>
                                <div className="mono" style={{
                                    padding: '13px 16px', borderRadius: 9,
                                    background: 'rgba(0,85,160,0.15)',
                                    border: `1px solid rgba(67,139,196,0.25)`,
                                    color: textPrimary, fontSize: 14.5, fontWeight: 600,
                                    textAlign: 'center', lineHeight: 1.7,
                                }}>
                                    {guide.equation}
                                </div>
                            </div>

                            <Divider />

                            {/* Mục tiêu */}
                            <div>
                                <SectionLabel>Mục tiêu</SectionLabel>
                                <p style={{
                                    color: textSecond, fontSize: 13, lineHeight: 1.85, margin: 0,
                                    paddingLeft: 12, borderLeft: `2px solid ${borderMid}`,
                                }}>
                                    {guide.objective}
                                </p>
                            </div>

                            <Divider />
                            {/* Progress dots */}
                            <div style={{ display: 'flex', gap: 4, marginBottom: 14, paddingLeft: 2 }}>
                                {guide.steps.map((_: GuideStep, i: number) => (
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

                            {/* Các bước */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {guide.steps.map((step: GuideStep, index: number) => {
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
                                                            padding: '10px 13px', borderRadius: 8,
                                                            background: 'rgba(251,191,36,0.05)',
                                                            border: '1px solid rgba(251,191,36,0.18)',
                                                            borderLeft: '3px solid rgba(251,191,36,0.45)',
                                                            marginLeft: 50,
                                                        }}>
                                                            <div style={{ color: 'rgba(251,191,36,0.6)', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 5 }}>Gợi ý</div>
                                                            <p style={{ color: 'rgba(251,191,36,0.8)', fontSize: 12.5, lineHeight: 1.7, margin: 0 }}>{step.tip}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Divider />

                            {/* Câu hỏi quan sát */}
                            <div>
                                <button className="egp-obs" onClick={() => setShowObs(v => !v)} style={{
                                    width: '100%', padding: '6px 4px', background: 'transparent', border: 'none',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                                    borderRadius: 7, transition: 'background 0.15s', textAlign: 'left', marginBottom: 2,
                                }}>
                                    <span style={{ flex: 1, color: textPrimary, fontSize: 13, fontWeight: 700 }}>Câu hỏi quan sát</span>
                                    <span style={{
                                        background: `rgba(67,139,196,0.12)`, border: `1px solid ${border}`,
                                        color: accent, fontSize: 10, fontWeight: 700,
                                        padding: '1px 7px', borderRadius: 99,
                                    }}>{guide.observations.length}</span>
                                    {showObs
                                        ? <ChevronUp size={13} color={textMuted} style={{ flexShrink: 0 }} />
                                        : <ChevronDown size={13} color={textMuted} style={{ flexShrink: 0 }} />
                                    }
                                </button>
                                {showObs && (
                                    <div className="egp-in" style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {guide.observations.map((obs, idx) => (
                                            <div key={idx} style={{
                                                padding: '12px 14px', borderRadius: 9,
                                                background: bgSurface, border: `1px solid ${border}`,
                                            }}>
                                                <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        minWidth: 20, height: 20, borderRadius: 6,
                                                        background: `rgba(0,85,160,0.3)`, border: `1px solid ${borderMid}`,
                                                        color: accent, fontSize: 10, fontWeight: 800, flexShrink: 0,
                                                    }}>{idx + 1}</span>
                                                    <p style={{ color: textSecond, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{obs.question}</p>
                                                </div>
                                                {revealedAnswers.has(idx) ? (
                                                    <div className="egp-in" style={{
                                                        borderLeft: `2px solid ${green}`, paddingLeft: 12, marginLeft: 30,
                                                    }}>
                                                        <p style={{ color: green, fontSize: 12.5, margin: 0, lineHeight: 1.65 }}>{obs.answer}</p>
                                                    </div>
                                                ) : (
                                                    <div style={{ paddingLeft: 30 }}>
                                                        <button onClick={() => toggleAnswer(idx)} style={{
                                                            padding: '5px 13px', borderRadius: 6,
                                                            background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.25)`,
                                                            color: green, fontSize: 12, fontWeight: 600,
                                                            cursor: 'pointer', transition: 'background 0.15s',
                                                        }}
                                                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.16)'; }}
                                                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; }}>
                                                            Xem đáp án
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Divider />

                            {/* Lưu ý an toàn */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div style={{ color: red, fontSize: 13, fontWeight: 800 }}>Lưu ý an toàn</div>
                                    <span style={{
                                        background: 'rgba(248,113,113,0.08)', border: `1px solid rgba(248,113,113,0.22)`,
                                        color: red, fontSize: 9.5, fontWeight: 700, padding: '2px 9px', borderRadius: 99, letterSpacing: 0.8,
                                    }}>QUAN TRỌNG</span>
                                </div>
                                <div style={{
                                    borderLeft: `2px solid rgba(248,113,113,0.3)`, paddingLeft: 14,
                                    display: 'flex', flexDirection: 'column', gap: 9,
                                }}>
                                    {guide.safetyNotes.map((note, i) => (
                                        <p key={i} style={{ color: 'rgba(252,165,165,0.85)', fontSize: 13, lineHeight: 1.75, margin: 0 }}>{note}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TOOLS TAB ── */}
                    {activeTab === 'tools' && (
                        <div className="egp-in" style={{ padding: '0 18px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Vật liệu */}
                            <div>
                                <SectionLabel>Dụng cụ & Hóa chất</SectionLabel>
                                <div style={{ borderRadius: 9, border: `1px solid ${border}`, overflow: 'hidden' }}>
                                    {guide.materials.map((item, i) => (
                                        <div key={i} style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '9px 14px',
                                            borderBottom: i < guide.materials.length - 1 ? `1px solid ${border}` : 'none',
                                            background: i % 2 === 0 ? 'transparent' : bgSurface,
                                        }}>
                                            <span style={{ color: textMuted, fontSize: 10, fontWeight: 700, minWidth: 22, textAlign: 'right', flexShrink: 0 }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span style={{ color: textSecond, fontSize: 13 }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Divider />

                            {/* Thêm nhanh */}
                            <div>
                                <SectionLabel>Thêm dụng cụ vào bàn</SectionLabel>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {experiment.equipment.map((item, idx) => {
                                        const eq = getEquipmentById(item.id);
                                        if (!eq) return null;
                                        return (
                                            <button key={idx}
                                                onClick={() => addDroppedItem({
                                                    id: generateUUID(), equipmentId: eq.id,
                                                    position: item.position as [number, number, number],
                                                    rotation: item.rotation as [number, number, number],
                                                    timestamp: Date.now(), collider: 'cuboid',
                                                })}
                                                style={{
                                                    padding: '5px 12px', borderRadius: 99,
                                                    background: bgSurface, border: `1px solid ${border}`,
                                                    color: textSecond, fontSize: 12, fontWeight: 500,
                                                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background = 'rgba(67,139,196,0.12)';
                                                    e.currentTarget.style.borderColor = borderMid;
                                                    e.currentTarget.style.color = textPrimary;
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background = bgSurface;
                                                    e.currentTarget.style.borderColor = border;
                                                    e.currentTarget.style.color = textSecond;
                                                }}>
                                                <span style={{ color: accent, fontWeight: 700, fontSize: 13, lineHeight: 1 }}>+</span>
                                                {eq.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Divider />

                            {/* CTA */}
                            <div>
                                <button onClick={setupTable} style={{
                                    width: '100%', padding: '13px 20px', borderRadius: 10,
                                    background: `linear-gradient(135deg, ${accentB} 0%, ${accent} 100%)`,
                                    border: 'none', color: '#fff',
                                    fontSize: 14, fontWeight: 700,
                                    cursor: 'pointer', boxShadow: '0 4px 18px rgba(0,85,160,0.4)',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 7px 24px rgba(0,85,160,0.5)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,85,160,0.4)'; }}>
                                    Chuẩn bị toàn bộ bàn thí nghiệm
                                </button>
                                <p style={{ color: textMuted, fontSize: 11.5, textAlign: 'center', margin: '8px 0 0' }}>
                                    Dọn sạch bàn và sắp xếp lại theo vị trí chuẩn
                                </p>
                            </div>

                            <Divider />

                            {/* Lưu ý an toàn */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div style={{ color: red, fontSize: 13, fontWeight: 800 }}>Lưu ý an toàn</div>
                                    <span style={{
                                        background: 'rgba(248,113,113,0.08)', border: `1px solid rgba(248,113,113,0.22)`,
                                        color: red, fontSize: 9.5, fontWeight: 700, padding: '2px 9px', borderRadius: 99, letterSpacing: 0.8,
                                    }}>QUAN TRỌNG</span>
                                </div>
                                <div style={{
                                    borderLeft: `2px solid rgba(248,113,113,0.3)`, paddingLeft: 14,
                                    display: 'flex', flexDirection: 'column', gap: 9,
                                }}>
                                    {guide.safetyNotes.map((note, i) => (
                                        <p key={i} style={{ color: 'rgba(252,165,165,0.85)', fontSize: 13, lineHeight: 1.75, margin: 0 }}>{note}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

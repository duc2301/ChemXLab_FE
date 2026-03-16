import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import type { GuideObservation, GuideStep } from '../services/equipmentRegistry';
import { getEquipmentById, GUIDED_EXPERIMENTS } from '../services/equipmentRegistry';
import { useExperimentStore } from '../services/experimentStore';
import { generateUUID } from '../services/idGenerator';

interface ExperimentGuidePanelProps { experimentId: string; }

// ─── Design tokens (Matched to website theme) ────────────────────────────
const bg = '#0d1b2e';
const border = 'rgba(67, 139, 196, 0.12)';
const borderMid = 'rgba(67, 139, 196, 0.24)';

const textPrimary = '#e8f1f9';
const textSecond = '#7aa8c8';
const textMuted = 'rgba(122, 168, 200, 0.45)';

const accent = '#438BC4';
const accentB = '#0055A0';
const green = '#34d399';
const red = '#f87171';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.egp, .egp * { 
    box-sizing: border-box; 
    -webkit-font-smoothing: antialiased; 
    font-family: "Google Sans", "Roboto", sans-serif !important; 
}

.egp .mono { 
    font-family: 'JetBrains Mono', monospace !important; 
}

.egp-scroll::-webkit-scrollbar { width: 3px; }
.egp-scroll::-webkit-scrollbar-track { background: transparent; }
.egp-scroll::-webkit-scrollbar-thumb { background: rgba(67, 139, 196, 0.15); border-radius: 10px; }

@keyframes egp-in { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none} }
.egp-in { animation: egp-in 0.2s ease-out forwards; }

.egp-tab:hover { color: ${textPrimary} !important; }
.egp-collapse:hover { background: rgba(67, 139, 196, 0.08) !important; border-color: rgba(67, 139, 196, 0.25) !important; }
`;

// ─── Reusable components ──────────────────────
const SectionLabel = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <div style={{
        fontSize: 9.5, fontWeight: 700, letterSpacing: 1.1,
        textTransform: 'uppercase', color: textMuted,
        marginBottom: 10,
        ...style
    }}>{children}</div>
);

const Card = ({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) => (
    <div style={{
        background: 'rgba(255,255,255,0.015)',
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '16px',
        marginBottom: 16,
        ...style
    }}>{children}</div>
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
        if (s.has(i)) s.delete(i);
        else s.add(i);
        setExpandedSteps(s);
        setActiveStep(i);
    };

    const toggleAnswer = (i: number) => {
        const s = new Set(revealedAnswers);
        if (s.has(i)) s.delete(i);
        else s.add(i);
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
                    width: 30, height: 30, borderRadius: 8, border: `1px solid ${borderMid}`,
                    background: 'transparent', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                }}>
                    <ChevronRight size={14} color={accent} />
                </button>
                <span style={{
                    writingMode: 'vertical-rl', color: textMuted,
                    fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                    opacity: 0.5,
                }}>Hướng dẫn</span>
            </div>
        </>
    );

    /* ── Expanded ── */
    return (
        <>
            <style>{CSS}</style>
            <div className="egp" style={{
                width: 450, minWidth: 450, height: '100%',
                background: bg, borderRight: `1px solid ${border}`,
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
                boxShadow: '10px 0 30px rgba(0,0,0,0.25)',
            }}>

                {/* ══ HEADER ══ */}
                <div style={{
                    padding: '20px 24px 16px',
                    borderBottom: `1px solid ${border}`,
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{ color: textPrimary, fontWeight: 700, fontSize: 16, letterSpacing: -0.3 }}>
                            Hướng dẫn thí nghiệm
                        </div>
                        <div style={{ color: textMuted, fontSize: 10, fontWeight: 500, marginTop: 4 }}>
                            {guide.reference}
                        </div>
                    </div>
                    <button className="egp-collapse" onClick={() => setIsCollapsed(true)} style={{
                        width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${border}`, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}>
                        <ChevronLeft size={14} color={textMuted} />
                    </button>
                </div>

                {/* ══ SCROLL BODY ══ */}
                <div className="egp-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

                    {/* ══ EXPERIMENT TITLE BOX ══ */}
                    <div style={{
                        margin: '18px 24px', borderRadius: 10,
                        background: 'rgba(67,139,196,0.05)',
                        border: `1px solid rgba(67,139,196,0.12)`,
                        padding: '16px 20px',
                    }}>
                        <SectionLabel style={{ marginBottom: 6, fontSize: 8.5 }}>Bài học hóa học</SectionLabel>
                        <div style={{ color: textPrimary, fontSize: 14.5, fontWeight: 700, lineHeight: 1.35, marginBottom: 4 }}>
                            {guide.title}
                        </div>
                        <div style={{ color: textSecond, fontSize: 11.5, opacity: 0.75 }}>
                            {guide.subtitle}
                        </div>
                    </div>

                    {/* ══ TABS ══ */}
                    <div style={{
                        margin: '0 24px 20px',
                        display: 'flex', gap: 5, padding: '4px',
                        background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: `1px solid ${border}`,
                    }}>
                        {(['guide', 'tools'] as const).map(tab => {
                            const on = activeTab === tab;
                            return (
                                <button key={tab} className={on ? '' : 'egp-tab'} onClick={() => setActiveTab(tab)} style={{
                                    flex: 1, height: 30, borderRadius: 7,
                                    background: on ? `linear-gradient(135deg, ${accentB}, ${accent})` : 'transparent',
                                    border: 'none', color: on ? '#fff' : textMuted,
                                    fontSize: 11.5, fontWeight: 700,
                                    cursor: 'pointer', transition: 'all 0.18s',
                                    boxShadow: on ? '0 3px 10px rgba(0,85,160,0.15)' : 'none',
                                }}>
                                    {tab === 'guide' ? 'Hướng dẫn' : 'Dụng cụ'}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── CONTENT ── */}
                    {activeTab === 'guide' && (
                        <div className="egp-in" style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column' }}>

                            {/* Phương trình & Mục tiêu Grouped */}
                            <Card style={{ padding: '16px 20px' }}>
                                <SectionLabel>Phương trình phản ứng</SectionLabel>
                                <div className="mono" style={{
                                    padding: '12px 0', color: textPrimary, fontSize: 15, fontWeight: 700,
                                    textAlign: 'center', lineHeight: 1.6, borderBottom: `1px solid ${border}`,
                                    marginBottom: 16,
                                }}>
                                    {guide.equation}
                                </div>
                                <SectionLabel>Mục tiêu</SectionLabel>
                                <p style={{ color: 'rgba(232, 241, 249, 0.65)', fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
                                    {guide.objective}
                                </p>
                            </Card>

                            {/* Các bước tiến hành Grouped */}
                            <Card style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                                    <SectionLabel style={{ marginBottom: 0 }}>Các bước tiến hành</SectionLabel>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 60, height: 3.5, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', width: `${((activeStep + 1) / guide.steps.length) * 100}%`,
                                                background: accent, transition: 'width 0.3s ease-out'
                                            }} />
                                        </div>
                                        <span style={{ color: textMuted, fontSize: 10, fontWeight: 700 }}>
                                            {activeStep + 1}/{guide.steps.length}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{
                                        position: 'absolute', left: 14, top: 32, bottom: 32,
                                        width: 1, background: 'rgba(67, 139, 196, 0.08)',
                                    }} />

                                    {guide.steps.map((step: GuideStep, index: number) => {
                                        const isExpanded = expandedSteps.has(index);
                                        const isActive = activeStep === index;
                                        const isCompleted = index < activeStep;

                                        return (
                                            <div key={index} style={{ position: 'relative', paddingBottom: 6 }}>
                                                <button
                                                    onClick={() => toggleStep(index)}
                                                    style={{
                                                        width: '100%', padding: '8px 10px 8px 0px',
                                                        display: 'flex', alignItems: 'center', gap: 12,
                                                        background: isActive ? 'rgba(67, 139, 196, 0.04)' : 'transparent',
                                                        border: 'none', borderRadius: 8,
                                                        cursor: 'pointer', textAlign: 'left',
                                                        transition: 'all 0.15s',
                                                    }}
                                                >
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                        background: isCompleted ? 'transparent' : (isActive ? `linear-gradient(135deg, ${accentB}, ${accent})` : 'rgba(255,255,255,0.02)'),
                                                        border: isCompleted ? `2px solid ${green}` : `1px solid ${isActive ? accent : 'rgba(255,255,255,0.08)'}`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: 11.5, fontWeight: 800, color: isCompleted ? green : (isActive ? '#fff' : textMuted),
                                                        zIndex: 2, transition: 'all 0.2s',
                                                    }}>
                                                        {isCompleted ? '✓' : (index + 1)}
                                                    </div>

                                                    <div style={{ flex: 1 }}>
                                                        <div style={{
                                                            color: isCompleted ? green : (isActive ? textPrimary : textSecond),
                                                            fontSize: 12.5, fontWeight: 700, lineHeight: 1.3,
                                                        }}>
                                                            Bước {index + 1}: {step.title}
                                                        </div>
                                                        {!isExpanded && (
                                                            <div style={{ color: textMuted, fontSize: 9, marginTop: 2 }}>
                                                                Nhấn để xem chi tiết
                                                            </div>
                                                        )}
                                                    </div>

                                                    <ChevronDown size={12} color={textMuted} style={{
                                                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                                                        transition: 'transform 0.15s',
                                                    }} />
                                                </button>

                                                {isExpanded && (
                                                    <div className="egp-in" style={{ padding: '4px 12px 16px 40px' }}>
                                                        <p style={{ color: 'rgba(232, 241, 249, 0.75)', fontSize: 12, lineHeight: 1.6, margin: '0 0 12px' }}>
                                                            {step.content}
                                                        </p>
                                                        {step.tip && (
                                                            <div style={{
                                                                padding: '8px 12px', borderRadius: 8,
                                                                background: 'rgba(67,139,196,0.05)', borderLeft: `2px solid ${accent}`,
                                                            }}>
                                                                <p style={{ color: textSecond, fontSize: 10.5, margin: 0, fontStyle: 'italic' }}>
                                                                    {step.tip}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>

                            {/* Chú ý Section (New) */}
                            {guide.notes && guide.notes.length > 0 && (
                                <Card style={{ background: 'rgba(67, 139, 196, 0.03)', border: `1px solid rgba(67, 139, 196, 0.2)` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                        <Info size={14} color={accent} />
                                        <SectionLabel style={{ marginBottom: 0, color: textPrimary }}>Chú ý quan trọng</SectionLabel>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {guide.notes.map((note, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: 10 }}>
                                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: accent, marginTop: 7, flexShrink: 0 }} />
                                                <p style={{ color: 'rgba(232, 241, 249, 0.75)', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{note}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Câu hỏi quan sát & hiện tượng */}
                            <div style={{ marginBottom: 16 }}>
                                <button onClick={() => setShowObs(!showObs)} style={{
                                    width: '100%', padding: '12px 18px', borderRadius: 12,
                                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`,
                                    display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}>
                                    <span style={{ flex: 1, textAlign: 'left', color: textPrimary, fontSize: 12.5, fontWeight: 700 }}>Câu hỏi quan sát & hiện tượng</span>
                                    <span style={{ background: 'rgba(67,139,196,0.08)', color: accent, fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>{guide.observations.length}</span>
                                    {showObs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                {showObs && (
                                    <div className="egp-in" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {guide.observations.map((obs: GuideObservation, i: number) => (
                                            <div key={i} style={{ padding: '16px', borderRadius: 12, background: 'rgba(255,255,255,0.01)', border: `1px solid ${border}` }}>
                                                <p style={{ color: textPrimary, fontSize: 12.5, fontWeight: 600, marginBottom: 12, lineHeight: 1.55 }}>{obs.question}</p>
                                                {!revealedAnswers.has(i) ? (
                                                    <button
                                                        onClick={() => toggleAnswer(i)}
                                                        style={{
                                                            padding: '6px 14px', borderRadius: 6, background: 'rgba(52,211,153,0.06)',
                                                            border: `1px solid rgba(52,211,153,0.15)`, color: green, fontSize: 10.5, fontWeight: 700,
                                                            cursor: 'pointer', transition: 'all 0.15s',
                                                        }}>
                                                        Xem đáp án
                                                    </button>
                                                ) : (
                                                    <div className="egp-in" style={{ borderLeft: `2px solid ${green}`, paddingLeft: 14 }}>
                                                        <p style={{ color: green, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{obs.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Safety Section inside Scroll Area for better cohesion */}
                            <div style={{
                                padding: '16px', borderRadius: 12, border: `1px solid rgba(248,113,113,0.15)`,
                                background: 'rgba(248,113,113,0.02)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <AlertCircle size={14} color={red} />
                                    <SectionLabel style={{ marginBottom: 0, color: red }}>Lưu ý an toàn</SectionLabel>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {guide.safetyNotes.map((note, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 10 }}>
                                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: red, marginTop: 7, flexShrink: 0, opacity: 0.5 }} />
                                            <p style={{ color: 'rgba(252, 165, 165, 0.7)', fontSize: 11.5, lineHeight: 1.5, margin: 0 }}>{note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TOOLS TAB ── */}
                    {activeTab === 'tools' && (
                        <div className="egp-in" style={{ padding: '0 24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

                            {/* Dụng cụ & Hóa chất */}
                            <Card style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
                                    <SectionLabel style={{ marginBottom: 0 }}>Dụng cụ & Hóa chất chuẩn bị</SectionLabel>
                                </div>
                                <div>
                                    {guide.materials.map((m, i) => (
                                        <div key={i} style={{
                                            padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16,
                                            borderBottom: i < guide.materials.length - 1 ? `1px solid ${border}` : 'none',
                                            background: i % 2 === 1 ? 'rgba(255,255,255,0.01)' : 'transparent',
                                        }}>
                                            <span style={{ fontSize: 9.5, fontWeight: 700, color: textMuted, width: 14 }}>{String(i + 1).padStart(2, '0')}</span>
                                            <span style={{ color: 'rgba(232, 241, 249, 0.8)', fontSize: 12 }}>{m}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Thêm nhanh */}
                            <Card style={{ padding: '16px 20px' }}>
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
                                                    background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`,
                                                    color: textSecond, fontSize: 11, fontWeight: 600,
                                                    cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5,
                                                    padding: '6px 14px', borderRadius: 99,
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.background = 'rgba(67,139,196,0.08)';
                                                    e.currentTarget.style.borderColor = accent;
                                                    e.currentTarget.style.color = textPrimary;
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                                    e.currentTarget.style.borderColor = border;
                                                    e.currentTarget.style.color = textSecond;
                                                }}>
                                                <span style={{ color: accent, fontWeight: 700, fontSize: 12 }}>+</span>
                                                {eq.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Card>

                            {/* Setup CTA */}
                            <button onClick={setupTable} style={{
                                width: '100%', padding: '16px', borderRadius: 12,
                                background: `linear-gradient(135deg, ${accentB} 0%, ${accent} 100%)`,
                                border: 'none', color: '#fff', fontSize: 13.5, fontWeight: 700,
                                cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,85,160,0.25)',
                                transition: 'all 0.2s', marginTop: 4,
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                Chuẩn bị toàn bộ bàn thí nghiệm
                            </button>
                            <p style={{ color: textMuted, fontSize: 10.5, textAlign: 'center', margin: 0 }}>
                                Dọn sạch bàn và sắp xếp lại theo vị trí chuẩn
                            </p>
                        </div>
                    )}
                </div>

                {/* Simplified Sticky Footer */}
                <div style={{
                    padding: '12px 24px', borderTop: `1px solid ${border}`,
                    background: 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ color: textMuted, fontSize: 9.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                        ChemXLab - Nơi thí nghiệm hóa học trở nên dễ dàng và thú vị
                    </span>
                </div>
            </div>
        </>
    );
};

export default ExperimentGuidePanel;

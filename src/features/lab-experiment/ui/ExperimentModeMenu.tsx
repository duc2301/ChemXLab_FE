import { Beaker, BookOpen, ChevronRight, FlaskConical, X } from 'lucide-react';
import { GUIDED_EXPERIMENTS } from '../services/equipmentRegistry';

/* ── Design tokens (matched to ExperimentGuidePanel) ── */
const bg = '#0d1b2e';
const border = 'rgba(67, 139, 196, 0.12)';
const borderMid = 'rgba(67, 139, 196, 0.24)';

const textPrimary = '#e8f1f9';
const textSecond = '#7aa8c8';
const textMuted = 'rgba(122, 168, 200, 0.45)';

const accent = '#438BC4';
const accentB = '#0055A0';
const green = '#34d399';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.emm, .emm * {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font-family: "Google Sans", "Roboto", sans-serif !important;
}

.emm-scroll::-webkit-scrollbar { width: 3px; }
.emm-scroll::-webkit-scrollbar-track { background: transparent; }
.emm-scroll::-webkit-scrollbar-thumb { background: rgba(67, 139, 196, 0.15); border-radius: 10px; }

@keyframes emm-in { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none} }
@keyframes emm-overlay { from{opacity:0}to{opacity:1} }
.emm-in { animation: emm-in 0.25s ease-out forwards; }
.emm-overlay { animation: emm-overlay 0.2s ease-out forwards; }
`;

// Group experiments by lesson
const groupByLesson = () => {
  const groups: Record<string, { lesson: string; book: string; experiments: typeof GUIDED_EXPERIMENTS }> = {};

  GUIDED_EXPERIMENTS.forEach(exp => {
    const ref = exp.guide?.reference || '';
    // Extract lesson info from reference
    const baiMatch = ref.match(/Bài\s+\d+[^)']*/);
    const lessonKey = baiMatch ? baiMatch[0] : 'Khác';

    if (!groups[lessonKey]) {
      groups[lessonKey] = {
        lesson: lessonKey,
        book: 'SGK KHTN 8 – Kết nối tri thức và cuộc sống',
        experiments: [],
      };
    }
    groups[lessonKey].experiments.push(exp);
  });

  return Object.values(groups);
};

export const ExperimentModeMenu = ({
  onSelectFree,
  onSelectGuided,
  onClose
}: {
  onSelectFree: () => void;
  onSelectGuided: (expId: string) => void;
  onClose: () => void;
}) => {
  const groups = groupByLesson();

  return (
    <>
      <style>{CSS}</style>
      <div className="emm emm-overlay" style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      }}>
        <div className="emm-in" style={{
          width: 560, maxHeight: '85vh',
          background: bg, border: `1px solid ${borderMid}`,
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(67,139,196,0.08)',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* ═══ HEADER ═══ */}
          <div style={{
            padding: '20px 24px 16px',
            borderBottom: `1px solid ${border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: textPrimary, fontWeight: 700, fontSize: 17, letterSpacing: -0.3 }}>
                Chọn chế độ thí nghiệm
              </div>
              <div style={{ color: textMuted, fontSize: 10, fontWeight: 500, marginTop: 4, letterSpacing: 0.3, textTransform: 'uppercase' }}>
                Phòng thí nghiệm ảo ChemXLab
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = border; }}
            >
              <X size={14} color={textMuted} />
            </button>
          </div>

          {/* ═══ SCROLLABLE BODY ═══ */}
          <div className="emm-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px 28px' }}>

            {/* ── FREE MODE ── */}
            <button
              onClick={onSelectFree}
              style={{
                width: '100%', padding: '18px 20px',
                background: 'rgba(52,211,153,0.04)',
                border: `1px solid rgba(52,211,153,0.15)`,
                borderRadius: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'all 0.2s', textAlign: 'left',
                marginBottom: 24,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.08)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.3)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.04)'; e.currentTarget.style.borderColor = 'rgba(52,211,153,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(52,211,153,0.08)', border: `1px solid rgba(52,211,153,0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Beaker size={20} color={green} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: green, fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
                  Thí nghiệm tự do
                </div>
                <div style={{ color: textSecond, fontSize: 11.5, lineHeight: 1.4, opacity: 0.7 }}>
                  Tự chọn dụng cụ, hóa chất và sắp xếp bàn thí nghiệm theo ý muốn
                </div>
              </div>
              <ChevronRight size={16} color={green} style={{ opacity: 0.5 }} />
            </button>

            {/* ── DIVIDER ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: border }} />
              <span style={{ color: textMuted, fontSize: 9, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', flexShrink: 0 }}>
                Thí nghiệm theo giáo trình
              </span>
              <div style={{ flex: 1, height: 1, background: border }} />
            </div>

            {/* ── BOOK BADGE ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(67,139,196,0.04)', border: `1px solid ${border}`,
              marginBottom: 18,
            }}>
              <BookOpen size={14} color={accent} style={{ flexShrink: 0 }} />
              <span style={{ color: textSecond, fontSize: 11, fontWeight: 600 }}>
                Sách giáo khoa Khoa học tự nhiên 8 – Kết nối tri thức và cuộc sống
              </span>
            </div>

            {/* ── GROUPED EXPERIMENTS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {groups.map((group, gi) => (
                <div key={gi}>
                  {/* Lesson header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    marginBottom: 10,
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accentB}, ${accent})`,
                      boxShadow: `0 0 6px ${accent}40`,
                    }} />
                    <span style={{
                      color: textPrimary, fontSize: 12, fontWeight: 700,
                      letterSpacing: -0.2,
                    }}>
                      {group.lesson}
                    </span>
                  </div>

                  {/* Experiment cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 14 }}>
                    {group.experiments.map(exp => {
                      // Extract the activity title from guide
                      const activityTitle = exp.guide?.title || '';
                      const equation = exp.guide?.equation || '';

                      return (
                        <button
                          key={exp.id}
                          onClick={() => onSelectGuided(exp.id)}
                          style={{
                            width: '100%', padding: '14px 16px',
                            background: 'rgba(255,255,255,0.015)',
                            border: `1px solid ${border}`,
                            borderRadius: 12, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 14,
                            transition: 'all 0.2s', textAlign: 'left',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(67,139,196,0.06)';
                            e.currentTarget.style.borderColor = borderMid;
                            e.currentTarget.style.transform = 'translateX(3px)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.015)';
                            e.currentTarget.style.borderColor = border;
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `linear-gradient(135deg, ${accentB}20, ${accent}15)`,
                            border: `1px solid ${accent}20`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <FlaskConical size={16} color={accent} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: textPrimary, fontSize: 12.5, fontWeight: 700, marginBottom: 2, lineHeight: 1.35 }}>
                              {activityTitle}
                            </div>
                            {equation && (
                              <div style={{
                                color: textSecond, fontSize: 10.5, opacity: 0.7,
                                fontFamily: "'JetBrains Mono', monospace",
                                marginTop: 2,
                              }}>
                                {equation}
                              </div>
                            )}
                          </div>
                          <ChevronRight size={14} color={textMuted} style={{ flexShrink: 0 }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ FOOTER ═══ */}
          <div style={{
            padding: '12px 24px', borderTop: `1px solid ${border}`,
            background: 'rgba(255,255,255,0.01)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: textMuted, fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              ChemXLab – Phòng thí nghiệm hóa học ảo
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
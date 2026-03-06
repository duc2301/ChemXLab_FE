import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabSettings } from '../../../features/lab-environment/services/labSettingsStore';
import Mascot7 from '../../../shared/assets/mascot/7.png';
import { LabScene } from '../../../Widget/lab-scene/ui/LabScene';

type GameState = 'welcome' | 'playing' | 'paused' | 'settings';
type SettingsTab = 'controls' | 'environment' | 'performance';

// ─── Floating Particle Component ────────────────────────────────────────
const FloatingParticle = ({ delay, size, left, top, duration, color }: {
  delay: number; size: number; left: string; top: string; duration: number; color: string;
}) => (
  <div
    className="absolute rounded-full opacity-0 pointer-events-none"
    style={{
      width: size,
      height: size,
      left,
      top,
      background: `radial-gradient(circle, ${color}, transparent)`,
      animation: `floatParticle ${duration}s ease-in-out ${delay}s infinite`,
    }}
  />
);

// ─── Control Key Hint ──────────────────────────────────────────────────
const KeyHint = ({ keyLabel, description }: { keyLabel: string; description: string }) => (
  <div className="flex items-center gap-3">
    <kbd
      className="inline-flex items-center justify-center min-w-[40px] h-[40px] px-2 rounded-lg font-bold text-sm"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.9)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {keyLabel}
    </kbd>
    <span className="text-slate-400 text-sm font-medium">{description}</span>
  </div>
);

// ─── Menu Button ────────────────────────────────────────────────────────
const MenuButton = ({ icon, label, onClick, variant = 'default', subtitle }: {
  icon: string; label: string; onClick: () => void; variant?: 'default' | 'primary' | 'danger'; subtitle?: string;
}) => {
  const styles = {
    default: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      hoverBg: 'rgba(255,255,255,0.1)',
    },
    primary: {
      background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(37,99,235,0.3))',
      border: '1px solid rgba(59,130,246,0.4)',
      hoverBg: 'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(37,99,235,0.5))',
    },
    danger: {
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.2)',
      hoverBg: 'rgba(239,68,68,0.2)',
    },
  };
  const s = styles[variant];

  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-4 px-6 py-4 rounded-xl text-white font-semibold text-base transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      style={{
        background: s.background,
        border: s.border,
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = s.hoverBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = s.background; }}
    >
      <span className="text-xl">{icon}</span>
      <div className="flex flex-col items-start">
        <span>{label}</span>
        {subtitle && <span className="text-xs text-slate-400 font-normal">{subtitle}</span>}
      </div>
    </button>
  );
};

// ─── Settings Slider ────────────────────────────────────────────────────
const SettingsSlider = ({ label, value, min, max, step, onChange, hint, unit }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string; unit?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-sm text-slate-300 font-medium">{label}</span>
        {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
      </div>
      <span className="text-xs text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded-md">
        {value % 1 === 0 ? value : value.toFixed(2)}{unit ? ` ${unit}` : ''}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
      }}
    />
  </div>
);

// ─── Settings Toggle ────────────────────────────────────────────────────
const SettingsToggle = ({ label, value, onChange, hint }: {
  label: string; value: boolean; onChange: (v: boolean) => void; hint?: string;
}) => (
  <div className="flex justify-between items-center">
    <div className="flex flex-col">
      <span className="text-sm text-slate-300 font-medium">{label}</span>
      {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0"
      style={{
        background: value ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.1)',
        border: `1px solid ${value ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.15)'}`,
      }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200"
        style={{ transform: value ? 'translateX(22px)' : 'translateX(3px)' }}
      />
    </button>
  </div>
);

// ─── Settings Select ────────────────────────────────────────────────────
const SettingsSelect = ({ label, value, options, onChange, hint }: {
  label: string; value: string; options: { label: string; value: string }[];
  onChange: (v: string) => void; hint?: string;
}) => (
  <div className="space-y-2">
    <div className="flex flex-col">
      <span className="text-sm text-slate-300 font-medium">{label}</span>
      {hint && <span className="text-[10px] text-slate-500">{hint}</span>}
    </div>
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: value === opt.value
              ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
              : 'rgba(255,255,255,0.05)',
            border: `1px solid ${value === opt.value ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
            color: value === opt.value ? 'white' : 'rgba(255,255,255,0.6)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

// ─── Settings Section ───────────────────────────────────────────────────
const SettingsSection = ({ icon, title, children, description }: {
  icon: string; title: string; children: React.ReactNode; description?: string;
}) => (
  <div
    className="p-5 rounded-2xl space-y-4"
    style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    <div>
      <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
        {icon} {title}
      </h3>
      {description && <p className="text-[11px] text-slate-500 mt-1">{description}</p>}
    </div>
    {children}
  </div>
);

// ─── Key Binding Row ────────────────────────────────────────────────────
const KeyBindingRow = ({ action, keys }: { action: string; keys: string[] }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-slate-300">{action}</span>
    <div className="flex gap-1.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="inline-flex items-center justify-center min-w-[32px] h-[28px] px-2 rounded-md text-xs font-bold"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.7)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {key}
        </kbd>
      ))}
    </div>
  </div>
);

// ─── Preset Button ──────────────────────────────────────────────────────
const PresetButton = ({ label, icon, onClick, active }: {
  label: string; icon: string; onClick: () => void; active?: boolean;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex-1 min-w-[70px]"
    style={{
      background: active ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.25))' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
      color: active ? '#93c5fd' : 'rgba(255,255,255,0.5)',
    }}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

// ─── Tab Button ─────────────────────────────────────────────────────────
const TabButton = ({ icon, label, active, onClick }: {
  icon: string; label: string; active: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
    style={{
      background: active ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))' : 'transparent',
      border: active ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
      color: active ? '#93c5fd' : 'rgba(255,255,255,0.4)',
    }}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

// ═══════════════════════════════════════════════════════════════════════
// MAIN LABTEST COMPONENT
// ═══════════════════════════════════════════════════════════════════════
const LabTest = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('controls');
  const [activePreset, setActivePreset] = useState<string>('standard');

  // Read settings from zustand store
  const settings = useLabSettings();
  const updateSetting = useLabSettings((s) => s.updateSetting);
  const applyPresetAction = useLabSettings((s) => s.applyPreset);
  const resetToDefaults = useLabSettings((s) => s.resetToDefaults);

  const envPresetOptions = useMemo(() => [
    { label: '🏙️ Thành phố', value: 'city' },
    { label: '📸 Studio', value: 'studio' },
    { label: '🏭 Kho hàng', value: 'warehouse' },
    { label: '🏠 Căn hộ', value: 'apartment' },
  ], []);

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    applyPresetAction(preset);
  };

  // Particles data
  const particles = useMemo(() => [
    { delay: 0, size: 6, left: '10%', top: '20%', duration: 6, color: 'rgba(59,130,246,0.6)' },
    { delay: 1.5, size: 4, left: '25%', top: '60%', duration: 8, color: 'rgba(34,211,238,0.5)' },
    { delay: 0.8, size: 8, left: '70%', top: '15%', duration: 7, color: 'rgba(99,102,241,0.4)' },
    { delay: 2.2, size: 5, left: '80%', top: '70%', duration: 9, color: 'rgba(59,130,246,0.5)' },
    { delay: 3, size: 3, left: '45%', top: '80%', duration: 5, color: 'rgba(34,211,238,0.6)' },
    { delay: 0.5, size: 7, left: '90%', top: '40%', duration: 6.5, color: 'rgba(139,92,246,0.4)' },
    { delay: 1.8, size: 4, left: '15%', top: '85%', duration: 7.5, color: 'rgba(59,130,246,0.5)' },
    { delay: 2.8, size: 6, left: '60%', top: '45%', duration: 8.5, color: 'rgba(34,211,238,0.3)' },
    { delay: 0.3, size: 5, left: '35%', top: '30%', duration: 6, color: 'rgba(99,102,241,0.5)' },
    { delay: 3.5, size: 4, left: '50%', top: '10%', duration: 7, color: 'rgba(139,92,246,0.5)' },
    { delay: 1, size: 9, left: '5%', top: '50%', duration: 10, color: 'rgba(59,130,246,0.3)' },
    { delay: 2.5, size: 3, left: '75%', top: '90%', duration: 5.5, color: 'rgba(34,211,238,0.6)' },
  ], []);

  // ESC navigation
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (gameState === 'settings') {
        setGameState('paused');
      } else if (gameState === 'paused') {
        setGameState('playing');
      }
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  const handleStartExploring = () => setGameState('playing');
  const handlePause = () => setGameState('paused');
  const handleResume = () => setGameState('playing');
  const handleGoHome = () => navigate('/');
  const handleOpenSettings = () => setGameState('settings');
  const handleBackToPause = () => setGameState('paused');

  const isPaused = gameState === 'paused' || gameState === 'settings';

  return (
    <main className="w-full h-screen relative" style={{ background: '#0F172A' }}>

      {/* ─── CSS Keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
          20% { opacity: 1; }
          50% { opacity: 0.8; transform: translateY(-40px) scale(1.5); }
          80% { opacity: 0.3; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.3), 0 0 60px rgba(59,130,246,0.1); }
          50% { box-shadow: 0 0 30px rgba(59,130,246,0.5), 0 0 80px rgba(59,130,246,0.2); }
        }
        @keyframes hexFloat {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(3deg) translateY(-10px); }
        }
        @keyframes orbitSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 6px rgba(59,130,246,0.5);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 0 6px rgba(59,130,246,0.5);
          cursor: pointer;
          border: none;
        }
      `}</style>

      {/* ─── 3D Scene (always mounted after first play) ──────── */}
      {gameState !== 'welcome' && (
        <div className="absolute inset-0 z-0">
          <LabScene
            isPaused={isPaused}
            onPause={handlePause}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          WELCOME SCREEN
         ═══════════════════════════════════════════════════════ */}
      {gameState === 'welcome' && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1e1b4b 40%, #0F172A 100%)',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute rounded-full blur-[120px]"
              style={{ width: 500, height: 500, top: '-10%', right: '-5%', background: 'rgba(59,130,246,0.15)', animation: 'orbitSlow 20s linear infinite' }}
            />
            <div
              className="absolute rounded-full blur-[100px]"
              style={{ width: 400, height: 400, bottom: '-5%', left: '-5%', background: 'rgba(34,211,238,0.1)' }}
            />
            <div
              className="absolute rounded-full blur-[80px]"
              style={{ width: 300, height: 300, top: '40%', left: '60%', background: 'rgba(139,92,246,0.08)' }}
            />
            {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hex" x="0" y="0" width="80" height="92" patternUnits="userSpaceOnUse">
                  <path d="M40 0 L80 23 L80 69 L40 92 L0 69 L0 23 Z" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hex)" style={{ animation: 'hexFloat 12s ease-in-out infinite' }} />
            </svg>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
            <div className="mb-6" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
              <img src={Mascot7} alt="Mascot" className="w-[220px] h-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-110 hover:-translate-y-2 transition-all duration-500" />
            </div>

            <h1
              className="text-5xl lg:text-7xl font-extrabold text-white mb-3 tracking-tight"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
            >
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa, #22d3ee, #818cf8)' }}>
                Phòng Thí Nghiệm
              </span>
            </h1>

            <h2 className="text-2xl lg:text-3xl font-bold text-slate-300 mb-6" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
              Không gian 3D tương tác
            </h2>

            <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed" style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
              Khám phá thế giới hóa học trong không gian 3D — tự do di chuyển, quan sát phản ứng và tương tác với các thiết bị thí nghiệm.
            </p>

            {/* Control hints */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-5 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(10px)',
                animation: 'fadeInUp 0.6s ease-out 0.4s both',
              }}
            >
              <KeyHint keyLabel="W" description="Tiến" />
              <KeyHint keyLabel="A" description="Trái" />
              <KeyHint keyLabel="S" description="Lùi" />
              <KeyHint keyLabel="D" description="Phải" />
            </div>

            <div
              className="flex flex-wrap gap-6 justify-center mb-12 text-slate-500 text-xs"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.45s both' }}
            >
              <span><kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 mr-1">Space</kbd> Nhảy</span>
              <span><kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 mr-1">Shift</kbd> Chạy nhanh</span>
              <span><kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 mr-1">Chuột</kbd> Nhìn xung quanh</span>
              <span><kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 mr-1">ESC</kbd> Tạm dừng</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center" style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}>
              <button
                onClick={handleStartExploring}
                className="group px-10 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 hover:scale-[1.03] cursor-pointer flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  boxShadow: '0 0 30px rgba(37,99,235,0.4), 0 4px 15px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 40px rgba(37,99,235,0.6), 0 6px 20px rgba(0,0,0,0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 30px rgba(37,99,235,0.4), 0 4px 15px rgba(0,0,0,0.3)'; }}
              >
                <span className="text-xl group-hover:rotate-12 transition-transform">🔬</span>
                Bắt đầu Khám Phá
              </button>

              <button
                onClick={() => navigate(-1)}
                className="px-8 py-4 rounded-xl font-semibold text-slate-400 hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                ← Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          PAUSE MENU
         ═══════════════════════════════════════════════════════ */}
      {gameState === 'paused' && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{
            background: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-8 rounded-sm bg-white/80" />
                <div className="w-3 h-8 rounded-sm bg-white/80" />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white tracking-tight">TẠM DỪNG</h2>

            <p className="text-slate-400 text-sm text-center mb-2">
              Nhấn <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-xs border border-white/10">ESC</kbd> để tiếp tục
            </p>

            <div className="w-full flex flex-col gap-3">
              <MenuButton icon="▶️" label="Tiếp tục khám phá" onClick={handleResume} variant="primary" />
              <MenuButton icon="⚙️" label="Cài đặt" onClick={handleOpenSettings} subtitle="Điều khiển, môi trường, hiệu năng" />
              <MenuButton icon="🏠" label="Về Trang chủ" onClick={handleGoHome} variant="danger" />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SETTINGS PANEL (Tabbed)
         ═══════════════════════════════════════════════════════ */}
      {gameState === 'settings' && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{
            background: 'rgba(15,23,42,0.9)',
            backdropFilter: 'blur(16px)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] flex flex-col px-6 py-2"
            style={{ animation: 'slideInRight 0.3s ease-out' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToPause}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  ←
                </button>
                <h2 className="text-2xl font-bold text-white">⚙️ Cài đặt</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { resetToDefaults(); setActivePreset('standard'); }}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer px-3 py-1.5 rounded-lg"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  🔄 Đặt lại mặc định
                </button>
                <span className="text-xs text-slate-500">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">ESC</kbd> quay lại
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-5 flex-shrink-0 overflow-x-auto pb-1">
              <TabButton icon="🎮" label="Điều khiển" active={settingsTab === 'controls'} onClick={() => setSettingsTab('controls')} />
              <TabButton icon="🌍" label="Môi trường" active={settingsTab === 'environment'} onClick={() => setSettingsTab('environment')} />
              <TabButton icon="🖥️" label="Hiệu năng" active={settingsTab === 'performance'} onClick={() => setSettingsTab('performance')} />
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto flex-1 space-y-5 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>

              {/* ═══ TAB: Điều khiển ═══ */}
              {settingsTab === 'controls' && (
                <>
                  {/* Di chuyển */}
                  <SettingsSection icon="🏃" title="Di chuyển" description="Điều chỉnh tốc độ và lực nhảy của nhân vật">
                    <SettingsSlider
                      label="Tốc độ di chuyển"
                      value={settings.movementSpeed}
                      min={1} max={15} step={0.5}
                      onChange={(v) => updateSetting('movementSpeed', v)}
                      hint="Tốc độ đi bộ bình thường (mặc định: 5)"
                    />
                    <SettingsSlider
                      label="Hệ số chạy nhanh (Sprint)"
                      value={settings.sprintMultiplier}
                      min={1} max={3} step={0.1}
                      onChange={(v) => updateSetting('sprintMultiplier', v)}
                      hint="Giữ Shift để chạy — nhân với tốc độ di chuyển (mặc định: 1.8x)"
                      unit="x"
                    />
                    <SettingsSlider
                      label="Lực nhảy"
                      value={settings.jumpForce}
                      min={1} max={15} step={0.5}
                      onChange={(v) => updateSetting('jumpForce', v)}
                      hint="Nhấn Space để nhảy — tăng để nhảy cao hơn (mặc định: 5)"
                    />
                  </SettingsSection>

                  {/* Camera / Chuột */}
                  <SettingsSection icon="🖱️" title="Camera & Chuột" description="Điều chỉnh độ nhạy chuột và góc nhìn camera">
                    <SettingsSlider
                      label="Độ nhạy chuột"
                      value={settings.mouseSensitivity}
                      min={0.1} max={3} step={0.05}
                      onChange={(v) => updateSetting('mouseSensitivity', v)}
                      hint="Tăng để quay nhanh hơn, giảm nếu khó điều khiển (mặc định: 1)"
                    />
                    <SettingsSlider
                      label="Tầm nhìn (FOV)"
                      value={settings.fov}
                      min={30} max={120} step={1}
                      onChange={(v) => updateSetting('fov', v)}
                      hint="Góc nhìn camera — 50 chuẩn, tăng để nhìn rộng hơn"
                      unit="°"
                    />
                    <SettingsToggle
                      label="Đảo trục Y"
                      value={settings.invertY}
                      onChange={(v) => updateSetting('invertY', v)}
                      hint="Kéo chuột lên → nhìn xuống (kiểu flight sim)"
                    />
                  </SettingsSection>

                  {/* Phím tắt */}
                  <SettingsSection icon="⌨️" title="Phím điều khiển" description="Các phím mặc định — hiện tại chưa hỗ trợ thay đổi">
                    <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <KeyBindingRow action="Tiến" keys={['W', '↑']} />
                      <KeyBindingRow action="Lùi" keys={['S', '↓']} />
                      <KeyBindingRow action="Sang trái" keys={['A', '←']} />
                      <KeyBindingRow action="Sang phải" keys={['D', '→']} />
                      <KeyBindingRow action="Nhảy" keys={['Space', 'E']} />
                      <KeyBindingRow action="Chạy nhanh" keys={['Shift']} />
                      <KeyBindingRow action="Tạm dừng" keys={['ESC']} />
                    </div>
                  </SettingsSection>
                </>
              )}

              {/* ═══ TAB: Môi trường ═══ */}
              {settingsTab === 'environment' && (
                <>
                  {/* Quick Presets */}
                  <SettingsSection icon="🎨" title="Chế độ nhanh" description="Chọn preset để thay đổi toàn bộ cài đặt môi trường">
                    <div className="flex gap-2">
                      <PresetButton icon="📐" label="Chuẩn" onClick={() => applyPreset('standard')} active={activePreset === 'standard'} />
                      <PresetButton icon="🌤️" label="Sáng" onClick={() => applyPreset('bright')} active={activePreset === 'bright'} />
                      <PresetButton icon="🎥" label="Điện ảnh" onClick={() => applyPreset('cinematic')} active={activePreset === 'cinematic'} />
                      <PresetButton icon="🏞️" label="Thực tế" onClick={() => applyPreset('realistic')} active={activePreset === 'realistic'} />
                    </div>
                  </SettingsSection>

                  {/* Ánh sáng */}
                  <SettingsSection icon="💡" title="Ánh sáng" description="Điều chỉnh nguồn sáng trong phòng thí nghiệm">
                    <SettingsSelect
                      label="Kiểu môi trường"
                      value={settings.envPreset}
                      options={envPresetOptions}
                      onChange={(v) => updateSetting('envPreset', v)}
                      hint="Thay đổi cách ánh sáng phản chiếu trên bề mặt"
                    />
                    <SettingsSlider
                      label="Độ sáng tổng thể"
                      value={settings.ambientIntensity}
                      min={0} max={2} step={0.01}
                      onChange={(v) => updateSetting('ambientIntensity', v)}
                      hint="Tăng để sáng hơn, giảm để tối hơn"
                    />
                    <SettingsSlider
                      label="Độ mờ môi trường"
                      value={settings.envBlur}
                      min={0} max={1} step={0.01}
                      onChange={(v) => updateSetting('envBlur', v)}
                      hint="Tăng để nền mượt hơn, giảm để sắc nét"
                    />
                    <SettingsSlider
                      label="Cường độ đèn chính"
                      value={settings.lightIntensity}
                      min={0} max={10} step={0.1}
                      onChange={(v) => updateSetting('lightIntensity', v)}
                      hint="Điều chỉnh sức mạnh nguồn sáng chính"
                    />
                  </SettingsSection>

                  {/* Bóng đổ */}
                  <SettingsSection icon="🌑" title="Bóng đổ" description="Thêm chiều sâu với hiệu ứng bóng">
                    <SettingsSlider
                      label="Độ đậm bóng"
                      value={settings.shadowOpacity}
                      min={0} max={1} step={0.01}
                      onChange={(v) => updateSetting('shadowOpacity', v)}
                      hint="0 = không bóng, 1 = bóng đậm nhất"
                    />
                    <SettingsSlider
                      label="Độ mềm mại"
                      value={settings.shadowBlur}
                      min={0} max={10} step={0.1}
                      onChange={(v) => updateSetting('shadowBlur', v)}
                      hint="Tăng để bóng mềm mại, tự nhiên hơn"
                    />
                  </SettingsSection>

                  {/* Hậu kỳ */}
                  <SettingsSection icon="✨" title="Hiệu ứng hậu kỳ" description="Hiệu ứng hình ảnh nâng cao">
                    <SettingsToggle
                      label="Bật hiệu ứng"
                      value={settings.enableEffects}
                      onChange={(v) => updateSetting('enableEffects', v)}
                      hint="Tắt nếu máy chạy chậm"
                    />
                    {settings.enableEffects && (
                      <>
                        <SettingsSlider
                          label="Cường độ Bloom"
                          value={settings.bloomIntensity}
                          min={0} max={2} step={0.01}
                          onChange={(v) => updateSetting('bloomIntensity', v)}
                          hint="Hiệu ứng phát sáng — tăng để rực rỡ hơn"
                        />
                        <SettingsSlider
                          label="Ngưỡng Bloom"
                          value={settings.bloomThreshold}
                          min={0} max={1} step={0.01}
                          onChange={(v) => updateSetting('bloomThreshold', v)}
                          hint="Giảm để nhiều vùng sáng hơn bị ảnh hưởng"
                        />
                      </>
                    )}
                  </SettingsSection>
                </>
              )}

              {/* ═══ TAB: Hiệu năng ═══ */}
              {settingsTab === 'performance' && (
                <>
                  <SettingsSection icon="📊" title="Chất lượng đồ họa" description="Tối ưu cho máy yếu hoặc tăng chất lượng cho máy mạnh">
                    <SettingsSlider
                      label="Chất lượng hình ảnh (Pixel Ratio)"
                      value={settings.pixelRatio}
                      min={0.5} max={2} step={0.1}
                      onChange={(v) => updateSetting('pixelRatio', v)}
                      hint="Giảm nếu lag, tăng nếu muốn sắc nét hơn (mặc định: 1.5)"
                      unit="x"
                    />
                    <SettingsToggle
                      label="Khử răng cưa (Antialias)"
                      value={settings.antialias}
                      onChange={(v) => updateSetting('antialias', v)}
                      hint="Làm mượt đường viền — tắt nếu máy yếu"
                    />
                    <SettingsToggle
                      label="Hiệu ứng hậu kỳ"
                      value={settings.enableEffects}
                      onChange={(v) => updateSetting('enableEffects', v)}
                      hint="Bloom, Vignette — tắt để tăng FPS"
                    />
                  </SettingsSection>

                  <SettingsSection icon="💡" title="Mẹo tăng hiệu năng" description="Nếu game chạy chậm, thử các bước sau">
                    <div className="space-y-2 text-sm text-slate-400">
                      <div className="flex gap-2 items-start">
                        <span className="text-blue-400 mt-0.5">1.</span>
                        <p>Giảm <strong className="text-slate-300">Pixel Ratio</strong> xuống 1.0 hoặc thấp hơn</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className="text-blue-400 mt-0.5">2.</span>
                        <p>Tắt <strong className="text-slate-300">Hiệu ứng hậu kỳ</strong> (Bloom, Vignette)</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className="text-blue-400 mt-0.5">3.</span>
                        <p>Tắt <strong className="text-slate-300">Khử răng cưa</strong> (Antialias)</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <span className="text-blue-400 mt-0.5">4.</span>
                        <p>Giảm <strong className="text-slate-300">Bóng đổ</strong> về 0</p>
                      </div>
                    </div>
                  </SettingsSection>
                </>
              )}

              <div className="h-4" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default LabTest;
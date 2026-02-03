import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Zap, Info, ChevronRight } from "lucide-react";

interface ReactionStep {
    time: number;
    description: string;
    highlight?: string;
}

interface ReactionSimulatorProps {
    equation: string;
    reactants: string[];
    products: string[];
    conditions?: string;
    steps: ReactionStep[];
    colorMap?: Record<string, string>;
}

// Atom component for animated reactions
function Atom({
    symbol,
    color,
    x,
    y,
    size = 40,
    glowColor,
    animate = false
}: {
    symbol: string;
    color: string;
    x: number;
    y: number;
    size?: number;
    glowColor?: string;
    animate?: boolean;
}) {
    return (
        <div
            className={`absolute flex items-center justify-center rounded-full font-bold text-white transition-all duration-700 ${animate ? 'animate-pulse' : ''}`}
            style={{
                left: `${x}%`,
                top: `${y}%`,
                width: size,
                height: size,
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                boxShadow: glowColor ? `0 0 20px ${glowColor}` : `0 0 15px ${color}66`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            {symbol}
        </div>
    );
}

// Bond component
function Bond({
    x1, y1, x2, y2,
    color = "rgba(255,255,255,0.4)",
    breaking = false
}: {
    x1: number; y1: number; x2: number; y2: number;
    color?: string;
    breaking?: boolean;
}) {
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    return (
        <div
            className={`absolute h-1 origin-left transition-all duration-500 ${breaking ? 'opacity-0 scale-x-0' : 'opacity-100'}`}
            style={{
                left: `${x1}%`,
                top: `${y1}%`,
                width: `${length}%`,
                background: color,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'left center',
            }}
        />
    );
}

// Water Formation Reaction: 2H₂ + O₂ → 2H₂O
export function WaterFormationReaction() {
    const [step, setStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const steps: ReactionStep[] = [
        { time: 0, description: "Trạng thái ban đầu: 2 phân tử H₂ và 1 phân tử O₂", highlight: "Các phân tử ở trạng thái tự do" },
        { time: 1, description: "Cung cấp năng lượng (đốt cháy/tia lửa điện)", highlight: "Năng lượng hoạt hóa" },
        { time: 2, description: "Liên kết H-H và O=O bắt đầu yếu đi", highlight: "Phá vỡ liên kết cũ" },
        { time: 3, description: "Các nguyên tử tách ra và tái tổ hợp", highlight: "Hình thành liên kết mới" },
        { time: 4, description: "Tạo thành 2 phân tử H₂O", highlight: "Phản ứng tỏa nhiệt" },
    ];

    useEffect(() => {
        if (isPlaying) {
            intervalRef.current = setInterval(() => {
                setStep(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, steps.length]);

    const reset = () => {
        setStep(0);
        setIsPlaying(false);
    };

    // Atom positions based on step
    const getPositions = () => {
        switch (step) {
            case 0: // Initial state
                return {
                    h1: { x: 15, y: 35 }, h2: { x: 25, y: 35 },
                    h3: { x: 15, y: 65 }, h4: { x: 25, y: 65 },
                    o1: { x: 70, y: 45 }, o2: { x: 80, y: 55 },
                };
            case 1: // Energy applied
                return {
                    h1: { x: 18, y: 35 }, h2: { x: 28, y: 38 },
                    h3: { x: 18, y: 62 }, h4: { x: 28, y: 65 },
                    o1: { x: 68, y: 42 }, o2: { x: 78, y: 58 },
                };
            case 2: // Bonds breaking
                return {
                    h1: { x: 25, y: 30 }, h2: { x: 35, y: 40 },
                    h3: { x: 25, y: 60 }, h4: { x: 35, y: 70 },
                    o1: { x: 60, y: 40 }, o2: { x: 60, y: 60 },
                };
            case 3: // Recombining
                return {
                    h1: { x: 40, y: 35 }, h2: { x: 55, y: 30 },
                    h3: { x: 40, y: 65 }, h4: { x: 55, y: 70 },
                    o1: { x: 50, y: 35 }, o2: { x: 50, y: 65 },
                };
            case 4: // Final - H2O molecules
                return {
                    h1: { x: 30, y: 32 }, h2: { x: 30, y: 48 },
                    h3: { x: 70, y: 52 }, h4: { x: 70, y: 68 },
                    o1: { x: 40, y: 40 }, o2: { x: 60, y: 60 },
                };
            default:
                return {
                    h1: { x: 15, y: 35 }, h2: { x: 25, y: 35 },
                    h3: { x: 15, y: 65 }, h4: { x: 25, y: 65 },
                    o1: { x: 70, y: 45 }, o2: { x: 80, y: 55 },
                };
        }
    };

    const pos = getPositions();

    return (
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50">
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold">Phản ứng tạo nước</h4>
                        <p className="text-slate-400 text-sm">2H₂ + O₂ → 2H₂O</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={reset}
                        className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 transition-colors"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Animation area */}
            <div className="relative h-64 bg-gradient-to-b from-slate-900 to-slate-800">
                {/* Energy effect for step 1-2 */}
                {(step === 1 || step === 2) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/20 to-orange-500/10 animate-pulse" />
                )}

                {/* Sparks for step 1 */}
                {step === 1 && (
                    <>
                        <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping delay-100" />
                        <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-200" />
                    </>
                )}

                {/* Bonds - only show in certain steps */}
                {step < 3 && (
                    <>
                        <Bond x1={pos.h1.x} y1={pos.h1.y} x2={pos.h2.x} y2={pos.h2.y} breaking={step >= 2} />
                        <Bond x1={pos.h3.x} y1={pos.h3.y} x2={pos.h4.x} y2={pos.h4.y} breaking={step >= 2} />
                        <Bond x1={pos.o1.x} y1={pos.o1.y} x2={pos.o2.x} y2={pos.o2.y} color="rgba(239,68,68,0.5)" breaking={step >= 2} />
                    </>
                )}

                {/* New bonds - H2O molecules */}
                {step >= 4 && (
                    <>
                        <Bond x1={pos.h1.x} y1={pos.h1.y} x2={pos.o1.x} y2={pos.o1.y} />
                        <Bond x1={pos.h2.x} y1={pos.h2.y} x2={pos.o1.x} y2={pos.o1.y} />
                        <Bond x1={pos.h3.x} y1={pos.h3.y} x2={pos.o2.x} y2={pos.o2.y} />
                        <Bond x1={pos.h4.x} y1={pos.h4.y} x2={pos.o2.x} y2={pos.o2.y} />
                    </>
                )}

                {/* Atoms */}
                <Atom symbol="H" color="#3b82f6" x={pos.h1.x} y={pos.h1.y} size={36} animate={step === 1} />
                <Atom symbol="H" color="#3b82f6" x={pos.h2.x} y={pos.h2.y} size={36} animate={step === 1} />
                <Atom symbol="H" color="#3b82f6" x={pos.h3.x} y={pos.h3.y} size={36} animate={step === 1} />
                <Atom symbol="H" color="#3b82f6" x={pos.h4.x} y={pos.h4.y} size={36} animate={step === 1} />
                <Atom symbol="O" color="#ef4444" x={pos.o1.x} y={pos.o1.y} size={44} glowColor="rgba(239,68,68,0.5)" animate={step === 1} />
                <Atom symbol="O" color="#ef4444" x={pos.o2.x} y={pos.o2.y} size={44} glowColor="rgba(239,68,68,0.5)" animate={step === 1} />

                {/* Labels */}
                {step === 0 && (
                    <>
                        <div className="absolute left-[15%] top-[18%] text-blue-300 text-xs font-medium">H₂</div>
                        <div className="absolute left-[15%] top-[78%] text-blue-300 text-xs font-medium">H₂</div>
                        <div className="absolute right-[18%] top-[35%] text-red-300 text-xs font-medium">O₂</div>
                    </>
                )}
                {step === 4 && (
                    <>
                        <div className="absolute left-[28%] top-[18%] text-cyan-300 text-xs font-medium">H₂O</div>
                        <div className="absolute right-[28%] top-[78%] text-cyan-300 text-xs font-medium">H₂O</div>
                    </>
                )}
            </div>

            {/* Step indicator and description */}
            <div className="p-4 border-t border-slate-700/50">
                {/* Progress bar */}
                <div className="flex gap-1 mb-3">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1.5 rounded-full transition-colors ${i <= step ? 'bg-blue-500' : 'bg-slate-700'
                                }`}
                        />
                    ))}
                </div>

                {/* Description */}
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                        <Info className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">{steps[step].description}</p>
                        {steps[step].highlight && (
                            <p className="text-blue-300 text-xs mt-1 flex items-center gap-1">
                                <ChevronRight className="w-3 h-3" />
                                {steps[step].highlight}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reaction info */}
            <div className="px-4 pb-4">
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <p className="text-orange-200 text-xs">
                        <strong>Điều kiện:</strong> Đốt cháy hoặc tia lửa điện •
                        <strong> Đặc điểm:</strong> Phản ứng tỏa nhiệt mạnh
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ReactionSimulator({ equation, reactants, products, conditions, steps: _steps, colorMap: _colorMap }: ReactionSimulatorProps) {
    // Note: _steps and _colorMap are available for future use in more complex simulations
    return (
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-4">
            <h4 className="text-white font-bold mb-2">{equation}</h4>
            <p className="text-slate-400 text-sm">
                {reactants.join(" + ")} → {products.join(" + ")}
            </p>
            {conditions && <p className="text-orange-300 text-xs mt-2">Điều kiện: {conditions}</p>}
        </div>
    );
}

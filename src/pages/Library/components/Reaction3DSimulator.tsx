import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useRef, useState, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

// ============= CPK COLORS =============
const ATOM_COLORS: Record<string, string> = {
    H: "#FFFFFF",
    O: "#FF0D0D",
    N: "#3050F8",
    C: "#909090",
    Cl: "#1FF01F",
    Na: "#AB5CF2",
    S: "#FFFF30",
};

// Ball radius - SMALL for ball-stick model
const BALL_RADIUS: Record<string, number> = {
    H: 0.25,
    O: 0.35,
    N: 0.35,
    C: 0.35,
    Cl: 0.4,
    Na: 0.4,
    S: 0.38,
};

// ============= ATOM COMPONENT =============
interface AtomProps {
    symbol: string;
    position: [number, number, number];
    label?: boolean;
}

function Atom({ symbol, position, label = true }: AtomProps) {
    const color = ATOM_COLORS[symbol] || "#888888";
    const radius = BALL_RADIUS[symbol] || 0.3;

    return (
        <group position={position}>
            <mesh>
                <sphereGeometry args={[radius, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.1}
                />
            </mesh>
            {label && (
                <Text
                    position={[0, radius + 0.2, 0]}
                    fontSize={0.22}
                    color="white"
                    anchorX="center"
                    anchorY="bottom"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {symbol}
                </Text>
            )}
        </group>
    );
}

// ============= BOND COMPONENT =============
interface BondProps {
    start: [number, number, number];
    end: [number, number, number];
    order: 1 | 2 | 3;
    opacity?: number;
}

function Bond({ start, end, order, opacity = 1 }: BondProps) {
    const bondData = useMemo(() => {
        const s = new THREE.Vector3(...start);
        const e = new THREE.Vector3(...end);
        const mid = s.clone().add(e).multiplyScalar(0.5);
        const len = s.distanceTo(e);
        const dir = e.clone().sub(s).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0), dir
        );
        return { mid, len, quat };
    }, [start, end]);

    if (opacity < 0.05 || bondData.len < 0.1) return null;

    const stickRadius = 0.06;
    const gap = 0.18;

    const renderStick = (offsetX: number) => (
        <mesh position={[offsetX, 0, 0]}>
            <cylinderGeometry args={[stickRadius, stickRadius, bondData.len, 12]} />
            <meshStandardMaterial
                color="#444444"
                roughness={0.5}
                transparent={opacity < 1}
                opacity={opacity}
            />
        </mesh>
    );

    return (
        <group position={bondData.mid} quaternion={bondData.quat}>
            {order === 1 && renderStick(0)}
            {order === 2 && (
                <>
                    {renderStick(-gap / 2)}
                    {renderStick(gap / 2)}
                </>
            )}
            {order === 3 && (
                <>
                    {renderStick(-gap)}
                    {renderStick(0)}
                    {renderStick(gap)}
                </>
            )}
        </group>
    );
}

// ============= REACTION DATA =============
interface AtomDef {
    id: string;
    symbol: string;
    pos: [number, number, number][]; // position at each step
}

interface BondDef {
    a1: string;
    a2: string;
    order: 1 | 2 | 3;
    steps: number[]; // steps where this bond is active
}

interface Reaction {
    name: string;
    equation: string;
    labels: string[];
    atoms: AtomDef[];
    bonds: BondDef[];
}

// ============= REACTIONS - MUCH LARGER SPACING =============
const REACTIONS: Record<string, Reaction> = {
    water: {
        name: "Tổng hợp nước",
        equation: "2H₂ + O₂ → 2H₂O",
        labels: ["Chất đầu", "Phá liên kết", "Di chuyển", "Tạo liên kết", "Sản phẩm"],
        atoms: [
            // H2 molecule 1 (top-left) - BONDED, gap ~1.0
            { id: "h1", symbol: "H", pos: [[-3, 1.5, 0], [-2.5, 1.2, 0], [-1.5, 0.8, 0], [-2.2, 0.7, 0], [-2.4, 0.7, 0]] },
            { id: "h2", symbol: "H", pos: [[-2, 1.5, 0], [-1.7, 1.2, 0], [-1, 0.5, 0], [-1.4, 0, 0], [-1.8, -0.7, 0]] },
            // H2 molecule 2 (bottom-left)
            { id: "h3", symbol: "H", pos: [[-3, -1.5, 0], [-2.5, -1.2, 0], [-1.5, -0.8, 0], [2.2, 0.7, 0], [2.4, 0.7, 0]] },
            { id: "h4", symbol: "H", pos: [[-2, -1.5, 0], [-1.7, -1.2, 0], [-1, -0.5, 0], [1.4, 0, 0], [1.8, -0.7, 0]] },
            // O2 molecule (right) - DOUBLE BONDED
            { id: "o1", symbol: "O", pos: [[2.5, 0.6, 0], [2, 0.5, 0], [0, 0.4, 0], [-1.8, 0, 0], [-2.1, 0, 0]] },
            { id: "o2", symbol: "O", pos: [[2.5, -0.6, 0], [2, -0.5, 0], [0, -0.4, 0], [1.8, 0, 0], [2.1, 0, 0]] },
        ],
        bonds: [
            { a1: "h1", a2: "h2", order: 1, steps: [0, 1] },
            { a1: "h3", a2: "h4", order: 1, steps: [0, 1] },
            { a1: "o1", a2: "o2", order: 2, steps: [0, 1] },
            { a1: "h1", a2: "o1", order: 1, steps: [3, 4] },
            { a1: "h2", a2: "o1", order: 1, steps: [3, 4] },
            { a1: "h3", a2: "o2", order: 1, steps: [3, 4] },
            { a1: "h4", a2: "o2", order: 1, steps: [3, 4] },
        ],
    },
    nacl: {
        name: "Tạo muối NaCl",
        equation: "2Na + Cl₂ → 2NaCl",
        labels: ["Chất đầu", "Tiến lại gần", "Chuyển electron", "Tạo ion", "Sản phẩm"],
        atoms: [
            // Na atoms - SEPARATE initially
            { id: "na1", symbol: "Na", pos: [[-2.5, 1, 0], [-2, 0.8, 0], [-1.2, 0.5, 0], [-2.2, 0, 0], [-2.2, 0, 0]] },
            { id: "na2", symbol: "Na", pos: [[-2.5, -1, 0], [-2, -0.8, 0], [-1.2, -0.5, 0], [2.2, 0, 0], [2.2, 0, 0]] },
            // Cl2 molecule - BONDED at start
            { id: "cl1", symbol: "Cl", pos: [[2.5, 0.6, 0], [2, 0.5, 0], [0.8, 0.3, 0], [-1.2, 0, 0], [-1.2, 0, 0]] },
            { id: "cl2", symbol: "Cl", pos: [[2.5, -0.6, 0], [2, -0.5, 0], [0.8, -0.3, 0], [1.2, 0, 0], [1.2, 0, 0]] },
        ],
        bonds: [
            { a1: "cl1", a2: "cl2", order: 1, steps: [0, 1, 2] },
            { a1: "na1", a2: "cl1", order: 1, steps: [3, 4] },
            { a1: "na2", a2: "cl2", order: 1, steps: [3, 4] },
        ],
    },
    combustion: {
        name: "Đốt cháy Methane",
        equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
        labels: ["Chất đầu", "Phá liên kết", "Tái tổ hợp", "Sản phẩm"],
        atoms: [
            // CH4 - C bonded to 4 H
            { id: "c", symbol: "C", pos: [[-2, 0, 0], [-1, 0, 0], [0, 1.5, 0], [0, 1.5, 0]] },
            { id: "h1", symbol: "H", pos: [[-3, 0.7, 0], [-1.8, 0.6, 0], [-1.5, -0.8, 0], [-1.4, -0.8, 0]] },
            { id: "h2", symbol: "H", pos: [[-3, -0.7, 0], [-1.8, -0.5, 0], [-0.7, -0.8, 0], [-0.6, -0.8, 0]] },
            { id: "h3", symbol: "H", pos: [[-1, 0.7, 0], [-0.2, 0.5, 0], [1.5, -0.8, 0], [1.4, -0.8, 0]] },
            { id: "h4", symbol: "H", pos: [[-1, -0.7, 0], [-0.2, -0.5, 0], [0.7, -0.8, 0], [0.6, -0.8, 0]] },
            // O2 #1
            { id: "o1", symbol: "O", pos: [[1.5, 0.6, 0], [0.8, 0.5, 0], [-0.6, 1.8, 0], [-0.6, 1.8, 0]] },
            { id: "o2", symbol: "O", pos: [[1.5, -0.6, 0], [0.8, -0.5, 0], [0.6, 1.8, 0], [0.6, 1.8, 0]] },
            // O2 #2
            { id: "o3", symbol: "O", pos: [[3, 0.6, 0], [2.3, 0.4, 0], [-1.2, 0, 0], [-1.1, 0, 0]] },
            { id: "o4", symbol: "O", pos: [[3, -0.6, 0], [2.3, -0.4, 0], [1.2, 0, 0], [1.1, 0, 0]] },
        ],
        bonds: [
            { a1: "c", a2: "h1", order: 1, steps: [0] },
            { a1: "c", a2: "h2", order: 1, steps: [0] },
            { a1: "c", a2: "h3", order: 1, steps: [0] },
            { a1: "c", a2: "h4", order: 1, steps: [0] },
            { a1: "o1", a2: "o2", order: 2, steps: [0] },
            { a1: "o3", a2: "o4", order: 2, steps: [0] },
            { a1: "c", a2: "o1", order: 2, steps: [2, 3] },
            { a1: "c", a2: "o2", order: 2, steps: [2, 3] },
            { a1: "h1", a2: "o3", order: 1, steps: [2, 3] },
            { a1: "h2", a2: "o3", order: 1, steps: [2, 3] },
            { a1: "h3", a2: "o4", order: 1, steps: [2, 3] },
            { a1: "h4", a2: "o4", order: 1, steps: [2, 3] },
        ],
    },
};

// ============= SCENE =============
function Scene({ reaction, step, t }: { reaction: Reaction; step: number; t: number }) {
    const nextStep = Math.min(step + 1, reaction.labels.length - 1);

    // Smooth easing
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const getPos = (atom: AtomDef): [number, number, number] => {
        const p0 = atom.pos[step] || atom.pos[atom.pos.length - 1];
        const p1 = atom.pos[nextStep] || p0;
        return [
            p0[0] + (p1[0] - p0[0]) * ease,
            p0[1] + (p1[1] - p0[1]) * ease,
            p0[2] + (p1[2] - p0[2]) * ease,
        ];
    };

    return (
        <group>
            {/* Bonds - behind atoms */}
            {reaction.bonds.map((bond, i) => {
                const activeNow = bond.steps.includes(step);
                const activeNext = bond.steps.includes(nextStep);

                let opacity = 0;
                if (activeNow && activeNext) opacity = 1;
                else if (activeNow && !activeNext) opacity = 1 - ease;
                else if (!activeNow && activeNext) opacity = ease;

                if (opacity < 0.05) return null;

                const a1 = reaction.atoms.find(a => a.id === bond.a1);
                const a2 = reaction.atoms.find(a => a.id === bond.a2);
                if (!a1 || !a2) return null;

                return (
                    <Bond
                        key={`bond-${i}`}
                        start={getPos(a1)}
                        end={getPos(a2)}
                        order={bond.order}
                        opacity={opacity}
                    />
                );
            })}

            {/* Atoms - on top */}
            {reaction.atoms.map(atom => (
                <Atom key={atom.id} symbol={atom.symbol} position={getPos(atom)} />
            ))}
        </group>
    );
}

// ============= MAIN COMPONENT =============
interface Props {
    reactionType?: keyof typeof REACTIONS;
}

export default function Reaction3DSimulator({ reactionType = "water" }: Props) {
    const [step, setStep] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [t, setT] = useState(0);
    const lastTime = useRef(0);

    const reaction = REACTIONS[reactionType] || REACTIONS.water;
    const total = reaction.labels.length;

    useEffect(() => {
        if (!playing) return;

        let id: number;
        const animate = () => {
            const now = performance.now();
            const dt = lastTime.current ? now - lastTime.current : 16;
            lastTime.current = now;

            setT(prev => {
                const next = prev + dt / 2000; // 2 sec per step
                if (next >= 1) {
                    setStep(s => {
                        if (s >= total - 1) {
                            setPlaying(false);
                            return s;
                        }
                        return s + 1;
                    });
                    return 0;
                }
                return next;
            });

            id = requestAnimationFrame(animate);
        };

        id = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(id);
            lastTime.current = 0;
        };
    }, [playing, total]);

    const reset = () => { setStep(0); setT(0); setPlaying(false); lastTime.current = 0; };
    const skip = () => { if (step < total - 1) { setStep(s => s + 1); setT(0); } };

    return (
        <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
            {/* Header */}
            <div className="p-3 border-b border-slate-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-white font-semibold text-sm">{reaction.name}</h4>
                        <p className="text-cyan-400 text-xs font-mono">{reaction.equation}</p>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => { setPlaying(!playing); lastTime.current = 0; }}
                            className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-300">
                            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button onClick={skip} className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300">
                            <SkipForward className="w-4 h-4" />
                        </button>
                        <button onClick={reset} className="p-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="h-72">
                <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                    <color attach="background" args={["#0f172a"]} />
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <pointLight position={[-5, -5, -5]} intensity={0.4} color="#60a5fa" />

                    <Scene reaction={reaction} step={step} t={t} />

                    <OrbitControls enableZoom enablePan={false} autoRotate={false} minDistance={4} maxDistance={15} />
                </Canvas>
            </div>

            {/* Progress */}
            <div className="p-3 border-t border-slate-700">
                <div className="flex gap-1 mb-2">
                    {reaction.labels.map((_, i) => (
                        <div key={i} className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                style={{ width: i < step ? '100%' : i === step ? `${t * 100}%` : '0%' }}
                            />
                        </div>
                    ))}
                </div>
                <p className="text-white text-xs">Bước {step + 1}/{total}: {reaction.labels[step]}</p>
                <p className="text-slate-500 text-[10px] mt-1">Kéo để xoay • Cuộn để zoom</p>
            </div>
        </div>
    );
}

export { REACTIONS };

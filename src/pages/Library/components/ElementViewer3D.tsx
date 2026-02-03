import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Complete mapping for all 118 elements
const ELEMENT_NAMES: Record<number, string> = {
    1: 'hydrogen', 2: 'helium', 3: 'lithium', 4: 'beryllium', 5: 'boron',
    6: 'carbon', 7: 'nitrogen', 8: 'oxygen', 9: 'fluorine', 10: 'neon',
    11: 'sodium', 12: 'magnesium', 13: 'aluminum', 14: 'silicon', 15: 'phosphorus',
    16: 'sulfur', 17: 'chlorine', 18: 'argon', 19: 'potassium', 20: 'calcium',
    21: 'scandium', 22: 'titanium', 23: 'vanadium', 24: 'chromium', 25: 'manganese',
    26: 'iron', 27: 'cobalt', 28: 'nickel', 29: 'copper', 30: 'zinc',
    31: 'gallium', 32: 'germanium', 33: 'arsenic', 34: 'selenium', 35: 'bromine',
    36: 'krypton', 37: 'rubidium', 38: 'strontium', 39: 'yttrium', 40: 'zirconium',
    41: 'niobium', 42: 'molybdenum', 43: 'technetium', 44: 'ruthenium', 45: 'rhodium',
    46: 'palladium', 47: 'silver', 48: 'cadmium', 49: 'indium', 50: 'tin',
    51: 'antimony', 52: 'tellurium', 53: 'iodine', 54: 'xenon', 55: 'cesium',
    56: 'barium', 57: 'lanthanum', 58: 'cerium', 59: 'praseodymium', 60: 'neodymium',
    61: 'promethium', 62: 'samarium', 63: 'europium', 64: 'gadolinium', 65: 'terbium',
    66: 'dysprosium', 67: 'holmium', 68: 'erbium', 69: 'thulium', 70: 'ytterbium',
    71: 'lutetium', 72: 'hafnium', 73: 'tantalum', 74: 'tungsten', 75: 'rhenium',
    76: 'osmium', 77: 'iridium', 78: 'platinum', 79: 'gold', 80: 'mercury',
    81: 'thallium', 82: 'lead', 83: 'bismuth', 84: 'polonium', 85: 'astatine',
    86: 'radon', 87: 'francium', 88: 'radium', 89: 'actinium', 90: 'thorium',
    91: 'protactinium', 92: 'uranium', 93: 'neptunium', 94: 'plutonium', 95: 'americium',
    96: 'curium', 97: 'berkelium', 98: 'californium', 99: 'einsteinium', 100: 'fermium',
    101: 'mendelevium', 102: 'nobelium', 103: 'lawrencium', 104: 'rutherfordium', 105: 'dubnium',
    106: 'seaborgium', 107: 'bohrium', 108: 'hassium', 109: 'meitnerium', 110: 'darmstadtium',
    111: 'roentgenium', 112: 'copernicium', 113: 'nihonium', 114: 'flerovium', 115: 'moscovium',
    116: 'livermorium', 117: 'tennessine', 118: 'oganesson',
};

// Get model path
const getModelPath = (elementNumber: number): string | null => {
    const name = ELEMENT_NAMES[elementNumber];
    if (!name) return null;
    const paddedNumber = String(elementNumber).padStart(3, '0');
    return `/models/elements/element_${paddedNumber}_${name}.glb`;
};

interface ElementModelProps {
    elementNumber: number;
    elementName: string;
    elementSymbol: string;
}

// 3D Model component - with auto rotation, much larger scale
function ElementModel({ modelPath }: { modelPath: string }) {
    const { scene } = useGLTF(modelPath);
    const ref = useRef<THREE.Group>(null);

    // Auto-rotate the model
    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.008;
        }
    });

    return <primitive ref={ref} object={scene} scale={5} />;
}

// Loading fallback sphere
function LoadingFallback() {
    return (
        <mesh>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color="#3b82f6" wireframe />
        </mesh>
    );
}

// Error fallback component
function ErrorFallback() {
    return (
        <div className="h-full flex items-center justify-center bg-slate-800/50 rounded-xl">
            <p className="text-slate-400 text-xs text-center px-2">Model không khả dụng</p>
        </div>
    );
}

// Compact 3D viewer for sidebar - NO auto rotation
export default function ElementViewer3D({ elementNumber, elementName, elementSymbol }: ElementModelProps) {
    const modelPath = getModelPath(elementNumber);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!modelPath) {
            setTimeout(() => setHasError(true), 0);
            return;
        }

        fetch(modelPath, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    setHasError(true);
                }
            })
            .catch(() => {
                setHasError(true);
            });
    }, [modelPath]);

    if (!modelPath || hasError) {
        return <ErrorFallback />;
    }

    return (
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-2 bg-gradient-to-b from-slate-900/90 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-xs font-bold text-blue-300">
                            {elementSymbol}
                        </div>
                        <span className="text-white text-xs font-medium">{elementName}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Z={elementNumber}</span>
                </div>
            </div>

            {/* 3D Canvas - larger, camera closer */}
            <div className="h-52 w-full">
                <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <pointLight position={[-5, -5, -5]} intensity={0.4} color="#60a5fa" />

                    <Suspense fallback={<LoadingFallback />}>
                        <ElementModel modelPath={modelPath} />
                        <Environment preset="city" />
                        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={8} blur={2} />
                    </Suspense>

                    {/* OrbitControls - only rotate on drag */}
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        autoRotate={false}
                        minDistance={1.5}
                        maxDistance={6}
                    />
                </Canvas>
            </div>

            {/* Footer */}
            <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-blue-500/20 backdrop-blur rounded-full">
                <span className="text-blue-200 text-[10px]">Kéo để xoay</span>
            </div>
        </div>
    );
}

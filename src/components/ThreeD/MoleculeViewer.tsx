import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Stage, OrbitControls } from '@react-three/drei';

interface ModelProps {
    path: string;
}

const Model = ({ path }: ModelProps) => {
    const { scene } = useGLTF(path);
    const ref = useRef<any>(null);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.005; // Slow rotation
        }
    });

    return <primitive ref={ref} object={scene} />;
};

interface MoleculeViewerProps {
    modelPath: string;
    autoRotate?: boolean;
}

const MoleculeViewer = ({ modelPath }: MoleculeViewerProps) => {
    return (
        <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden relative">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6}>
                        <Model path={modelPath} />
                    </Stage>
                </Suspense>
                <OrbitControls
                    autoRotate
                    autoRotateSpeed={0.5}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 2.2}
                    enableZoom={true}
                    enablePan={false}
                />
            </Canvas>
        </div>
    );
};

export default MoleculeViewer;

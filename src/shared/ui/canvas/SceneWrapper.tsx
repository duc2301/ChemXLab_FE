import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useLabSettings } from '../../../features/lab-environment/services/labSettingsStore';

interface SceneWrapperProps {
  children: ReactNode;
  className?: string;
  hideOverlay?: boolean;
}

export const SceneWrapper = ({ children, className, hideOverlay = false }: SceneWrapperProps) => {
  const navigate = useNavigate();
  const [pointerLocked, setPointerLocked] = useState(false);
  const fov = useLabSettings((s) => s.fov);

  useEffect(() => {
    const onChange = () => {
      const el = document.pointerLockElement;
      setPointerLocked(!!el);
    };
    const onError = () => {
      console.warn('PointerLockControls: pointer lock error or was interrupted');
      setPointerLocked(false);
    };

    document.addEventListener('pointerlockchange', onChange);
    document.addEventListener('pointerlockerror', onError);
    return () => {
      document.removeEventListener('pointerlockchange', onChange);
      document.removeEventListener('pointerlockerror', onError);
    };
  }, []);

  const requestLock = () => {
    const canvas = document.getElementById('r3f-canvas') as HTMLElement | null;
    try {
      canvas?.requestPointerLock();
    } catch (err) {
      console.warn('RequestPointerLock failed', err);
    }
  };
  return (
    <div className={`relative h-screen w-full bg-slate-900 ${className}`}>
      <Canvas id="r3f-canvas"
        shadows
        camera={{ position: [5, 5, 5], fov: fov }}
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          antialias: true
        }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>

      {/* Click overlay to request pointer lock (only visible when not locked and not hidden by parent) */}
      {!hideOverlay && !pointerLocked && (
        <div>
          <div >
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 px-3 py-2 bg-blue-600 text-white rounded shadow pointer-events-auto z-30 hover:bg-blue-700 flex items-center gap-2"
            >
              ← Quay lại
            </button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <button
              onClick={requestLock}
              className="px-4 py-2 bg-white text-black rounded shadow pointer-events-auto font-medium hover:bg-gray-50 transition-colors"
            >
              Nhấn để bật chế độ nhìn tự do
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
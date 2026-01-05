import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState, type ReactNode } from 'react';

interface SceneWrapperProps {
  children: ReactNode;
  className?: string;
}

export const SceneWrapper = ({ children, className }: SceneWrapperProps) => {
  const [pointerLocked, setPointerLocked] = useState(false);

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
      {/* Canvas là cửa sổ nhìn vào thế giới 3D */}
      <Canvas id="r3f-canvas"
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }} // Góc nhìn camera mặc định
        dpr={[1, 2]} // Tối ưu pixel ratio cho màn hình retina
        gl={{ preserveDrawingBuffer: true }} // Hỗ trợ chụp màn hình nếu cần
      >
        {/* Suspense để chờ load các tài nguyên 3D nặng */}
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>

      {/* Click overlay to request pointer lock (only visible when not locked) */}
      {!pointerLocked && (
        <div>
          <div >
            <button
              onClick={() => window.location.href = '/'}
              className="absolute top-4 left-4 px-3 py-2 bg-red-600 text-white rounded shadow pointer-events-auto z-30 hover:bg-red-700"
            >
              Exit
            </button>
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <button
              onClick={requestLock}
              className="px-4 py-2 bg-white text-black rounded shadow pointer-events-auto"
            >
              Click to enable free-look
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
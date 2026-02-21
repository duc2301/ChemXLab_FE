// scenes/LabScene.tsx
import { KeyboardControls, PointerLockControls, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { Leva } from 'leva';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Mesh, Object3D } from 'three';
import { controlMap } from '../../../features/camera-controller/models/controls';
import { UserCamera } from '../../../features/camera-controller/ui/Camera';
import { useLabSettings } from '../../../features/lab-environment/services/labSettingsStore';
import { LabEnvironment } from '../../../features/lab-environment/ui/LabEnvironment';
import { InteractionPrompt } from '../../../features/lab-experiment/components/InteractionPrompt';
import { ProximityDetector } from '../../../features/lab-experiment/components/ProximityDetector';
import { useExperimentStore } from '../../../features/lab-experiment/services/experimentStore';
import { ExperimentPopup } from '../../../features/lab-experiment/ui/ExperimentPopup';
import { SceneWrapper } from '../../../shared/ui/canvas/SceneWrapper';

const TABLE_POSITION: [number, number, number] = [-2, 0, 2];
const DETECTION_RADIUS = 3;

// ─── Visual-only GLB model (no physics) ─────────────────────────────────
function VisualModel({ path, ...props }: { path: string } & JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF(path);
  const clone = useMemo(() => {
    const c = scene.clone();
    c.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        (child as Mesh).castShadow = true;
        (child as Mesh).receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return <primitive object={clone} {...props} />;
}

// ─── Sync FOV at runtime ────────────────────────────────────────────────
function FovSync() {
  const { camera } = useThree();
  const fov = useLabSettings((s) => s.fov);

  useEffect(() => {
    if ('fov' in camera && (camera as any).fov !== fov) {
      (camera as any).fov = fov;
      (camera as any).updateProjectionMatrix();
    }
  }, [camera, fov]);

  return null;
}

// ─── Sync mouse sensitivity ─────────────────────────────────────────────
function SensitivitySync({ controlsRef }: { controlsRef: React.RefObject<any> }) {
  const sensitivity = useLabSettings((s) => s.mouseSensitivity);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.pointerSpeed = sensitivity;
    }
  });

  return null;
}

interface LabSceneContentProps {
  onEnterProximity: () => void;
  onExitProximity: () => void;
  onInteract: () => void;
  isModalOpen: boolean;
  isPaused: boolean;
}

function LabSceneContent({
  onEnterProximity,
  onExitProximity,
  onInteract,
  isModalOpen,
  isPaused,
}: LabSceneContentProps) {
  const controlsRef = useRef<any>(null);

  // Handle lock/unlock without remounting — prevents camera jitter
  useEffect(() => {
    if (!controlsRef.current) return;

    if (isPaused || isModalOpen) {
      controlsRef.current.unlock();
    } else {
      const timer = setTimeout(() => {
        controlsRef.current?.lock();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isPaused, isModalOpen]);

  return (
    <>
      <PointerLockControls ref={controlsRef} selector="#r3f-canvas" />

      {/* Sync FOV and mouse sensitivity at runtime */}
      <FovSync />
      <SensitivitySync controlsRef={controlsRef} />

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.8, 0]}>

          {/* Môi trường & Ánh sáng */}
          <LabEnvironment enableControls={false} levaHidden={true} />

          {/* Player camera — always mounted, freezes when paused */}
          <UserCamera frozen={isPaused || isModalOpen} />

          {/* Proximity detector cho bàn thí nghiệm chính */}
          <ProximityDetector
            tablePosition={TABLE_POSITION}
            detectionRadius={DETECTION_RADIUS}
            onEnterProximity={onEnterProximity}
            onExitProximity={onExitProximity}
            onInteract={onInteract}
          />

          {/* ═══ Sàn nhà ═══ */}
          <RigidBody type="fixed" position={[0, -0.05, 0]} colliders={false}>
            <CuboidCollider args={[50, 0.05, 50]} />
          </RigidBody>

          {/* ═══ Phòng thí nghiệm (visual only + manual wall colliders) ═══ */}
          <VisualModel path="/models/phongthinghiem.glb" />

          {/* Tường — manual box colliders cho phòng ~12x12 */}
          <RigidBody type="fixed" colliders={false}>
            {/* Tường trước (Z+) */}
            <CuboidCollider args={[6.5, 2, 0.15]} position={[0, 2, 6.5]} />
            {/* Tường sau (Z-) */}
            <CuboidCollider args={[6.5, 2, 0.15]} position={[0, 2, -6.5]} />
            {/* Tường trái (X-) */}
            <CuboidCollider args={[0.15, 2, 6.5]} position={[-6.5, 2, 0]} />
            {/* Tường phải (X+) */}
            <CuboidCollider args={[0.15, 2, 6.5]} position={[6.5, 2, 0]} />
          </RigidBody>

          {/* ═══ Bàn thí nghiệm chính (visual + collider) ═══ */}
          <RigidBody type="fixed" position={TABLE_POSITION} colliders={false}>
            <VisualModel path="/models/table.glb" />
            {/* Mặt bàn collider */}
            <CuboidCollider args={[0.7, 0.02, 0.4]} position={[0, 0.85, 0]} />
            {/* Chân bàn collider */}
            <CuboidCollider args={[0.5, 0.42, 0.3]} position={[0, 0.42, 0]} />
          </RigidBody>

        </Physics>
      </Suspense>
    </>
  );
}

export interface LabSceneProps {
  isPaused?: boolean;
  onPause?: () => void;
}

export const LabScene = ({ isPaused = false, onPause }: LabSceneProps) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { openModal, isModalOpen } = useExperimentStore();

  const handleEnterProximity = () => setShowPrompt(true);
  const handleExitProximity = () => setShowPrompt(false);
  const handleInteract = () => openModal();

  // ESC → pause (only when playing)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && onPause && !isModalOpen) {
      e.preventDefault();
      e.stopPropagation();
      document.exitPointerLock();
      onPause();
    }
  }, [onPause, isModalOpen]);

  useEffect(() => {
    if (!isPaused) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isPaused, handleKeyDown]);

  useEffect(() => {
    if (isModalOpen || isPaused) {
      document.exitPointerLock();
      document.body.style.cursor = 'auto';
    }
  }, [isModalOpen, isPaused]);

  return (
    <>
      <Leva hidden />

      <KeyboardControls map={controlMap}>
        <SceneWrapper hideOverlay={true}>
          <LabSceneContent
            onEnterProximity={handleEnterProximity}
            onExitProximity={handleExitProximity}
            onInteract={handleInteract}
            isModalOpen={isModalOpen}
            isPaused={isPaused}
          />
        </SceneWrapper>
      </KeyboardControls>

      <InteractionPrompt isVisible={showPrompt && !isPaused} />
      <ExperimentPopup />
    </>
  );
};
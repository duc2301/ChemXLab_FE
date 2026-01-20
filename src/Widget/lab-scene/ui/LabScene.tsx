// scenes/LabScene.tsx
import { SceneWrapper } from '../../../shared/ui/canvas/SceneWrapper';
import { LabEnvironment } from '../../../features/lab-environment/ui/LabEnvironment';
import { KeyboardControls, PointerLockControls } from '@react-three/drei';
import { controlMap } from '../../../features/camera-controller/models/controls';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { PhysicsModel } from '../../../shared/ui/3d/PhysicsModel';
import { Suspense, useState, useEffect } from 'react';
import { UserCamera } from '../../../features/camera-controller/ui/Camera';
import { ProximityDetector } from '../../../features/lab-experiment/components/ProximityDetector';
import { InteractionPrompt } from '../../../features/lab-experiment/components/InteractionPrompt';
import { ExperimentPopup } from '../../../features/lab-experiment/ui/ExperimentPopup';
import { useExperimentStore } from '../../../features/lab-experiment/services/experimentStore';

const TABLE_POSITION: [number, number, number] = [-2, 0, 2];
const DETECTION_RADIUS = 3;

interface LabSceneContentProps {
  onEnterProximity: () => void;
  onExitProximity: () => void;
  onInteract: () => void;
  isModalOpen: boolean;
}

// Internal content rendered inside Canvas
function LabSceneContent({
  onEnterProximity,
  onExitProximity,
  onInteract,
  isModalOpen,
}: LabSceneContentProps) {
  return (
    <>
      {/* Chỉ enable pointer lock khi modal KHÔNG mở */}
      {!isModalOpen && <PointerLockControls />}

      <Suspense fallback={null}>
        <Physics gravity={[0, -9.8, 0]} debug={false} paused={false}>

          {/* Môi trường & Ánh sáng */}
          <LabEnvironment enableControls={false} />

          <UserCamera />

          {/* Proximity detector cho bàn */}
          <ProximityDetector
            tablePosition={TABLE_POSITION}
            detectionRadius={DETECTION_RADIUS}
            onEnterProximity={onEnterProximity}
            onExitProximity={onExitProximity}
            onInteract={onInteract}
          />

          {/* Sàn */}
          <RigidBody type="fixed" position={[0, -0.1, 0]}>
            <CuboidCollider args={[50, 0.1, 50]} />
          </RigidBody>

          <PhysicsModel
            path="/models/phongthinghiem.glb"
            position={[0, 0, 0]}
            colliders="trimesh" 
            isStatic={true}
          />

          <PhysicsModel
            path="/models/table.glb"
            position={TABLE_POSITION}
            colliders="hull"
            isStatic={true}
          />

        </Physics>
      </Suspense>
    </>
  );
}

export const LabScene = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { openModal, isModalOpen } = useExperimentStore();

  const handleEnterProximity = () => {
    setShowPrompt(true);
  };

  const handleExitProximity = () => {
    setShowPrompt(false);
  };

  const handleInteract = () => {
    openModal();
  };

  // Quản lý pointer lock dựa trên trạng thái modal
  useEffect(() => {
    if (isModalOpen) {
      // Tắt pointer lock khi modal mở
      document.exitPointerLock();
      document.body.style.cursor = 'auto';
    }
  }, [isModalOpen]);

  return (
    <>
      <KeyboardControls map={controlMap}>
        <SceneWrapper>
          <LabSceneContent
            onEnterProximity={handleEnterProximity}
            onExitProximity={handleExitProximity}
            onInteract={handleInteract}
            isModalOpen={isModalOpen}
          />
        </SceneWrapper>
      </KeyboardControls>

      {/* UI overlays - rendered OUTSIDE canvas */}
      <InteractionPrompt isVisible={showPrompt} />
      <ExperimentPopup />
    </>
  );
};
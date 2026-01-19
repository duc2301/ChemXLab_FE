// scenes/LabScene.tsx
import { SceneWrapper } from '../../../shared/ui/canvas/SceneWrapper';
import { LabEnvironment } from '../../../features/lab-environment/ui/LabEnvironment';
import { KeyboardControls, PointerLockControls } from '@react-three/drei';
import { controlMap } from '../../../features/camera-controller/models/controls';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { PhysicsModel } from '../../../shared/ui/3d/PhysicsModel';
import { Suspense } from 'react';
import { UserCamera } from '../../../features/camera-controller/ui/Camera';

export const LabScene = () => {
  return (
    <KeyboardControls map={controlMap}>
      <SceneWrapper>
        <PointerLockControls />

        <Suspense fallback={null}>
          <Physics gravity={[0, -9.8, 0]} debug={false}>

            {/* Môi trường & Ánh sáng */}
            <LabEnvironment enableControls={false} />

            <UserCamera />

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
              position={[-2, 0, 2]}
              colliders="hull"
              isStatic={true}
            />

          </Physics>
        </Suspense>
      </SceneWrapper>
    </KeyboardControls>
  );
};
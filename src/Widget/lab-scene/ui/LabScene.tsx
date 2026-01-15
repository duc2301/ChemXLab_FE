import { SceneWrapper } from '../../../shared/ui/canvas/SceneWrapper';
import { LabEnvironment } from '../../../features/lab-environment/ui/LabEnvironment';
import { KeyboardControls } from '@react-three/drei';
import { controlMap } from '../../../features/camera-controller/models/controls';
import { FreeCameraController } from '../../../features/camera-controller/ui/Camera';
import { Physics } from '../../../features/camera-controller/ui/Physics';
import { GenericModel } from '../../../shared/ui/3d/GenericModel';
import { Button } from 'antd';

export const LabScene = () => {
  return (
    <KeyboardControls map={controlMap}>
      <SceneWrapper>
        {/* Layer 1: Môi trường & Ánh sáng */}
        <LabEnvironment enableControls={false} />

        {/* Camera controller (first-person style movement) */}
        <FreeCameraController />

        {/* Physics (gravity + ground collision) */}
        <Physics gravity={9.8} groundY={0} />

        {/* === KHÔNG GIAN PHÒNG THÍ NGHIỆM === */}

        {/* 1. Lab room */}
        <GenericModel 
          path="/models/phongthinghiem.glb"
          position={[0, 0.1, 0]} 
          scale={1.5}
        />

        {/* 2. Table */}
        <GenericModel 
          path="/models/table.glb"
          position={[-2.5, 0, -1.25]} 
          rotation={[0, Math.PI / 4, 0]} 
          scale={1.5}
        />

      </SceneWrapper>
    </KeyboardControls>
  );
};
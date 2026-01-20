import { KeyboardControls } from "@react-three/drei";
import { controlMap } from "../../../features/camera-controller/models/controls";
import { FreeCameraController } from "../../../features/camera-controller/ui/Camera";
import { Physics } from "../../../features/camera-controller/ui/Physics";
import { LabEnvironment } from "../../../features/lab-environment/ui/LabEnvironment";
import { GenericModel } from "../../../shared/ui/3d/GenericModel";
import { SceneWrapper } from "../../../shared/ui/canvas/SceneWrapper";

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

        {/* 1. Cái Bàn (Gốc) */}
        <GenericModel
          path="/models/table.glb"
          position={[0, 0, 0]}
          scale={1.5}
        />

        {/* 2. Cái Bàn thứ 2 (Tái sử dụng) - Xoay đi một chút */}
        <GenericModel
          path="/models/table.glb"
          position={[5, 0, -3]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.5}
        />

        {/* 3. Ví dụ nhập thêm các file khác sau này */}
        {/* <GenericModel path="/models/chair.glb" position={[0, 0, 1]} /> */}
        {/* <GenericModel path="/models/microscope.glb" position={[0, 0.8, 0]} /> */}

        {/* Sàn nhà */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </SceneWrapper>
    </KeyboardControls>
  );
};

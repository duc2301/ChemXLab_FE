import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva'; // Dùng để chỉnh thông số nóng

interface LabEnvironmentProps {
  enableControls?: boolean;
}

export const LabEnvironment = ({ enableControls = true }: LabEnvironmentProps) => {
  // Leva giúp bạn chỉnh màu và ánh sáng ngay trên trình duyệt để tìm ra thông số đẹp nhất
  const { bgColor, envPreset, ambientIntensity } = useControls('Lab Settings', {
    bgColor: '#fffafa',
    envPreset: {
      options: ['city', 'sunset', 'dawn', 'warehouse', 'forest', 'apartment', 'studio', 'night'],
      value: 'studio' // Preset 'city' hoặc 'studio' thường hợp với phòng Lab
    },
    ambientIntensity: { value: 0.5, min: 0, max: 2 }
  });

  return (
    <>
      {/* 1. Màu nền của không gian 3D */}
      <color attach="background" args={[bgColor]} />

      {/* 2. Ánh sáng toàn cục (Ambient Light) - giúp các góc tối không bị đen hoàn toàn */}
      <ambientLight intensity={ambientIntensity} />

      {/* 3. Environment (HDRI) - Tạo ánh sáng thực tế và phản chiếu lên vật thể kim loại */}
      {/* 'ground' props giúp tạo cảm giác vật thể đặt trên sàn thay vì lơ lửng */}
      <Environment preset={envPreset as any} background={false} blur={0.1} />

      {/* 4. Bóng đổ dưới sàn (Giả lập) - Nhẹ hơn tính toán bóng thật */}
      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={0.5} 
        scale={10} 
        blur={1.5} 
        far={0.8} 
      />

      {/* 5. Điều khiển Camera (Cho phép user xoay, zoom) */}
      {enableControls && (
        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} // Không cho camera chui xuống dưới đất
        />
      )}
      
      {/* Hỗ trợ Grid để dễ hình dung không gian khi đang dev
      <gridHelper args={[20, 20, 0xff0000, 'teal']} position={[0, -0.01, 0]} /> */}
    </>
  );
};
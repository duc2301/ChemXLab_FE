import { Environment, ContactShadows, OrbitControls, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useControls, folder } from 'leva';

interface LabEnvironmentProps {
  enableControls?: boolean;
}

export const LabEnvironment = ({ enableControls = true }: LabEnvironmentProps) => {
  const config = useControls({
    'Lab Atmosphere': folder({
      bgColor: { value: '#f0f2f5' }, // Màu xám trắng đặc trưng của phòng lab
      ambientIntensity: { value: 0.8, min: 0, max: 2 }, // Phòng lab cần rất sáng
    }),
    
    'Lighting': folder({
      envPreset: {
        options: ['city', 'studio', 'warehouse', 'apartment'],
        value: 'city' // City hoặc Studio cho ánh sáng trung tính tốt nhất
      },
      envBlur: { value: 1, min: 0, max: 1 }, // Blur tối đa để ánh sáng mềm
      lightIntensity: { value: 2, min: 0, max: 10 }, // Độ mạnh của đèn trần
    }),

    'Shadows': folder({
      shadowOpacity: { value: 0.4, min: 0, max: 1 }, // Bóng nhạt thôi cho sạch
      shadowBlur: { value: 2, min: 0, max: 10 },
      shadowColor: '#8a8a8a', // Bóng màu xám thay vì đen kịt
    }),

    'Post Processing': folder({
      enableEffects: true,
      bloomIntensity: { value: 0.2, min: 0, max: 2 }, // Bloom rất nhẹ cho kim loại
      bloomThreshold: { value: 0.95, min: 0, max: 1 },
    })
  });

  return (
    <>
      {/* 1. Nền sạch sẽ */}
      <color attach="background" args={[config.bgColor]} />

      {/* 2. Ánh sáng môi trường */}
      {/* Phòng lab cần ánh sáng đều, không góc chết */}
      <ambientLight intensity={config.ambientIntensity} />

      {/* 3. Setup đèn trần giả lập đèn Huỳnh Quang (Fluorescent) */}
      <Environment preset={config.envPreset as any} blur={config.envBlur}>
        {/* Một tấm sáng lớn trên trần để bao phủ ánh sáng tổng thể */}
        <Lightformer 
          intensity={1} 
          position={[0, 10, 0]} 
          scale={[10, 10, 1]} 
          rotation-x={Math.PI / 2} 
          color="white"
        />

        {/* Hai dải đèn dài song song - Tạo vệt phản chiếu đẹp trên kính/kim loại */}
        <group rotation={[0, -0.5, 0]}>
            <Lightformer 
                intensity={config.lightIntensity} 
                rotation-x={Math.PI / 2} 
                position={[0, 5, -2]} 
                scale={[10, 1, 1]} // Dạng thanh dài
                color="white"
            />
            <Lightformer 
                intensity={config.lightIntensity} 
                rotation-x={Math.PI / 2} 
                position={[0, 5, 2]} 
                scale={[10, 1, 1]} 
                color="white"
            />
        </group>
        
        {/* Một chút ánh sáng lạnh từ bên cạnh để tạo khối Clean */}
        <Lightformer 
            intensity={2} 
            rotation-y={Math.PI / 2} 
            position={[-5, 1, -1]} 
            scale={[10, 5, 1]} 
            color="#e6f0ff" // Hơi xanh nhẹ
        />
      </Environment>

      {/* 4. Bóng đổ mềm mại trên sàn trắng */}
      <ContactShadows 
        position={[0, -0.01, 0]} 
        opacity={config.shadowOpacity} 
        scale={20} 
        blur={config.shadowBlur} 
        far={1.5} 
        color={config.shadowColor}
        resolution={512} 
        smooth={true} // Làm bóng mượt hơn
      />

      {/* 5. Hậu kỳ tối giản */}
      {config.enableEffects && (
        <EffectComposer enableNormalPass>          
          <Bloom 
            luminanceThreshold={config.bloomThreshold} 
            mipmapBlur 
            intensity={config.bloomIntensity} 
            radius={0.5}
          />
          
          <Vignette offset={0.1} darkness={0.6} blendFunction={6} />
        </EffectComposer>
      )}

      {enableControls && (
        <OrbitControls 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.1} 
          makeDefault 
        />
      )}
    </>
  );
};
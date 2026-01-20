import { Environment, ContactShadows, OrbitControls, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useControls, folder } from 'leva';

interface LabEnvironmentProps {
  enableControls?: boolean;
}

export const LabEnvironment = ({ enableControls = true }: LabEnvironmentProps) => {
  const config = useControls({
    'Lab Atmosphere': folder({
      bgColor: { value: '#f0f2f5' }, 
      ambientIntensity: { value: 0.12, min: 0, max: 2 }, 
    }),
    
    'Lighting': folder({
      envPreset: {
        options: ['city', 'studio', 'warehouse', 'apartment'],
        value: 'apartment' 
      },
      envBlur: { value: 1, min: 0, max: 1 }, 
      lightIntensity: { value: 2, min: 0, max: 10 }, 
    }),

    'Shadows': folder({
      shadowOpacity: { value: 0, min: 0, max: 1 }, 
      shadowBlur: { value: 0, min: 0, max: 10 },
      shadowColor: '#8a8a8a', 
    }),

    'Post Processing': folder({
      enableEffects: true,
      bloomIntensity: { value: 0.05, min: 0, max: 2 }, 
      bloomThreshold: { value: 1, min: 0, max: 1 },
    })
  });

  return (
    <>

      {/* 2. Ánh sáng môi trường */}
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
        smooth={true} 
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
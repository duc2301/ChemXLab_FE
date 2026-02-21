import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { folder, useControls } from 'leva';

interface LabEnvironmentProps {
  enableControls?: boolean;
  levaHidden?: boolean;
}

export const LabEnvironment = ({ enableControls = true, levaHidden = false }: LabEnvironmentProps) => {
  const config = useControls({
    'Không gian Lab': folder({
      bgColor: { value: '#f0f2f5', label: 'Màu nền' },
      ambientIntensity: { value: 0.12, min: 0, max: 2, label: 'Độ sáng môi trường' },
    }),

    'Ánh sáng': folder({
      envPreset: {
        options: { 'Thành phố': 'city', 'Studio': 'studio', 'Kho hàng': 'warehouse', 'Căn hộ': 'apartment' },
        value: 'apartment',
        label: 'Môi trường'
      },
      envBlur: { value: 1, min: 0, max: 1, label: 'Độ mờ' },
      lightIntensity: { value: 2, min: 0, max: 10, label: 'Cường độ sáng' },
    }),

    'Bóng đổ': folder({
      shadowOpacity: { value: 0, min: 0, max: 1, label: 'Độ đậm bóng' },
      shadowBlur: { value: 0, min: 0, max: 10, label: 'Độ mờ bóng' },
      shadowColor: { value: '#8a8a8a', label: 'Màu bóng' },
    }),

    'Hậu kỳ': folder({
      enableEffects: { value: true, label: 'Bật hiệu ứng' },
      bloomIntensity: { value: 0.05, min: 0, max: 2, label: 'Cường độ Bloom' },
      bloomThreshold: { value: 1, min: 0, max: 1, label: 'Ngưỡng Bloom' },
    })
  }, { hidden: levaHidden });

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
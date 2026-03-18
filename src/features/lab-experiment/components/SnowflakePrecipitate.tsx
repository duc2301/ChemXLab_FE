import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

export const SnowflakePrecipitate = ({
  tubeR,
  tubeBottomY,
  liquidSurfaceY,
  active,
  onComplete,
}: any) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const startTime = useRef<number>(0);

  const height = liquidSurfaceY - tubeBottomY;
  const cylinderCenterY = (liquidSurfaceY + tubeBottomY) / 2;

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uActive: { value: 0 },
      uHeight: { value: height },
      uColor: { value: new THREE.Color("#ffffff") },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vY;
      void main() {
        vUv = uv;
        vY = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uActive;
      uniform float uHeight;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying float vY;

      void main() {
        if (uActive < 0.1) discard;

        float progress = min(uTime * 0.3, 1.0); 
        float normalizedY = (vY + (uHeight / 2.0)) / uHeight;
        
        float mask = smoothstep(1.0 - progress - 0.3, 1.0 - progress, normalizedY);
        
        // GIẢM BIÊN ĐỘ: Thay đổi từ 0.4 xuống 0.2 để dao động nhẹ nhàng hơn
        // Tần số vẫn giữ cao để tạo độ chi tiết cho khói
        float noise = sin(vY * 35.0 + uTime * 4.0) * cos(vUv.x * 15.0 - uTime * 3.0) * 0.2;
        
        float alpha = mask * (0.5 + noise);
        
        float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
        
        gl_FragColor = vec4(uColor, alpha * edge * 0.7);
      }
    `
  }), [height]);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  useFrame((state) => {
    if (!active || !materialRef.current) return;

    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const delayTime = 0.65;
    const delay = elapsed < delayTime;

    materialRef.current.uniforms.uTime.value = delay ? 0 : elapsed - delayTime;
    materialRef.current.uniforms.uActive.value = delay ? 0: 1.0;
  });

  return (
    <mesh position={[0, cylinderCenterY, 0]}>
      <cylinderGeometry args={[tubeR * 0.98, tubeR * 0.98, height, 32, 1, true]} />
      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};
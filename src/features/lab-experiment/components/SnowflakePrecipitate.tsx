import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

interface SnowflakePrecipitateProps {
  tubeR: number;
  tubeBottomY: number;
  surfaceYRef: React.MutableRefObject<number>;
  active: boolean;
  onComplete?: () => void;
  color: string;   // Nhận mã màu từ LiquidLayer (ví dụ #FAFAFA)
  opacity: number; // Nhận độ đục (ví dụ 1.0 cho kết tủa đặc)
}

export const SnowflakePrecipitate = ({
  tubeR,
  tubeBottomY,
  surfaceYRef,
  active,
  onComplete,
  color,
  opacity,
}: SnowflakePrecipitateProps) => {
  const materialBaseRef = useRef<THREE.ShaderMaterial>(null!);
  const materialTopRef = useRef<THREE.ShaderMaterial>(null!);
  const meshTopRef = useRef<THREE.Mesh>(null!);

  const startTime = useRef<number>(0);
  const initialSurfaceY = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (active) {
      initialSurfaceY.current = surfaceYRef.current;
      setIsInitialized(true);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500 + 650); // Tổng thời gian rơi + delay
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  // Chiều cao phần thân thẳng (trước khi bắt đầu bo đáy)
  const baseStraightHeight = useMemo(() => {
    return Math.max(0.001, initialSurfaceY.current - tubeBottomY - tubeR);
  }, [isInitialized, tubeBottomY, tubeR]);

  // --- TẠO GEOMETRY BO ĐÁY (LatheGeometry) ---
  const latheGeometry = useMemo(() => {
    const points = [];
    const segments = 32;
    const r = tubeR; // Khớp với bán kính chất lỏng trong LiquidLayer

    // 1. Điểm đỉnh (mặt nước ban đầu)
    points.push(new THREE.Vector2(r, baseStraightHeight + tubeR)); 
    // 2. Điểm bắt đầu bo đáy
    points.push(new THREE.Vector2(r, tubeR));

    // 3. Tạo đường cong bầu dục 90 độ
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI / 2;
      points.push(new THREE.Vector2(r * Math.cos(theta), r * (1 - Math.sin(theta))));
    }

    return new THREE.LatheGeometry(points, 32);
  }, [tubeR, baseStraightHeight]);

  const sharedVertexShader = `
    varying vec2 vUv;
    varying float vY;
    void main() {
      vUv = uv;
      vY = position.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Shader cho Mesh 1: Phần kết tủa đang rơi/loang xuống đáy
  const baseShaderArgs = useMemo(() => {
    const totalBaseHeight = baseStraightHeight + tubeR;
    return {
      uniforms: {
        uTime: { value: 0 },
        uActive: { value: 0 },
        uHeight: { value: totalBaseHeight },
        uColor: { value: new THREE.Color(color) },
        uMaxOpacity: { value: opacity },
      },
      vertexShader: sharedVertexShader,
      fragmentShader: `
        uniform float uTime;
        uniform float uActive;
        uniform float uHeight;
        uniform vec3 uColor;
        uniform float uMaxOpacity;
        varying vec2 vUv;
        varying float vY;

        void main() {
          if (uActive < 0.1) discard;
          float progress = min(uTime * 0.35, 1.0); 
          
          float normalizedY = vY / uHeight;
          float mask = smoothstep(1.0 - progress - 0.2, 1.0 - progress, normalizedY);
          
          // Noise tạo hiệu ứng bông tuyết/kết tủa đang rơi
          float noise = sin(vY * 40.0 + uTime * 5.0) * cos(vUv.x * 20.0 - uTime * 3.0) * 0.1;
          float alpha = mask * (0.8 + noise) * uMaxOpacity;
          
          // Khử viền mép dọc
          float edge = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
          gl_FragColor = vec4(uColor, alpha * edge);
        }
      `
    };
  }, [baseStraightHeight, tubeR, color, opacity]);

  // Shader cho Mesh 2: Phần trụ dâng lên (Màu phẳng, không gợn sóng)
  const topShaderArgs = useMemo(() => ({
    uniforms: {
      uActive: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uMaxOpacity: { value: opacity },
    },
    vertexShader: sharedVertexShader,
    fragmentShader: `
      uniform float uActive;
      uniform vec3 uColor;
      uniform float uMaxOpacity;
      varying vec2 vUv;

      void main() {
        if (uActive < 0.1) discard;
        // Alpha phẳng để tránh gợn sóng khi dâng cao (scaleY)
        float alpha = 0.9 * uMaxOpacity; 
        float edge = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
        gl_FragColor = vec4(uColor, alpha * edge);
      }
    `
  }), [color, opacity]);

  useFrame((state) => {
    if (!active || !isInitialized) return;

    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const delayTime = 0.65;
    const internalTime = elapsed < delayTime ? 0 : elapsed - delayTime;
    const isActive = elapsed > delayTime ? 1.0 : 0.0;

    // Cập nhật Mesh 1 (Phần đáy loang)
    if (materialBaseRef.current) {
      materialBaseRef.current.uniforms.uTime.value = internalTime;
      materialBaseRef.current.uniforms.uActive.value = isActive;
      materialBaseRef.current.toneMapped = true;
    }

    // Cập nhật Mesh 2 (Phần dâng thêm)
    const currentSurfaceY = surfaceYRef.current;
    const extraHeight = Math.max(0, currentSurfaceY - initialSurfaceY.current);
    
    if (meshTopRef.current && extraHeight > 0.0001) {
      meshTopRef.current.visible = true;
      meshTopRef.current.scale.y = extraHeight;
      // Đặt vị trí nối tiếp ngay trên đầu Mesh 1
      meshTopRef.current.position.y = initialSurfaceY.current + extraHeight / 2;
      
      materialTopRef.current.uniforms.uActive.value = isActive;
      materialTopRef.current.toneMapped = true;
    } else if (meshTopRef.current) {
      meshTopRef.current.visible = false;
    }
  });

  return (
    <group>
      {/* MESH 1: Phần bo đáy bầu dục */}
      {isInitialized && (
        <mesh position={[0, tubeBottomY, 0]} geometry={latheGeometry}>
          <shaderMaterial
            ref={materialBaseRef}
            args={[baseShaderArgs]}
            transparent={true}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* MESH 2: Phần dâng thêm (Cylinder phẳng) */}
      <mesh ref={meshTopRef} position={[0, 0, 0]} visible={false}>
        <cylinderGeometry args={[tubeR * 0.98, tubeR * 0.98, 1, 32, 1, true]} />
        <shaderMaterial
          ref={materialTopRef}
          args={[topShaderArgs]}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";

interface SnowflakePrecipitateProps {
  tubeR: number;
  tubeBottomY: number;
  surfaceYRef: React.MutableRefObject<number>;
  active: boolean;
  onComplete?: () => void;
  color: string;
  opacity: number;
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
      }, 3500 + 650);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  const baseStraightHeight = useMemo(() => {
    return Math.max(0.001, initialSurfaceY.current - tubeBottomY - tubeR);
  }, [isInitialized, tubeBottomY, tubeR]);

  const latheGeometry = useMemo(() => {
    const points = [];
    const segments = 32;
    const r = tubeR;
    points.push(new THREE.Vector2(r, baseStraightHeight + tubeR)); 
    points.push(new THREE.Vector2(r, tubeR));
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
          
          // Đã loại bỏ noise để màu phẳng (flat) hoàn toàn
          float alpha = mask * uMaxOpacity; 
          
          float edge = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
          gl_FragColor = vec4(uColor, alpha * edge);
        }
      `
    };
  }, [baseStraightHeight, tubeR, color, opacity]);

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
        float alpha = uMaxOpacity; 
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

    if (materialBaseRef.current) {
      materialBaseRef.current.uniforms.uTime.value = internalTime;
      materialBaseRef.current.uniforms.uActive.value = isActive;
      // TẮT toneMapped để màu không bị sáng rực/bóng
      materialBaseRef.current.toneMapped = false;
    }

    const currentSurfaceY = surfaceYRef.current;
    const extraHeight = Math.max(0, currentSurfaceY - initialSurfaceY.current);
    
    if (meshTopRef.current && extraHeight > 0.0001) {
      meshTopRef.current.visible = true;
      meshTopRef.current.scale.y = extraHeight;
      meshTopRef.current.position.y = initialSurfaceY.current + extraHeight / 2;
      
      materialTopRef.current.uniforms.uActive.value = isActive;
      // TẮT toneMapped
      materialTopRef.current.toneMapped = false;
    } else if (meshTopRef.current) {
      meshTopRef.current.visible = false;
    }
  });

  return (
    <group>
      {isInitialized && (
        <mesh position={[0, tubeBottomY, 0]} geometry={latheGeometry}>
          <shaderMaterial
            ref={materialBaseRef}
            args={[baseShaderArgs]}
            transparent={true}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false} 
          />
        </mesh>
      )}

      <mesh ref={meshTopRef} position={[0, 0, 0]} visible={false}>
        <cylinderGeometry args={[tubeR, tubeR, 1, 32, 1, true]} />
        <shaderMaterial
          ref={materialTopRef}
          args={[topShaderArgs]}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
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
  const materialBaseRef = useRef<THREE.MeshStandardMaterial>(null!);
  const meshTopRef = useRef<THREE.Mesh>(null!);
  const materialTopRef = useRef<THREE.MeshStandardMaterial>(null!);

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

  // Chiều cao phần thân thẳng
  const baseStraightHeight = useMemo(() => {
    return Math.max(0.001, initialSurfaceY.current - tubeBottomY - tubeR);
  }, [isInitialized, tubeBottomY, tubeR]);

  // --- TẠO GEOMETRY ĐẶC RUỘT (LatheGeometry CÓ NẮP) ---
  const latheGeometry = useMemo(() => {
    const points = [];
    const segments = 32;
    const r = tubeR;

    // 1. Thêm điểm tâm ở trên cùng để "đóng nắp" hình trụ -> Tạo khối đặc
    points.push(new THREE.Vector2(0, baseStraightHeight + tubeR));
    
    // 2. Điểm rìa đỉnh (mặt nước ban đầu)
    points.push(new THREE.Vector2(r, baseStraightHeight + tubeR)); 
    // 3. Điểm bắt đầu bo đáy
    points.push(new THREE.Vector2(r, tubeR));

    // 4. Tạo đường cong bầu dục 90 độ (kết thúc ở x=0 -> tự đóng nắp đáy)
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * (Math.PI / 2);
      points.push(new THREE.Vector2(r * Math.cos(theta), r * (1 - Math.sin(theta))));
    }

    return new THREE.LatheGeometry(points, 32);
  }, [tubeR, baseStraightHeight]);

  // Tiêm (Inject) hiệu ứng loang vào MeshStandardMaterial để giữ nguyên khả năng nhận sáng
  const totalBaseHeight = baseStraightHeight + tubeR;
  const onBeforeCompile = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = { value: 0 };
    shader.uniforms.uActive = { value: 0 };
    shader.uniforms.uHeight = { value: totalBaseHeight };

    // Lưu lại shader để update trong useFrame
    materialBaseRef.current.userData.shader = shader;

    // Lấy tọa độ Y
    shader.vertexShader = `
      varying float vY;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
       vY = position.y;`
    );

    // Xử lý Alpha mask (hiệu ứng rơi) trước khi tính toán ánh sáng
    shader.fragmentShader = `
      uniform float uTime;
      uniform float uActive;
      uniform float uHeight;
      varying float vY;
      ${shader.fragmentShader}
    `.replace(
      `#include <color_fragment>`,
      `#include <color_fragment>
       if (uActive < 0.1) discard;
       float progress = min(uTime * 0.35, 1.0);
       float normalizedY = vY / uHeight;
       
       // Chỉ giữ lại mask rơi từ trên xuống, bỏ edge fade để viền sắc nét đúng chuẩn khối 3D đặc
       float mask = smoothstep(1.0 - progress - 0.2, 1.0 - progress, normalizedY);
       diffuseColor.a *= mask;
      `
    );
  };

  useFrame((state) => {
    if (!active || !isInitialized) return;

    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const delayTime = 1;
    const internalTime = elapsed < delayTime ? 0 : elapsed - delayTime;
    const isActive = elapsed > delayTime ? 1.0 : 0.0;

    // Cập nhật shader Mesh 1
    if (materialBaseRef.current && materialBaseRef.current.userData.shader) {
      materialBaseRef.current.userData.shader.uniforms.uTime.value = internalTime;
      materialBaseRef.current.userData.shader.uniforms.uActive.value = isActive;
    }

    // Cập nhật Mesh 2
    const currentSurfaceY = surfaceYRef.current;
    const extraHeight = Math.max(0, currentSurfaceY - initialSurfaceY.current);
    
    if (meshTopRef.current && extraHeight > 0.0001) {
      meshTopRef.current.visible = true;
      meshTopRef.current.scale.y = extraHeight;
      meshTopRef.current.position.y = initialSurfaceY.current + extraHeight / 2;
      
      if (materialTopRef.current) {
         materialTopRef.current.opacity = isActive === 1.0 ? opacity : 0;
      }
    } else if (meshTopRef.current) {
      meshTopRef.current.visible = false;
    }
  });

  return (
    <group>
      {/* MESH 1: Phần bo đáy bầu dục */}
      {isInitialized && (
        <mesh position={[0, tubeBottomY, 0]} geometry={latheGeometry}>
          <meshStandardMaterial
            ref={materialBaseRef}
            color={color}
            transparent={true}
            opacity={opacity}
            side={THREE.DoubleSide}
            depthWrite={true} // Bật để khối đặc đè lên nhau chuẩn xác
            onBeforeCompile={onBeforeCompile}
          />
        </mesh>
      )}

      {/* MESH 2: Phần dâng thêm (Cylinder) */}
      <mesh ref={meshTopRef} position={[0, 0, 0]} visible={false}>
        {/* Đổi tham số cuối cùng (openEnded) thành false để đóng nắp trên/dưới */}
        <cylinderGeometry args={[tubeR, tubeR, 1, 32, 1, false]} />
        <meshStandardMaterial
          ref={materialTopRef}
          color={color}
          transparent={true}
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
};
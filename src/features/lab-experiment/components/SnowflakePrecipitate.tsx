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
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const SNOW_COUNT = 2500; // Tăng số lượng một chút để nhìn dày hơn
  const _dummy = new THREE.Object3D();

  // Thời gian bắt đầu phản ứng
  const startTime = useRef<number>(0);

  const particles = useMemo(() => {
    const temp = [];
    const height = liquidSurfaceY - tubeBottomY;

    for (let i = 0; i < SNOW_COUNT; i++) {
      const r = Math.sqrt(Math.random()) * tubeR * 0.95;
      const theta = Math.random() * Math.PI * 2;

      // Vị trí cố định của hạt trong ống
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = tubeBottomY + Math.random() * height;

      // Tính toán thời điểm hạt này sẽ xuất hiện
      // Hạt ở càng cao (y lớn) thì delay càng ngắn -> xuất hiện trước
      // Hạt ở càng thấp (y nhỏ) thì delay càng dài -> xuất hiện sau
      const normalizedY = (y - tubeBottomY) / height; // 0 (đáy) -> 1 (mặt)
      const appearanceDelay = (1 - normalizedY) * 8; // Lan tỏa trong 8 giây đầu

      temp.push({
        x,
        y,
        z,
        appearanceDelay,
        size: 0.0003 + Math.random() * 0.0015,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [active, tubeR, tubeBottomY, liquidSurfaceY]);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  useFrame((state) => {
    if (!active || !meshRef.current) return;

    // Thiết lập thời điểm bắt đầu thực tế
    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;

    particles.forEach((p, i) => {
      // Chỉ hiển thị hạt nếu thời gian trôi qua lớn hơn delay của hạt đó
      if (elapsed > p.appearanceDelay) {
        // Hiệu ứng xuất hiện: lớn dần lên một chút (zoom in)
        const scaleProgress = Math.min((elapsed - p.appearanceDelay) * 2, 1);
        const currentScale = p.size * scaleProgress;

        // Hiệu ứng rung rinh nhẹ tại chỗ (không rơi)
        const swayX = Math.sin(elapsed * 1.5 + p.phase) * 0.0001;
        const swayZ = Math.cos(elapsed * 1.5 + p.phase) * 0.0001;

        _dummy.position.set(p.x + swayX, p.y, p.z + swayZ);
        _dummy.rotation.y += 0.01;
        _dummy.scale.setScalar(currentScale);
      } else {
        // Hạt chưa đến lúc xuất hiện thì thu nhỏ về 0
        _dummy.scale.setScalar(0);
      }

      _dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, _dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, SNOW_COUNT]}
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.7}
        roughness={0.1}
        metalness={0.2}
      />
    </instancedMesh>
  );
};

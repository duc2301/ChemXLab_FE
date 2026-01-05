import { useKeyboardControls, OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3, Mesh } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { ControlsState } from '../models/controls';

const MOVEMENT_SPEED = 5;

export const OpenWorldController = () => {
  const [, get] = useKeyboardControls<ControlsState>();
  const { camera } = useThree();
  
  // Ref để điều khiển OrbitControls thủ công
  const controlsRef = useRef<OrbitControlsImpl>(null);
  
  // Ref đại diện cho "Nhân vật" hoặc "Điểm trung tâm" vô hình
  // Chúng ta sẽ di chuyển khối này, và camera sẽ bám theo nó
  const playerRef = useRef<Mesh>(null);

  // Vector tạm để tính toán (tránh tạo mới mỗi frame gây rác bộ nhớ)
  const currentVelocity = useRef(new Vector3());
  const walkDirection = useRef(new Vector3());
  const rotateAngle = useRef(new Vector3(0, 1, 0));
  const rotateQuarternion = useRef(new Vector3());
  const cameraTarget = useRef(new Vector3());

  useFrame((state, delta) => {
    const { forward, backward, left, right } = get();
    if (!playerRef.current || !controlsRef.current) return;

    // 1. Tính toán hướng di chuyển dựa trên phím bấm
    // Chúng ta không di chuyển camera trực tiếp, mà di chuyển "playerRef"
    const isMoving = forward || backward || left || right;

    if (isMoving) {
      // Lấy góc quay hiện tại của Camera (chỉ lấy trục Y - xoay ngang)
      const angleYCameraDirection = Math.atan2(
        (camera.position.x - playerRef.current.position.x), 
        (camera.position.z - playerRef.current.position.z)
      );

      // Tạo offset góc dựa trên phím bấm (W = 0, A = PI/2...)
      let directionOffset = 0;
      if (forward) {
        if (left) directionOffset = Math.PI / 4;
        else if (right) directionOffset = -Math.PI / 4;
      } else if (backward) {
        if (left) directionOffset = Math.PI / 4 + Math.PI / 2;
        else if (right) directionOffset = -Math.PI / 4 - Math.PI / 2;
        else directionOffset = Math.PI;
      } else if (left) {
        directionOffset = Math.PI / 2;
      } else if (right) {
        directionOffset = -Math.PI / 2;
      }

      // Hướng di chuyển cuối cùng = Hướng camera + Hướng phím
      rotateAngle.current.set(0, angleYCameraDirection + directionOffset + Math.PI, 0); // +PI vì camera nhìn ngược về target
      
      // Tính vector di chuyển
      // X = sin(angle), Z = cos(angle)
      const moveX = Math.sin(rotateAngle.current.y);
      const moveZ = Math.cos(rotateAngle.current.y);

      // Cập nhật vị trí của Player (Cục mốc)
      playerRef.current.position.x += moveX * MOVEMENT_SPEED * delta;
      playerRef.current.position.z += moveZ * MOVEMENT_SPEED * delta;
      
      // Quan trọng: Di chuyển cả Camera theo Player để giữ khoảng cách không đổi
      camera.position.x += moveX * MOVEMENT_SPEED * delta;
      camera.position.z += moveZ * MOVEMENT_SPEED * delta;

      // Cập nhật Target của OrbitControls bám theo Player
      controlsRef.current.target.copy(playerRef.current.position);
    }
    
    // Luôn update controls mỗi frame để mượt mà
    controlsRef.current.update();
  });

  return (
    <>
      {/* OrbitControls quản lý việc xoay chuột */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false} // Tắt Pan bằng chuột phải (vì đã dùng WASD để đi)
        enableDamping={true}
        maxPolarAngle={Math.PI / 2 - 0.1} // Không cho camera chui xuống đất
        minDistance={2} // Zoom gần tối đa
        maxDistance={20} // Zoom xa tối đa
      />

      {/* Vật thể đại diện cho tâm điểm (Player) */}
      {/* Visible = false nếu bạn muốn ẩn nó đi */}
      <mesh ref={playerRef} position={[0, 1, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color="cyan" />
        
        {/* Mũi tên chỉ hướng trước mặt để dễ hình dung (Debug) */}
        <mesh position={[0, 0, 0.5]}>
            <boxGeometry args={[0.1, 0.1, 0.5]} />
            <meshStandardMaterial color="red" />
        </mesh>
      </mesh>
    </>
  );
};
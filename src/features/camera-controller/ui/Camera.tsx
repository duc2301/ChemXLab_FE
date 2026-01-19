// features/camera-controller/ui/PlayerController.tsx
import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, RigidBody, RapierRigidBody, useRapier } from '@react-three/rapier';
import { useRef } from 'react';
import { Vector3 } from 'three';
import type { ControlsState } from '../models/controls';

const MOVEMENT_SPEED = 5;
const JUMP_FORCE = 5;

export const UserCamera = () => {
  const { camera } = useThree();
  const [, get] = useKeyboardControls<ControlsState>();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { world } = useRapier();

  // Vectors - tạo 1 lần duy nhất để tránh garbage collection
  const directionRef = useRef(new Vector3());
  const frontVectorRef = useRef(new Vector3());
  const sideVectorRef = useRef(new Vector3());

  useFrame((state) => {
    if (!rigidBodyRef.current) return;

    const { forward, backward, left, right, up } = get();
    const vel = rigidBodyRef.current.linvel();

    // Tính hướng di chuyển
    const direction = directionRef.current;
    const frontVector = frontVectorRef.current;
    const sideVector = sideVectorRef.current;

    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVEMENT_SPEED)
      .applyEuler(state.camera.rotation);

    // Áp dụng vận tốc (giữ nguyên Y cho trọng lực)
    rigidBodyRef.current.setLinvel(
      { x: direction.x, y: vel.y, z: direction.z },
      true
    );

    // Xử lý nhảy với ground check
    if (up) {
      const origin = rigidBodyRef.current.translation();
      const ray = world.castRay(
        { 
          origin: { x: origin.x, y: origin.y, z: origin.z },
          dir: { x: 0, y: -1, z: 0 }
        } as any,
        1.1,
        true
      );

      if (ray) {
        rigidBodyRef.current.setLinvel({ x: vel.x, y: JUMP_FORCE, z: vel.z }, true);
      }
    }

    const translation = rigidBodyRef.current.translation();
    camera.position.set(translation.x, translation.y + 0.8, translation.z);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 5, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
      friction={0}
    >
      <CapsuleCollider args={[0.75, 0.35]} />
    </RigidBody>
  );
};
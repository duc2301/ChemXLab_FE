// features/camera-controller/ui/PlayerController.tsx
import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CapsuleCollider, RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useRef } from 'react';
import { Vector3 } from 'three';
import { useLabSettings } from '../../lab-environment/services/labSettingsStore';
import type { ControlsState } from '../models/controls';

const VELOCITY_DEAD_ZONE = 0.001;

interface UserCameraProps {
  frozen?: boolean;
}

export const UserCamera = ({ frozen = false }: UserCameraProps) => {
  const { camera } = useThree();
  const [, get] = useKeyboardControls<ControlsState>();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const { world } = useRapier();

  // Vectors — created once to avoid GC pressure
  const moveDir = useRef(new Vector3());
  const frontV = useRef(new Vector3());
  const sideV = useRef(new Vector3());

  useFrame(() => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    // Read configurable settings
    const { movementSpeed, sprintMultiplier, jumpForce } = useLabSettings.getState();

    // Always keep camera synced to physics body position
    const pos = rb.translation();
    camera.position.set(pos.x, pos.y + 0.8, pos.z);

    if (frozen) {
      // Kill horizontal velocity while paused
      const v = rb.linvel();
      rb.setLinvel({ x: 0, y: v.y, z: 0 }, true);
      return;
    }

    const { forward, backward, left, right, jump, sprint } = get();
    const vel = rb.linvel();

    // Check if any movement key is pressed
    const isMoving = forward || backward || left || right;

    if (!isMoving) {
      // No input → stop horizontal movement immediately (prevents drift)
      rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
    } else {
      // Calculate movement direction
      const speed = sprint ? movementSpeed * sprintMultiplier : movementSpeed;
      const front = frontV.current;
      const side = sideV.current;
      const dir = moveDir.current;

      // Front/back: negative Z = forward in Three.js
      front.set(0, 0, (backward ? 1 : 0) - (forward ? 1 : 0));
      // Left/right: positive X = right
      side.set((right ? 1 : 0) - (left ? 1 : 0), 0, 0);

      dir.copy(front).add(side);

      // Normalize to prevent faster diagonal movement, then apply speed
      if (dir.lengthSq() > VELOCITY_DEAD_ZONE) {
        dir.normalize().multiplyScalar(speed);
        // Rotate direction by camera's Y rotation only (horizontal plane)
        dir.applyEuler(camera.rotation);
        // Zero out any vertical component from camera pitch
        dir.y = 0;

        rb.setLinvel({ x: dir.x, y: vel.y, z: dir.z }, true);
      } else {
        rb.setLinvel({ x: 0, y: vel.y, z: 0 }, true);
      }
    }

    // Jump — only when grounded (raycast down)
    if (jump) {
      const origin = rb.translation();
      const ray = world.castRay(
        {
          origin: { x: origin.x, y: origin.y, z: origin.z },
          dir: { x: 0, y: -1, z: 0 },
        } as any,
        1.1,
        true
      );
      if (ray) {
        rb.setLinvel({ x: vel.x, y: jumpForce, z: vel.z }, true);
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      type="dynamic"
      position={[0, 3, 0]}
      enabledRotations={[false, false, false]}
      linearDamping={0.5}
      friction={1}
    >
      <CapsuleCollider args={[0.75, 0.35]} />
    </RigidBody>
  );
};
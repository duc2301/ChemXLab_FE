import { useKeyboardControls, PointerLockControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, Object3D } from 'three';
import type { ControlsState } from '../models/controls';

const MOVEMENT_SPEED = 4; // units per second

export const FreeCameraController = () => {
  const [, get] = useKeyboardControls<ControlsState>();
  const { camera } = useThree();

  // Invisible player capsule / pivot that represents the character
  const playerRef = useRef<Object3D | null>(null);

  // tmp vectors to avoid allocations
  const forwardVec = new Vector3();
  const rightVec = new Vector3();
  const moveVec = new Vector3();

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const { forward, backward, left, right, up, down } = get();

    // Calculate horizontal forward direction from camera (ignore pitch)
    camera.getWorldDirection(forwardVec);
    forwardVec.y = 0;
    forwardVec.normalize();

    // Right vector (horizontal)
    rightVec.crossVectors(forwardVec, camera.up).normalize();

    // Compose movement from keyboard input (WASD) — strafing left/right, moving forward/back
    moveVec.set(0, 0, 0);
    if (forward) moveVec.add(forwardVec);
    if (backward) moveVec.sub(forwardVec);
    if (right) moveVec.add(rightVec);
    if (left) moveVec.sub(rightVec);

    // Horizontal movement (WASD) — keep controlling X/Z directly
    if (moveVec.lengthSq() > 0) {
      moveVec.normalize().multiplyScalar(MOVEMENT_SPEED * delta);
      playerRef.current.position.add(moveVec);
    }

    // Jump: request an impulse from the Physics system rather than directly setting Y
    if (up) {
      // Only request jump if grounded
      if (playerRef.current.userData.grounded) {
        playerRef.current.userData.jump = true;
        // optional custom jump velocity
        playerRef.current.userData.jumpVelocity = 5;
      }
    }

    // Always sync camera to player head (so gravity affects view)
    const headOffset = 2.2;
    camera.position.copy(playerRef.current.position).add(new Vector3(0, headOffset, 0));
  });

  return (
    <>
      <PointerLockControls makeDefault selector="#r3f-canvas" />

      {/* Invisible player pivot (keeps position and can cast/receive if needed) */}
      <mesh
        ref={playerRef as any}
        position={[0, 0, 0]}
        visible={false}
        // enable physics for this object (gravity + ground collision)
        onUpdate={(self) => {
          self.userData.physics = true;
          self.userData.heightOffset = 0; // player's feet at object.position.y
          self.userData.kinematic = false;
        }}
      >
        <capsuleGeometry args={[0.35, 1.0, 4, 8]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </>
  );
};
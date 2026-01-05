import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3, Object3D } from 'three';

interface PhysicsProps {
  gravity?: number; // positive value, m/s^2
  groundY?: number;
}

// Lightweight scene-wide physics: applies gravity to objects with `userData.physics = true`.
export const Physics = ({ gravity = 9.8, groundY = 0 }: PhysicsProps) => {
  const { scene } = useThree();

  // store per-object velocities
  const velocities = useRef(new WeakMap<Object3D, Vector3>());

  useFrame((_, delta) => {
    // traverse scene and apply physics only to nodes explicitly marked
    scene.traverse((obj) => {
      if (!obj.userData || !obj.userData.physics) return;

      let vel = velocities.current.get(obj as Object3D);
      if (!vel) {
        vel = new Vector3();
        velocities.current.set(obj as Object3D, vel);
      }

      // Handle jump requests (impulse)
      if (obj.userData.jump) {
        const jumpVel = typeof obj.userData.jumpVelocity === 'number' ? obj.userData.jumpVelocity : 5;
        vel.y = jumpVel;
        obj.userData.jump = false;
        obj.userData.grounded = false;
      }

      // If object is kinematic, skip gravity integration (kinematic can still be moved externally)
      if (obj.userData.kinematic) {
        // ensure grounded flag consistent when exactly on ground
        if (obj.position.y <= groundY + (obj.userData.heightOffset || 0) + 1e-4) {
          obj.userData.grounded = true;
        }
        return;
      }

      // Integrate gravity
      if (!obj.userData.grounded) {
        vel.y -= gravity * delta;
      }

      // Integrate position
      obj.position.y += vel.y * delta;

      // Ground collision
      const minY = groundY + (obj.userData.heightOffset || 0);
      if (obj.position.y <= minY) {
        obj.position.y = minY;
        vel.y = 0;
        obj.userData.grounded = true;
      } else {
        obj.userData.grounded = false;
      }
    });
  });

  return null;
};

export default Physics;

import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useMemo } from 'react';
import { Mesh, Object3D } from 'three';

export type PhysicsModelProps = Omit<ThreeElements['group'], 'ref'> & {
  path: string;
  isStatic?: boolean;
  children?: React.ReactNode; // For manual colliders (CuboidCollider, etc.)
};

/**
 * Loads a GLB model and wraps it in a RigidBody.
 * Colliders are NOT auto-generated (Rapier 2.x can't traverse <primitive>).
 * Pass <CuboidCollider> children manually for collision.
 */
export const PhysicsModel = ({
  path,
  isStatic = true,
  children,
  ...props
}: PhysicsModelProps) => {
  const { scene } = useGLTF(path);

  const visualScene = useMemo(() => {
    const clone = scene.clone();
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);
    clone.updateMatrixWorld(true);

    clone.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <RigidBody
      {...props}
      type={isStatic ? 'fixed' : 'dynamic'}
      colliders={false}
    >
      <primitive object={visualScene} />
      {children}
    </RigidBody>
  );
};
import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { useMemo } from 'react';
import { Mesh } from 'three';

type GenericModelProps = ThreeElements['group'] & {
  path: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

export const GenericModel = ({ 
  path, 
  castShadow = true, 
  receiveShadow = true, 
  ...props 
}: GenericModelProps) => {
  const { scene } = useGLTF(path);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    clone.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });
    
    return clone;
  }, [scene, castShadow, receiveShadow]);

  return <primitive object={clonedScene} {...props} />;
};
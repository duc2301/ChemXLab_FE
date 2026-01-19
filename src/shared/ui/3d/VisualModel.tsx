// shared/ui/3d/VisualModel.tsx
import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { useMemo, forwardRef } from 'react';
import { Mesh, Material, Group, Object3D } from 'three';

export type VisualModelProps = Omit<ThreeElements['group'], 'ref'> & {
  path: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  customMaterial?: Material;
  onProcessMesh?: (mesh: Mesh) => void;
};

export const VisualModel = forwardRef<Group, VisualModelProps>(({
  path,
  castShadow = true,
  receiveShadow = true,
  customMaterial,
  onProcessMesh,
  ...props
}, ref) => {
  const { scene } = useGLTF(path);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;

        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;

        if (customMaterial) {
          mesh.material = customMaterial;
        }

        if (onProcessMesh) {
          onProcessMesh(mesh);
        }
      }
    });

    return clone;
  }, [scene, castShadow, receiveShadow, customMaterial, onProcessMesh]);

  return <primitive object={clonedScene} ref={ref} {...props} />;
});

VisualModel.displayName = 'VisualModel';
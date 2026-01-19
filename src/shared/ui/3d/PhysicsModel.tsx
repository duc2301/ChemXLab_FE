import { RigidBody, type RigidBodyProps, MeshCollider } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { Mesh, Object3D, BufferGeometry } from 'three';
import type { ThreeElements } from '@react-three/fiber';

export type PhysicsModelProps = Omit<ThreeElements['group'], 'ref'> & {
  path: string;
  physicsProps?: RigidBodyProps;
  isStatic?: boolean;
  colliders?: 'trimesh' | 'hull' | 'cuboid' | 'ball' | false;
  debug?: boolean;
};

export const PhysicsModel = ({
  path,
  physicsProps,
  colliders = 'hull',
  isStatic = true,
  debug = false,
  ...props
}: PhysicsModelProps) => {
  // Sử dụng cú pháp mới không deprecated
  const { scene } = useGLTF(path);

  const { visualScene, colliderGeometries } = useMemo(() => {
    const clone = scene.clone();
    
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);
    clone.updateMatrixWorld(true);

    const geometries: BufferGeometry[] = [];

    clone.traverse((child: Object3D) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.geometry && colliders !== false) {
          if (!mesh.geometry.attributes.position || mesh.geometry.attributes.position.count === 0) return;

          try {
            const geo = mesh.geometry.clone();
            geo.applyMatrix4(mesh.matrixWorld);

            if (!geo.index) {
              const posCount = geo.attributes.position.count;
              const indices = new Array(posCount);
              for(let i = 0; i < posCount; i++) indices[i] = i;
              geo.setIndex(indices);
            }

            // Kiểm tra geometry hợp lệ
            if (geo.attributes.position.count > 0) {
              geometries.push(geo);
            }
          } catch (error) {
            console.error('Error processing mesh geometry:', error);
          }
        }
      }
    });

    return { visualScene: clone, colliderGeometries: geometries };
  }, [scene, colliders]);

  // Nếu không có geometry hợp lệ, không tạo collider
  if (colliderGeometries.length === 0 && colliders !== false) {
    console.warn(`No valid geometry found for colliders in model: ${path}`);
  }

  return (
    <RigidBody
      {...props}
      type={physicsProps?.type || (isStatic ? 'fixed' : 'dynamic')}
      colliders={false}
      {...physicsProps}
    >
      <primitive object={visualScene} />
      
      {/* Chỉ tạo collider nếu có geometry và collider type hợp lệ */}
      {(colliders === 'trimesh' || colliders === 'hull') && 
        colliderGeometries.length > 0 &&
        colliderGeometries.map((geo, index) => (
          <MeshCollider key={index} type={colliders}>
            <bufferGeometry {...geo} />
          </MeshCollider>
        ))
      }
    </RigidBody>
  );
};
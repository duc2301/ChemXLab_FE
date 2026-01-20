import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

interface ProximityHook {
  isNearby: boolean;
  distance: number;
  canInteract: boolean;
}

export const useProximityDetection = (
  targetPosition: [number, number, number],
  detectionRadius: number = 3,
  onEnter?: () => void,
  onExit?: () => void,
  onInteract?: (key: string) => void
): ProximityHook => {
  const { camera } = useThree();
  const [isNearby, setIsNearby] = useState(false);
  const [distance, setDistance] = useState(Infinity);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger F key if nearby
      if (event.code === 'KeyF' && isNearby) {
        event.preventDefault();
        onInteract?.('F');
      }
    };

    if (isNearby) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNearby, onInteract]);

  // Update proximity every frame
  useEffect(() => {
    const interval = setInterval(() => {
      const cameraPos = new Vector3(camera.position.x, camera.position.y, camera.position.z);
      const targetPos = new Vector3(...targetPosition);
      const dist = cameraPos.distanceTo(targetPos);

      setDistance(dist);

      const wasNearby = isNearby;
      const nowNearby = dist < detectionRadius;

      if (nowNearby && !wasNearby) {
        onEnter?.();
        setIsNearby(true);
      } else if (!nowNearby && wasNearby) {
        onExit?.();
        setIsNearby(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [camera, targetPosition, detectionRadius, isNearby, onEnter, onExit]);

  return {
    isNearby,
    distance,
    canInteract: isNearby && distance < detectionRadius,
  };
};

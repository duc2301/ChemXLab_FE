/**
 * Proximity detector - Hiển thị khi người chơi gần bàn
 */
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Vector3 } from 'three';

interface ProximityDetectorProps {
  tablePosition: [number, number, number];
  detectionRadius?: number;
  onEnterProximity?: () => void;
  onExitProximity?: () => void;
  onInteract?: () => void;
}

export const ProximityDetector = ({
  tablePosition,
  detectionRadius = 3,
  onEnterProximity,
  onExitProximity,
  onInteract,
}: ProximityDetectorProps) => {
  const { camera } = useThree();
  const isNearbyRef = useRef(false);
  const targetPosRef = useRef(new Vector3(...tablePosition));
  const cameraPosRef = useRef(new Vector3());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyF' && isNearbyRef.current) {
        event.preventDefault();
        onInteract?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInteract]);

  useFrame(() => {
    cameraPosRef.current.copy(camera.position);
    const distance = cameraPosRef.current.distanceTo(targetPosRef.current);
    const wasNearby = isNearbyRef.current;
    const isNowNearby = distance < detectionRadius;

    if (isNowNearby && !wasNearby) {
      isNearbyRef.current = true;
      onEnterProximity?.();
    } else if (!isNowNearby && wasNearby) {
      isNearbyRef.current = false;
      onExitProximity?.();
    }
  });

  return null;
};

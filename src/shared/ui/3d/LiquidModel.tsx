import { useMemo } from 'react';
import { MeshPhysicalMaterial, DoubleSide } from 'three';
import { VisualModel, type VisualModelProps } from './VisualModel';

export type LiquidModelProps = VisualModelProps & {
  color?: string;
  ior?: number;
  opacity?: number;
};

export const LiquidModel = ({ 
  color = '#a5d8ff', 
  ior = 1.33, 
  opacity = 1,
  ...props 
}: LiquidModelProps) => {

  const liquidMaterial = useMemo(() => {
    return new MeshPhysicalMaterial({
      color: color,
      transmission: 1,
      opacity: opacity,
      metalness: 0,
      roughness: 0,
      ior: ior,
      thickness: 1.5,
      side: DoubleSide,
      transparent: true,
    });
  }, [color, ior, opacity]);

  return (
    <VisualModel
      {...props} 
      customMaterial={liquidMaterial} 
    />
  );
};
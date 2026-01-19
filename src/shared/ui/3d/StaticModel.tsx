import { forwardRef } from "react";
import { VisualModel, type VisualModelProps } from "./VisualModel";
import { Group } from "three";



export const StaticModel = forwardRef<Group, VisualModelProps>((props, ref) => {
  return (
    <VisualModel
      ref={ref}
      {...props} 
      onProcessMesh={(mesh) => {
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix(); 
      }}
    />
  );
});

StaticModel.displayName = "StaticModel";
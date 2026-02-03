import { forwardRef } from "react";
import { Group } from "three";
import { VisualModel, type VisualModelProps } from "./VisualModel";



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
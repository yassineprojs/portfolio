import { useThree } from "@react-three/fiber";
import { createContext, useState, useContext } from "react";

export const CameraContext = createContext();
// export const useCamera = () => useContext(CameraContext);

export function CameraProvider({ children }) {
  const { camera } = useThree();
  return (
    <CameraContext.Provider value={camera}>{children}</CameraContext.Provider>
  );
}

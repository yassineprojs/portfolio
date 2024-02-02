import {
  OrbitControls,
  PivotControls,
  Sky,
  TransformControls,
  ScreenSpace,
  Box,
  Hud,
  Html,
} from "@react-three/drei";
import Room from "./Room";

import { useRef, forwardRef } from "react";

import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { Cube } from "./components/Cubes";

export default function Experience({ onMeshClick, onBoardClick }) {
  return (
    <>
      <Perf position="top-left" />
      <color args={["#ececec"]} attach="background"></color>
      <OrbitControls />
      <ambientLight intensity={1} />
      <Room onMeshClick={onMeshClick} onBoardClick={onBoardClick} />
      <Cube />
    </>
  );
}

import { OrbitControls } from "@react-three/drei";
import Room from "./Room.jsx";
import { Perf } from "r3f-perf";

export default function Experience({
  onMeshClick,
  onHintClick,
  visible,
  gameWon,
}) {
  return (
    <>
      <Perf position="top-left" />
      <color args={["#ececec"]} attach="background"></color>
      <OrbitControls />
      <ambientLight intensity={1} />
      <Room
        onMeshClick={onMeshClick}
        onHintClick={onHintClick}
        visibleCube={visible}
        gameWon={gameWon}
      />
    </>
  );
}

import { useFrame, useThree } from "@react-three/fiber";
import { Room, Floor2 } from "./Room";
import { Perf } from "r3f-perf";

export default function Experience({
  onMeshClick,
  onHintClick,
  visible,
  gameWon,
}) {
  // const { camera } = useThree();
  // const cameraPosition = camera.position;

  // useFrame(() => {
  //   console.log(cameraPosition);
  // });

  return (
    <>
      <Perf position="top-left" />
      <color args={["#ececec"]} attach="background"></color>

      <ambientLight intensity={1} />
      <Room
        onMeshClick={onMeshClick}
        onHintClick={onHintClick}
        visibleCube={visible}
        gameWon={gameWon}
      />
      <Floor2 />
    </>
  );
}

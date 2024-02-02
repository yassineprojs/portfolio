import React, { useRef, useCallback, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { easings } from "@react-spring/web";
import { useFrame } from "@react-three/fiber";

// const rotations = [
//   { x: 0, y: Math.PI / 2, z: 0 },
//   { x: 0, y: Math.PI, z: 0 },
//   { x: 0, y: 1.5 * Math.PI, z: 0 },
//   { x: Math.PI / 2, y: 0, z: 0 },
//   { x: Math.PI, y: 0, z: 0 },
// ];

export function Cube(props) {
  const group = useRef();
  const cubeRef = useRef();

  const { nodes, materials, animations } = useGLTF(
    "./models/cubes/letters.glb"
  );
  console.log(animations);

  //   const [springProps, setSpring] = useSpring(
  //     () => ({
  //       cubeRotation: { x: 0, y: 0, z: 0 },
  //       config: {
  //         mass: 2,
  //         tension: 250,
  //         friction: 30,
  //       },
  //     }),
  //     []
  //   );

  //   const handleMeshClick = () => {
  //     setSpring((prevState) => {
  //       const currentRotation = prevState.cubeRotation;
  //       const nextRotationIndex =
  //         (rotations.indexOf(currentRotation) + 1) % rotations.length;
  //       const nextRotation = rotations[nextRotationIndex];

  //       return { cubeRotation: nextRotation };
  //     }).start();
  //   };

  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={0.2} name="Scene">
        <mesh
          ref={cubeRef}
          name="cfy?ba"
          position={[0, 10, -8]}
          geometry={nodes["cfy?ba"].geometry}
          material={materials["cfy?ba"]}
          //   onClick={handleMeshClick}
          //   rotation={springProps.cubeRotation}
        ></mesh>
        <mesh
          name="ehmpil"
          position={[0, 10, -4]}
          geometry={nodes.ehmpil.geometry}
          material={materials.ehmpil}
        />
        <mesh
          name="nqadgj"
          position={[0, 10, 0]}
          geometry={nodes.nqadgj.geometry}
          material={materials.nqadgj}
        />
        <mesh
          name="uosvrp"
          position={[0, 10, 4]}
          geometry={nodes.uosvrp.geometry}
          material={materials.uosvrp}
        />
        <mesh
          name="tkhzwn"
          position={[0, 10, 8]}
          geometry={nodes.tkhzwn.geometry}
          material={materials.tkhzwn}
        />
      </group>
    </group>
  );
}

useGLTF.preload("./models/cubes/letters.glb");

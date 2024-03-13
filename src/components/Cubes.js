import React, { useState } from "react";
import { useGLTF, useCursor } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";

export function Cube(props) {
  const { nodes, materials } = useGLTF("./models/cubes/letters.glb");
  const [cubeHovered, setHovered] = useState();
  useCursor(cubeHovered);

  // Create a state for each mesh's rotation and position
  const [meshStates, setMeshStates] = useState({
    "cfy?ba": { rotation: [0, 0, 0], position: [0, 2, -2] },
    ehmpil: { rotation: [0, 0, 0], position: [0, 2, -1] },
    nqadgj: { rotation: [0, 0, 0], position: [0, 2, 0] },
    uosvrp: { rotation: [0, 0, 0], position: [0, 2, 1] },
    tkhzwn: { rotation: [0, 0, 0], position: [0, 2, 2] },
  });

  // Function to handle click and rotate the clicked mesh
  const handleClick = (name) => {
    setMeshStates((prevStates) => {
      const sequence = [
        { x: 0, y: Math.PI / 2, z: 0 }, // 90 degrees around Y
        { x: 0, y: Math.PI, z: 0 }, // 180 degrees around Y
        { x: 0, y: 1.5 * Math.PI, z: 0 }, // 270 degrees around Y
        { x: 0, y: 0, z: Math.PI / 2 }, // 90 degrees around X
        { x: 0, y: 0, z: Math.PI }, // 180 degrees around X
        { x: 0, y: 0, z: 1.5 * Math.PI }, // 270 degrees around X
        { x: 0, y: 0, z: 0 }, // back to initial position
      ];

      // Find the next rotation in the sequence for the clicked mesh
      const currentRotation = prevStates[name].rotation;
      const currentIndex = sequence.findIndex(
        (rot) => rot.y === currentRotation[1] && rot.z === currentRotation[2]
      );
      const nextIndex = (currentIndex + 1) % sequence.length;
      const nextRotation = sequence[nextIndex];

      return {
        ...prevStates,
        [name]: {
          ...prevStates[name],
          rotation: [nextRotation.x, nextRotation.y, nextRotation.z],
        },
      };
    });
  };

  return (
    <group {...props} dispose={null}>
      {Object.entries(meshStates).map(([name, { rotation, position }]) => {
        const [spring, api] = useSpring(() => ({
          rotation: rotation,
          position: position,
          config: { mass: 5, tension: 400, friction: 50 },
        }));

        // Update spring when state changes
        api.start({ rotation: rotation, position: position });

        return (
          <animated.mesh
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            scale={0.2}
            key={name}
            name={name}
            geometry={nodes[name].geometry}
            material={materials[name]}
            onClick={() => handleClick(name)}
            rotation={spring.rotation}
            position={spring.position}
          />
        );
      })}
    </group>
  );
}

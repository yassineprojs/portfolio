import React, { useState, useEffect, useRef } from "react";
import { useGLTF, useCursor } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { useControls } from "leva";
import { DissolveMaterial } from "./DissolveMaterial";
import * as THREE from "three";
import { audios, playAudio } from "../utils/AudioManager";

// Define the correct rotations for each letter for the game later
const correctRotations = {
  who: [0, 1.5 * Math.PI, 0],
  who2: [0, 1.5 * Math.PI, 0],
  who3: [0, 1.5 * Math.PI, 0],

  needs: [0, 1.5 * Math.PI, 0],
  needs2: [0, 1.5 * Math.PI, 0],
  needs3: [0, 1.5 * Math.PI, 0],
  needs4: [0, 1.5 * Math.PI, 0], //1
  needs5: [0, 1.5 * Math.PI, 0], //2
  magic: [0, 1.5 * Math.PI, 0], //4
  magic2: [0, 1.5 * Math.PI, 0],
  magic3: [0, 1.5 * Math.PI, 0],
  magic4: [0, 1.5 * Math.PI, 0], //3
  magic5: [0, 1.5 * Math.PI, 0],
  when: [0, 1.5 * Math.PI, 0],
  when2: [0, 1.5 * Math.PI, 0],
  when3: [0, 1.5 * Math.PI, 0],
  when4: [0, 1.5 * Math.PI, 0], //6
  you: [0, 1.5 * Math.PI, 0],
  you2: [0, 1.5 * Math.PI, 0],
  you3: [0, 1.5 * Math.PI, 0],
  can: [0, 1.5 * Math.PI, 0],
  can2: [0, 1.5 * Math.PI, 0],
  can3: [0, 1.5 * Math.PI, 0],
  make: [0, 1.5 * Math.PI, 0],
  make2: [0, 1.5 * Math.PI, 0],
  make3: [0, 1.5 * Math.PI, 0],
  make4: [0, 1.5 * Math.PI, 0],
  data: [0, 1.5 * Math.PI, 0],
  data2: [0, 1.5 * Math.PI, 0],
  data3: [0, 1.5 * Math.PI, 0],
  data4: [0, 1.5 * Math.PI, 0],
  disappear: [0, 1.5 * Math.PI, 0],
  disappear2: [0, 1.5 * Math.PI, 0],
  disappear3: [0, 1.5 * Math.PI, 0],
  disappear4: [0, 1.5 * Math.PI, 0],
  disappear5: [0, 1.5 * Math.PI, 0],
  disappear6: [0, 1.5 * Math.PI, 0],
  disappear7: [0, 1.5 * Math.PI, 0],
  disappear8: [0, 1.5 * Math.PI, 0],
  disappear9: [0, 1.5 * Math.PI, 0],
};

// Mapping of cubes to words
const wordGroups = {
  word1: ["who", "who2", "who3"],
  word2: ["needs", "needs2", "needs3", "needs4", "needs5"],
  word3: ["magic", "magic2", "magic3", "magic4", "magic5"],
  word4: ["when", "when2", "when3", "when4"],
  word5: ["you", "you2", "you3"],
  word6: ["can", "can2", "can3"],
  word7: ["make", "make2", "make3", "make4"],
  word8: ["data", "data2", "data3", "data4"],
  word9: [
    "disappear",
    "disappear2",
    "disappear3",
    "disappear4",
    "disappear5",
    "disappear6",
    "disappear7",
    "disappear8",
    "disappear9",
  ],
};

export function Cube({ visible, onAllWordsCompleted }) {
  const { nodes } = useGLTF("./models/cubes/letters3.glb");

  const [cubeHovered, setHovered] = useState(false);

  const [completedWords, setCompletedWords] = useState({});
  const [dissolve, setDissolve] = useState(visible);
  useCursor(cubeHovered);

  // Initialized meshStates with a function to ensure nodes are loaded
  const [meshStates, setMeshStates] = useState(() => {
    const initialState = {};
    Object.keys(nodes).forEach((key) => {
      if (
        key.startsWith("can") ||
        key.startsWith("data") ||
        key.startsWith("when") ||
        key.startsWith("who") ||
        key.startsWith("disappear") ||
        key.startsWith("magic") ||
        key.startsWith("make") ||
        key.startsWith("needs") ||
        key.startsWith("you")
      ) {
        initialState[key] = { rotation: [0, 0, 0] }; // setted initial rotation to zero
      }
    });
    return initialState;
  });

  // Function to handle click and rotate the clicked mesh
  const handleClick = (name) => {
    setMeshStates((prevStates) => {
      //  rotation sequence
      const sequence = [
        [0, Math.PI / 2, 0], // 90 degrees around Y
        [0, Math.PI, 0], // 180 degrees around Y
        [0, 1.5 * Math.PI, 0], // 270 degrees around Y
        [0, 0, Math.PI / 2], // 90 degrees around X
        [0, 0, Math.PI], // 180 degrees around X
        [0, 0, 1.5 * Math.PI], // 270 degrees around X
        [0, 0, 0], //initial rotation
      ];

      //  the next rotation in the sequence
      const currentRotation = prevStates[name].rotation;
      const currentIndex = sequence.findIndex((rot) =>
        rot.every((val, index) => val === currentRotation[index])
      );
      const nextIndex = (currentIndex + 1) % sequence.length;
      const nextRotation = sequence[nextIndex];

      // Function to check if the cube's rotation matches the correct letter's rotation
      const isCorrectLetter = (cubeName, rotation) => {
        return rotation.every(
          (val, index) => val === correctRotations[cubeName][index]
        );
      };

      // the new state with the next rotation
      const newState = {
        ...prevStates,
        [name]: {
          rotation: nextRotation,
        },
      };

      // Check if the word is correct using the new state
      const isWordCorrect = (word, state) => {
        return wordGroups[word].every((cube) => {
          const rotation = state[cube].rotation;
          return isCorrectLetter(cube, rotation);
        });
      };

      // Check if the word is correct and update completedWords state
      Object.keys(wordGroups).forEach((word) => {
        if (isWordCorrect(word, newState) && !completedWords[word]) {
          playAudio(audios.win_word);
          setCompletedWords((prevWords) => {
            const updatedWords = {
              ...prevWords,
              [word]: true,
            };

            // Check if all words are completed after updating
            const allWordsCompleted = Object.keys(wordGroups).every(
              (w) => updatedWords[w]
            );

            if (allWordsCompleted) {
              setDissolve(false);
              setTimeout(() => {
                onAllWordsCompleted(true);
              }, 800);
            }

            return updatedWords;
          });
        }
      });

      return newState;
    });
  };
  //render only when hitn paper clicked
  // const [render, setRender] = useState(shouldRender);

  // const [renderCubes,setRenderCubes]=useState(false)

  // useEffect(() => {
  //   if (shouldRender) {
  //     setRender(true);
  //   }
  // }, [shouldRender]);

  useEffect(() => {
    setDissolve(visible); // Set dissolve to match visibility
  }, [visible]);

  return (
    <group dispose={null} position={[0, 0, 0]}>
      {Object.entries(meshStates).map(([name, { rotation }]) => {
        const [spring, api] = useSpring(() => ({
          rotation,
          config: { mass: 5, tension: 400, friction: 50 },
        }));

        // Update spring when state changes
        api.start({ rotation });
        const boxMaterial = nodes[name].material;

        // return (
        return visible ? (
          <animated.mesh
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            key={name}
            name={name}
            geometry={nodes[name]?.geometry}
            onClick={() => handleClick(name)}
            rotation={spring.rotation}
            position={nodes[name]?.position}
          >
            <DissolveMaterial
              baseMaterial={boxMaterial}
              visible={dissolve}
              color="#ADFF2F"
            />
          </animated.mesh>
        ) : // );
        null;
      })}
    </group>
  );
}

// const correctRotations = {
//   who: [0, 0, Math.PI / 2],
//   who: [0, 1.5 * Math.PI, 0],
//   who2: [0, 1.5 * Math.PI, 0],
//   who3: [0, Math.PI / 2, 0],

//   needs: [0, 0, 1.5 * Math.PI],
//   needs2: [0, 0, Math.PI / 2],
//   needs3: [0, 0, Math.PI / 2],
//   needs4: [0, Math.PI / 2, 0], //1
//   needs5: [0, Math.PI, 0], //2
//   magic: [0, 0, Math.PI / 2], //4
//   magic2: [0, 0, Math.PI / 2],
//   magic3: [0, Math.PI / 2, 0],
//   who3: [0, 1.5 * Math.PI, 0],

//   needs: [0, 1.5 * Math.PI, 0],
//   needs2: [0, 1.5 * Math.PI, 0],
//   needs3: [0, 1.5 * Math.PI, 0],
//   needs4: [0, 1.5 * Math.PI, 0], //1
//   needs5: [0, 1.5 * Math.PI, 0], //2
//   magic: [0, 1.5 * Math.PI, 0], //4
//   magic2: [0, 1.5 * Math.PI, 0],
//   magic3: [0, 1.5 * Math.PI, 0],
//   magic4: [0, 1.5 * Math.PI, 0], //3
//   magic5: [0, 0, Math.PI / 2],
//   when: [0, 0, Math.PI / 2],
//   magic5: [0, 1.5 * Math.PI, 0],
//   when: [0, 1.5 * Math.PI, 0],
//   when2: [0, 1.5 * Math.PI, 0],
//   when3: [0, 0, Math.PI / 2],
//   when4: [0, 0, 1.5 * Math.PI], //6
//   you: [0, 0, 1.5 * Math.PI],
//   you2: [0, Math.PI / 2, 0],
//   you3: [0, Math.PI / 2, 0],
//   can: [0, 0, Math.PI / 2],
//   can2: [0, 0, Math.PI / 2],
//   can3: [0, 0, 1.5 * Math.PI],
//   make: [0, 0, Math.PI / 2],
//   make2: [0, 0, Math.PI / 2],
//   make3: [0, Math.PI, 0],
//   make4: [0, 0, Math.PI / 2],
//   data: [0, Math.PI / 2, 0],
//   data2: [0, 0, Math.PI / 2],
//   data3: [0, Math.PI, 0],
//   data4: [0, 0, Math.PI / 2],
//   disappear: [0, Math.PI / 2, 0],
//   when3: [0, 1.5 * Math.PI, 0],
//   when4: [0, 1.5 * Math.PI, 0], //6
//   you: [0, 1.5 * Math.PI, 0],
//   you2: [0, 1.5 * Math.PI, 0],
//   you3: [0, 1.5 * Math.PI, 0],
//   can: [0, 1.5 * Math.PI, 0],
//   can2: [0, 1.5 * Math.PI, 0],
//   can3: [0, 1.5 * Math.PI, 0],
//   make: [0, 1.5 * Math.PI, 0],
//   make2: [0, 1.5 * Math.PI, 0],
//   make3: [0, 1.5 * Math.PI, 0],
//   make4: [0, 1.5 * Math.PI, 0],
//   data: [0, 1.5 * Math.PI, 0],
//   data2: [0, 1.5 * Math.PI, 0],
//   data3: [0, 1.5 * Math.PI, 0],
//   data4: [0, 1.5 * Math.PI, 0],
//   disappear: [0, 1.5 * Math.PI, 0],
//   disappear2: [0, 1.5 * Math.PI, 0],
//   disappear3: [0, Math.PI, 0],
//   disappear4: [0, 0, Math.PI / 2],
//   disappear3: [0, 1.5 * Math.PI, 0],
//   disappear4: [0, 1.5 * Math.PI, 0],
//   disappear5: [0, 1.5 * Math.PI, 0],
//   disappear6: [0, 1.5 * Math.PI, 0],
//   disappear7: [0, 0, Math.PI / 2],
//   disappear8: [0, 0, Math.PI / 2],
//   disappear9: [0, Math.PI, 0],
//   disappear7: [0, 1.5 * Math.PI, 0],
//   disappear8: [0, 1.5 * Math.PI, 0],
//   disappear9: [0, 1.5 * Math.PI, 0],
// };

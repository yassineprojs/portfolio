import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { useEffect, useRef, useState } from "react";
import Mascott from "./components/Mascott.jsx";
import { Cube } from "./components/Cubes.jsx";
import Instructs from "./components/gameInstucts.jsx";
import { Character } from "./components/Character.jsx";
import {
  Center,
  FirstPersonControls,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import gsap from "gsap";

function CustomFirstPersonControls(props) {
  const controls = useRef();
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const [currentCamPosition, setCurrentCamPosition] = useState(0);
  const cameraPositions = [
    { x: -0.446, y: -0.342, z: 0.032 },
    { x: 0.95, y: -0.72, z: 0.665 },
    { x: 0.82, y: -0.37, z: 1.67 },
    { x: 0.906, y: 0.00023, z: 0.237 },
    { x: 0.851, y: -0.217, z: -0.03 },
  ];
  const cameraRotations = [
    { x: -0.494, y: -0.893, z: -0.397 },
    { x: -2.44, y: -1.293, z: -2.465 },
    { x: -3.06, y: -0.55, z: -3.099 },
    { x: 0.29, y: -0.66, z: -0.183 },
    { x: -1.39, y: -0.64, z: -1.28 },
  ];

  useEffect(() => {
    const onMouseUp = () => {
      const newPosition = cameraPositions[currentCamPosition];
      const newRotation = cameraRotations[currentCamPosition];

      if (newPosition && newRotation) {
        gsap.to(camera.position, { ...newPosition, duration: 2.3 });
        gsap.to(camera.rotation, { ...newRotation, duration: 2.3 });
        setCurrentCamPosition(
          (prevPosition) => (prevPosition + 1) % cameraPositions.length
        );
      }
    };

    domElement.addEventListener("mouseup", onMouseUp);
    return () => {
      domElement.removeEventListener("mouseup", onMouseUp);
    };
  }, [camera, currentCamPosition, domElement]);

  const moveState = useRef({ moving: false, lastMoveTime: 0 });
  const dampingFactor = 0.01;
  const timeout = 250; // Time in ms after which the rotation stops

  useFrame(() => {
    if (controls.current) {
      const timeSinceLastMove = Date.now() - moveState.current.lastMoveTime;
      if (moveState.current.moving && timeSinceLastMove > timeout) {
        controls.current.lookSpeed *= 1 - dampingFactor;
        if (controls.current.lookSpeed < 0.001) {
          controls.current.lookSpeed = 0;
          moveState.current.moving = false;
        }
      }
    }
  });

  useEffect(() => {
    const handleMouseMove = () => {
      if (controls.current) {
        controls.current.lookSpeed = props.lookSpeed;
        moveState.current.moving = true;
        moveState.current.lastMoveTime = Date.now();
      }
    };

    domElement.addEventListener("mousemove", handleMouseMove);

    return () => {
      domElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [props.lookSpeed, domElement]);

  return (
    <FirstPersonControls
      ref={controls}
      args={[camera, domElement]}
      {...props}
    />
  );
}

export default function Main(props) {
  const script = [
    {
      id: 1,
      text: "Hello, my name is Ahmed Yassine Meddeb",
      animation: "waving",
    },
    {
      id: 2,
      text: "This is my portfolio",

      animation: "talking",
    },
    {
      id: 3,
      text: "follow the directions, explore the room, and find the hidden indices",
      animation: "talking2",
    },
    {
      id: 4,
      text: "start with the pc, Good luck",
      animation: "Idle",
    },
  ];

  // overlay box states
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isSpeechBoxVisible, setIsSpeechBoxVisible] = useState(false);
  const [isMascotVisible, setIsMascotVisible] = useState(false);

  // text box for cubes states
  const [isCubeVisible, setIsCubeVisible] = useState(false);
  const [currentBoxTextIndex, setCurrentBoxTextIndex] = useState(0);
  const [boxCubeVisible, setBoxCubeVisible] = useState(isCubeVisible);
  const [isGameWon, setIsGameWon] = useState(false);

  const handleOverlayClick = () => {
    setIsSpeechBoxVisible(false);
    setTimeout(() => {
      setIsOverlayVisible(false);
    }, 500);
  };

  const handleNextButtonClick = () => {
    if (currentTextIndex < script.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      setIsSpeechBoxVisible(false);
      setTimeout(() => {
        setIsOverlayVisible(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (isOverlayVisible) {
      // show mascott first
      setTimeout(() => {
        setIsMascotVisible(true);
      }, 500);
      // show text
      setTimeout(() => {
        setIsSpeechBoxVisible(true);
      }, 1000);
    }
  }, [isOverlayVisible]);

  const handleHintClick = () => {
    setBoxCubeVisible(true);
    setIsCubeVisible((prev) => !prev); // Toggle visibility
  };

  const handleNextBoxButtonClick = () => {
    if (currentBoxTextIndex < script.length + 1) {
      setCurrentBoxTextIndex(currentBoxTextIndex + 1);
    } else {
      setBoxCubeVisible(false);
      setTimeout(() => {}, 500);
    }
  };

  const handleSkipBoxClick = () => {
    setBoxCubeVisible(false);
  };

  return (
    <>
      <Canvas
        camera={{
          fov: 60,
          near: 0.1,
          far: 200,
          position: [-0.942, -0.5, 0.41],
          // rotation: [1.125, -1.2, -1.107],
        }}
      >
        {/* <OrbitControls /> */}

        <CustomFirstPersonControls
          lookSpeed={0.05}
          movementSpeed={0}
          noFly={true}
          activeLook={true}
          autoForward={false}
        />
        <Center>
          <color attach="background" args={["#DFF5FF"]} />
          <Experience
            onMeshClick={() => setIsOverlayVisible(true)}
            onHintClick={handleHintClick}
            visible={isCubeVisible}
            gameWon={isGameWon}
          />

          <Cube visible={isCubeVisible} onAllWordsCompleted={setIsGameWon} />
        </Center>
      </Canvas>

      {boxCubeVisible && (
        <div
          style={{
            opacity: isCubeVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <Instructs
            nextClick={handleNextBoxButtonClick}
            skipClick={handleSkipBoxClick}
            nextText={currentBoxTextIndex}
          />
        </div>
      )}

      {isOverlayVisible && (
        <div
          className="overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 88,
            opacity: isSpeechBoxVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          {isSpeechBoxVisible && (
            <div className="speachBox">
              <button className="skipBTn" onClick={handleOverlayClick}>
                Skip
              </button>
              <div className="textPart">{script[currentTextIndex].text}</div>
              <button className="nextBtn" onClick={handleNextButtonClick}>
                Next
              </button>
            </div>
          )}
          {isMascotVisible && (
            <Canvas>
              <Character
                position={[-5.54, -1.44, -1.44]}
                rotation={[0.25, 0.77, -0.11]}
                scale={1.3}
                animation={script[currentTextIndex].animation}
              />
              <ambientLight />
            </Canvas>
          )}
        </div>
      )}
    </>
  );
}

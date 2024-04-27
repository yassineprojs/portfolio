import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { useEffect, createContext, useContext, useRef, useState } from "react";
import Mascott from "./components/Mascott.jsx";
import { Cube } from "./components/Cubes.jsx";
import Instructs from "./components/gameInstucts.jsx";
import { Character } from "./components/Character.jsx";
import {
  Center,
  FirstPersonControls,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import gsap from "gsap";

// Create a Camera Context
const CameraContext = createContext();

// Custom Hook to manage camera animations
const useCameraAnimations = (camera, positions) => {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

  const animateCamera = (newPosition) => {
    gsap.to(camera.position, { ...newPosition, duration: 2.3 });
  };

  const goToNextPosition = () => {
    const nextPositionIndex = (currentPositionIndex + 1) % positions.length;
    animateCamera(positions[nextPositionIndex]);
    setCurrentPositionIndex(nextPositionIndex);
  };

  const goToPreviousPosition = () => {
    const prevPositionIndex =
      (currentPositionIndex - 1 + positions.length) % positions.length;
    animateCamera(positions[prevPositionIndex]);
    setCurrentPositionIndex(prevPositionIndex);
  };

  return { goToNextPosition, goToPreviousPosition };
};

function CustomFirstPersonControls(props) {
  const controlsRef = useRef();

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Provide the camera to the context
  const setCamera = useContext(CameraContext);
  useEffect(() => setCamera(camera), [camera, setCamera]);

  // const cameraRotations = [
  //   { x: -0.494, y: -0.893, z: -0.397 },
  //   { x: -2.44, y: -1.293, z: -2.465 },
  //   { x: -3.06, y: -0.55, z: -3.099 },
  //   { x: 0.29, y: -0.66, z: -0.183 },
  //   { x: -1.39, y: -0.64, z: -1.28 },
  // ];

  const moveState = useRef({ moving: false, lastMoveTime: 0 });
  const dampingFactor = 0.01;
  const timeout = 100; // Time in ms after which the rotation stops

  useFrame(() => {
    if (controlsRef.current) {
      const timeSinceLastMove = Date.now() - moveState.current.lastMoveTime;
      if (moveState.current.moving && timeSinceLastMove > timeout) {
        controlsRef.current.lookSpeed *= 1 - dampingFactor;
        if (controlsRef.current.lookSpeed < 0.001) {
          controlsRef.current.lookSpeed = 0;
          moveState.current.moving = false;
        }
      }
    }
  });

  useEffect(() => {
    const handleMouseMove = () => {
      if (controlsRef.current) {
        controlsRef.current.lookSpeed = props.lookSpeed;
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
    <>
      <FirstPersonControls
        ref={controlsRef}
        args={[camera, domElement]}
        {...props}
      />
    </>
  );
}

export default function Main(props) {
  // for cam animation
  const cameraPositions = [
    { x: -0.942, y: 0, z: 0.41 },
    { x: -0.446, y: -0.342, z: 0.032 },
    { x: 0.95, y: -0.72, z: 0.665 },
    { x: 0.82, y: -0.37, z: 1.67 },
    { x: 0.906, y: 0.00023, z: 0.237 },
    { x: 0.851, y: -0.217, z: -0.03 },
  ];
  const [camera, setCamera] = useState();
  const { goToNextPosition, goToPreviousPosition } = useCameraAnimations(
    camera,
    cameraPositions
  );

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
      <CameraContext.Provider value={setCamera}>
        <Canvas
          camera={{
            fov: 60,
            near: 0.1,
            far: 200,
            position: [-0.942, 0, 0.41],
          }}
        >
          {/* <OrbitControls /> */}

          <CustomFirstPersonControls
            lookSpeed={0.01}
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

        <div
          style={{
            position: "absolute",
            width: "95%",

            top: "50%",
            left: "50%",
            transform: "translate(-50%,50%)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <button onClick={goToPreviousPosition} className="cam_btn">
            <ion-icon name="caret-back-outline"></ion-icon>
          </button>
          <button onClick={goToNextPosition} className="cam_btn">
            <ion-icon name="caret-forward-outline"></ion-icon>
          </button>
        </div>
      </CameraContext.Provider>
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

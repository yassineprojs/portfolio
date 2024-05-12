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
  Loader,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import gsap from "gsap";
import { useLocation } from "./utils/LocationContext.jsx";
// import LoaderComponent from "./components/Loader.jsx";

// Creating a Camera Context
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

  // Providing the camera to the context
  const setCamera = useContext(CameraContext);
  useEffect(() => setCamera(camera), [camera, setCamera]);

  const moveState = useRef({ moving: false, lastMoveTime: 0 });
  const dampingFactor = 0.01;
  const timeout = 80; // Time in ms after which the rotation stops

  useFrame(() => {
    if (controlsRef.current) {
      // Enforcing the verticalMax constraint
      controlsRef.current.lat = Math.max(
        -props.verticalMax,
        Math.min(props.verticalMax, controlsRef.current.lat)
      );
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
  const { currentLocation } = useLocation();
  // for camera animations
  const cameraPositions = [
    { x: -0.942, y: 0, z: 0.41 },
    { x: -0.446, y: -0.342, z: 0.032 },
    { x: 0.95, y: -0.5, z: 0.665 },
    { x: 0.82, y: -0.37, z: 1.67 },

    { x: 0.906, y: 0.00023, z: 0.237 }, //tableau

    { x: 1.471, y: -0.12, z: 1.05 },
    { x: 1.478, y: -0.171, z: -0.278 },
    { x: 1.455, y: 0.301, z: -0.586 },

    { x: 0.851, y: -0.7, z: -0.03 },
  ];

  const [camera, setCamera] = useState();
  const { goToNextPosition, goToPreviousPosition } = useCameraAnimations(
    camera,
    cameraPositions
  );

  const script = [
    {
      id: 1,
      text: "Hello, my name is Ahmed Yassine Meddeb, i'm 23 years old and i'm majoring in computer engineering",
      animation: "waving",
    },
    {
      id: 2,
      text: "This is my portfolio, it combines my passion for web development and cyber security",

      animation: "talking",
    },
    {
      id: 3,
      text: "follow the directions, explore the room, and find the hidden indices and hopefully you'll get to know me better!😊",
      animation: "talking2",
    },
    {
      id: 4,
      text: "start with the pc, Good luck! ",
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
            verticalMax={22}
          />

          <Center>
            <color attach="background" args={["#DFF5FF"]} />
            <Experience
              onMeshClick={() => setIsOverlayVisible(true)}
              onHintClick={handleHintClick}
              visible={isCubeVisible}
              gameWon={isGameWon}
            />

            {/* uncomment if you want the lagging of cubes appearing removed and see cubes.jsx also */}
            {/* <Cube visible={isCubeVisible} onAllWordsCompleted={setIsGameWon} /> */}
            <Cube
              visible={isCubeVisible && !isGameWon}
              onAllWordsCompleted={setIsGameWon}
            />
          </Center>
        </Canvas>
        <Loader />
        {currentLocation === "room" && (
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
        )}
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

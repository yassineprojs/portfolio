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
// import { FirstPersonControls } from "three/examples/jsm/Addons.js";
// extend({ FirstPersonControls });
function CameraController() {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const isDragging = useRef(false);
  const movement = useRef({ x: 0, y: 0 });
  const dampingFactor = 0.002;
  const rotationSpeed = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    isDragging.current = true;
  };

  const onMouseMove = (e) => {
    if (isDragging.current) {
      const { x, y } = movement.current;
      movement.current = {
        x: e.movementX,
        y: e.movementY,
      };
      camera.position.x -= x * dampingFactor;
      camera.position.y += y * dampingFactor;
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    domElement.addEventListener("mousedown", onMouseDown);
    domElement.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("mousemove", onMouseMove);

    return () => {
      domElement.removeEventListener("mousedown", onMouseDown);
      domElement.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("mousemove", onMouseMove);
    };
  }, [domElement]);

  useFrame(() => {
    const { x, y } = movement.current;
    if (isDragging.current) {
      camera.position.x -= x * dampingFactor;
      camera.position.y += y * dampingFactor;
      // Gradually reduce the movement to zero
      movement.current = {
        x: x * (1 - dampingFactor),
        y: y * (1 - dampingFactor),
      };
    }
    rotationSpeed.current.x *= 1 - dampingFactor;
    rotationSpeed.current.y *= 1 - dampingFactor;

    // Apply the rotation speed to the camera rotation
    camera.rotation.x += rotationSpeed.current.y;
    camera.rotation.y += rotationSpeed.current.x;
  });

  return null;
}
function CustomFirstPersonControls(props) {
  const controls = useRef();
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const moveState = useRef({ moving: false, lastMoveTime: 0 });
  const dampingFactor = 0.02;
  const timeout = 250; // Time in milliseconds after which the rotation stops

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
          position: [-0.942, 1, 0.41],
          // rotation: [1.125, -1.2, -1.107],
        }}
      >
        {/* <OrbitControls /> */}

        {/* <CameraController /> */}
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

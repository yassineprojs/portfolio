import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.js";
import { Html, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useState } from "react";
import Mascott from "./components/Mascott.js";
import { useControls } from "leva";
import Board from "./components/Board.js";

export default function Main(props) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isSpeechBoxVisible, setIsSpeechBoxVisible] = useState(false);
  const [isMascotVisible, setIsMascotVisible] = useState(false);

  const { rotationMasc, positionMasc, scaleMasc } = useControls({
    rotationMasc: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.01,
    },
    positionMasc: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.01,
    },
    scaleMasc: {
      value: 0,
      step: 0.01,
    },
  });

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

  const script = [
    {
      id: 1,
      text: "Hello, my name is Ahmed Yassine Meddeb",
      animation: "explaining",
    },
    {
      id: 2,
      text: "This is my portfolio",

      animation: "idle",
    },
    {
      id: 3,
      text: "follow the directions, explore the room, and find the hidden indices",
      animation: "talking",
    },
    {
      id: 4,
      text: "start with the pc, Good luck",
      animation: "waving",
    },
  ];

  const [boardClicked, setBoardClicked] = useState(false);

  return (
    <>
      {boardClicked && <Board id="tsparticles" />}
      <Canvas shadows camera={{ position: [-3, 3, 0] }}>
        <Experience
          onMeshClick={() => setIsOverlayVisible(true)}
          // onBoardClick={() => {
          //   setBoardClicked(true);
          // }}
        />
      </Canvas>

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
              <Mascott
                scale={1}
                // animation={script[currentTextIndex].animation}
              />
              <ambientLight />
            </Canvas>
          )}
        </div>
      )}
    </>
  );
}

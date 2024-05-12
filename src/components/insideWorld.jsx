import {
  CameraControls,
  Float,
  Html,
  PerspectiveCamera,
  Text,
  useCursor,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { Projects, currentProjectAtom, projects } from "./Projects.jsx";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useLocation } from "../utils/LocationContext.jsx";

const insideWorldTexture = new THREE.TextureLoader().load(
  "textures/insideWorld.png"
);

export default function InsideWorld({ world, onBackClick }) {
  const map = useTexture("textures/insideWorld.png");
  const { currentLocation, setCurrentLocation } = useLocation();
  const [projectTitle, setProjectTitle] = useState(null);
  const controlsRef = useRef();

  useEffect(() => {
    setCurrentLocation(world);
  }, [world]);

  const handleBackClick = () => {
    onBackClick();
  };

  const [textHovered, setTextHovered] = useState(false);
  useCursor(textHovered);

  return (
    <>
      <Float
        floatIntensity={0.7}
        rotationIntensity={0.4}
        speed={0.7}
        floatingRange={[-0.03, 0.03]}
      >
        <Text
          projectTitle={projectTitle}
          fontSize={0.35}
          font="./fonts/orbiton.ttf"
          color={"#71826c"}
          position={[1.2, 0.5, -1.8]}
          rotation={[0, 5.5, 0]}
        >
          Projects
        </Text>
      </Float>

      <mesh position={[1, 0, 0]}>
        <ambientLight intensity={4} />
        <sphereGeometry args={[3, 24, 24]} />
        <meshStandardMaterial map={insideWorldTexture} side={THREE.BackSide} />
      </mesh>
      <Float
        floatIntensity={0.7}
        rotationIntensity={0.3}
        speed={0.7}
        floatingRange={[-0.01, 0.01]}
      >
        <Text
          onPointerOver={() => setTextHovered(true)}
          onPointerOut={() => setTextHovered(false)}
          fontSize={0.18}
          font="./fonts/orbiton.ttf"
          color={"#71826c"}
          position={[1.6, -0.2, -1.8]}
          onClick={handleBackClick}
          rotation={[0, 5.5, 0]}
        >
          Back to Room
        </Text>
      </Float>
      <Projects />

      {currentLocation === "insideWorld" && <ProjectsSection />}
    </>
  );
}

const ProjectsSection = () => {
  const projectHtml = useRef();
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);

  const nextProject = () => {
    setCurrentProject((currentProject + 1) % projects.length);
  };

  const previousProject = () => {
    setCurrentProject((currentProject - 1 + projects.length) % projects.length);
  };

  return (
    <Html
      position={[3.8, -2.2, 0.3]}
      rotation-y={1.5}
      distanceFactor={3}
      ref={projectHtml}
      wrapperClass="htmlProject"
      transform
      center
    >
      <div className="project_section">
        <button className="proj_btn" onClick={previousProject}>
          <ion-icon name="caret-back-outline"></ion-icon>
        </button>

        <button className="proj_btn" onClick={nextProject}>
          <ion-icon name="caret-forward-outline"></ion-icon>
        </button>
      </div>
    </Html>
  );
};

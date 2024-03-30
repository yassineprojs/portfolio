import {
  CameraControls,
  Float,
  Html,
  Text,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { Projects, currentProjectAtom, projects } from "./Projects.jsx";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { useThree } from "@react-three/fiber";
export default function InsideWorld({ world }) {
  const map = useTexture("textures/insideWorld.png");
  const [currentLocation, setCurrentLocation] = useState(world);
  // const controlsRef = useRef();

  // const scene = useThree((state) => state.scene);

  useEffect(() => {
    setCurrentLocation(world);
  }, [world]);

  // useEffect(() => {
  //   if (currentLocation === "room") {
  //     const targetPosition = new THREE.Vector3();
  //     scene.getObjectByName("lovelyDog").getWorldPosition(targetPosition);
  //     controlsRef.current.setLookAt(
  //       -3,
  //       3,
  //       0,
  //       targetPosition.x,
  //       targetPosition.y,
  //       targetPosition.z,
  //       true
  //     );
  //   } else {
  //     controlsRef.current.setLookAt(0, 0, 0, -3, 3, 0, true);
  //   }
  // }, [currentLocation]);

  return (
    <>
      <Float
        floatIntensity={0.7}
        rotationIntensity={0.7}
        speed={0.7}
        floatingRange={[-0.07, 0.07]}
      >
        <Text
          // name="lovelyDog"
          fontSize={0.4}
          font="./fonts/orbiton.ttf"
          color={"#a8b3aa"}
          position={[1.2, 1.6, -1.5]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          Projects
        </Text>
      </Float>
      {/* <CameraControls ref={controlsRef} /> */}
      <mesh position-y={1}>
        <ambientLight intensity={4} />
        <sphereGeometry args={[3, 28, 28]} />
        <meshStandardMaterial map={map} side={THREE.BackSide} />
      </mesh>
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
      position={[1.1, 0.85, 1]}
      rotation-y={-2.66}
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

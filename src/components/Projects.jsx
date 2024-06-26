import {
  Image,
  RoundedBox,
  useVideoTexture,
  Text,
  useCursor,
  useAspect,
  useTexture,
} from "@react-three/drei";
import { motion } from "framer-motion-3d";
import * as THREE from "three";
import React, { Suspense } from "react";
import { atom, useAtom } from "jotai";

export const projects = [
  {
    title: "Arabic Shop",
    // image: "images/shopImage.png",
    video: "videos/darNour.mp4",
    desciption: "creating a shopping website for arabic products",
  },
  {
    title: "Attack Surface",
    // image: "images/world.png",
    video: "videos/earthattack.mp4",
    desciption:
      "showing attacks and their info in their location based on old data ",
  },
  {
    title: "QuickTUn",
    // image: "images/quickTun.png",
    video: "videos/quickTun.mp4",
    desciption: "website for helping student's college life easier ",
  },
];

const Project = (props) => {
  const { project } = props;

  return (
    <group {...props} rotation-y={-2.66}>
      <RoundedBox args={[3.1, 2.7, 0.001]} position-z={-0.05}>
        <meshBasicMaterial
          color="black"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </RoundedBox>
      <mesh position-y={0.5}>
        <planeGeometry args={[3, 1.5]} />
        <Suspense fallback={<meshStandardMaterial side={THREE.DoubleSide} />}>
          <VideoMaterial src={project.video} />
        </Suspense>
      </mesh>
      {/* <Image
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        radius={0.07}
        scale={[3.1, 1.6, 1]}
        toneMapped={false}
        url={project.image}
        position-y={0.55}
      /> */}
      <Text
        font="./fonts/orbiton.ttf"
        maxWidth={3}
        anchorX="middle"
        anchorY="top"
        fontSize={0.25}
        position={[-1.3, -0.4, 0]}
        color={"#FEC7B4"}
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        font="./fonts/orbiton.ttf"
        maxWidth={2.5}
        anchorX="left"
        anchorY="top"
        fontSize={0.12}
        position={[-1.3, -0.7, 0]}
      >
        {project.desciption}
      </Text>
    </group>
  );
};

export const currentProjectAtom = atom(Math.floor(projects.length / 2));

export const Projects = React.memo(() => {
  const [currentProject] = useAtom(currentProjectAtom);
  return (
    <group position={[1.5, 0, -0.2]} rotation={[0, 1, 0]}>
      {projects.map((project, index) => (
        <motion.group
          key={project.title}
          position={[0, 0, index * 2.5]}
          animate={{
            x: (index - currentProject) * 1,
            y: currentProject === index ? 0 : -0.1,
            z: currentProject === index ? 1 : 5,
          }}
        >
          <Project project={project} />
        </motion.group>
      ))}
    </group>
  );
});

function VideoMaterial({ src }) {
  const texture = useVideoTexture(src);
  return <meshStandardMaterial map={texture} toneMapped={false} />;
}

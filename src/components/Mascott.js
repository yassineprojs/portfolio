import React, { useEffect, useRef, useState } from "react";
import {
  useAnimations,
  useFBX,
  useGLTF,
  Html,
  FaceControls,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";

export default function Mascott(props) {
  const meGrp = useRef();
  const [currentRotation, setCurrentRotation] = useState(null);
  const { rotationMasc, positionMasc, scaleMasc } = useControls({
    rotationMasc: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.01,
    },
    positionMasc: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.01,
    },
  });

  const { nodes, materials } = useGLTF("models/me.glb");

  // {********** animations *********}

  // const { animations: waving } = useFBX("animations/waving.fbx");
  // const { animations: idle } = useFBX("animations/idle.fbx");
  // const { animations: talking } = useFBX("animations/Talking.fbx");
  const { animations: explaining } = useFBX("animations/explaining.fbx");

  explaining[0].name = "explaining";
  // waving[0].name = "waving";
  // talking[0].name = "talking";
  // idle[0].name = "idle";

  const { actions } = useAnimations(
    // [explaining[0], idle[0], talking[0], waving[0]],
    explaining,
    meGrp
  );

  useEffect(() => {
    // if (actions[props.animation] && meGrp.current) {
    //   actions[props.animation].reset().fadeIn(0.5).play();
    // }
    actions["explaining"].play();

    // return () => {
    // if (actions[props.animation]) {
    //   actions[props.animation].reset().fadeOut(0.5).stop();
    // }

    // };
  }, []);
  //  [props.animation, actions, meGrp.current]

  //  ****************************
  return (
    <group
      position={[-4, positionMasc.y, 0]}
      rotation={[1.5, rotationMasc.y, -0.6]}
      scale={2}
      {...props}
      ref={meGrp}
      dispose={null}
    >
      <group rotation={[0, Math.PI, 0]}>
        <skinnedMesh
          geometry={nodes.character.geometry}
          material={materials.Material}
          skeleton={nodes.character.skeleton}
        />
        <primitive object={nodes.Pelvis} />
        <primitive object={nodes.IKPoleL} />
        <primitive object={nodes.IKTargetL} />
        <primitive object={nodes.IKPoleR} />
        <primitive object={nodes.IKTargetR} />
      </group>
    </group>
  );
}

useGLTF.preload("models/me.glb");

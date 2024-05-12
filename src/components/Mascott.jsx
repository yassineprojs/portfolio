import React, { useEffect, useRef, useState } from "react";
import {
  useAnimations,
  useFBX,
  useGLTF,
  Html,
  FaceControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useControls } from "leva";

export default function Mascott(props) {
  const meGrp = useRef();
  const [currentRotation, setCurrentRotation] = useState(null);

  const { nodes, materials } = useGLTF("models/me.glb");

  // {********** animations *********}

  const { animations: waving } = useFBX("animations/Waving.fbx");
  const { animations: idle } = useFBX("animations/idle.fbx");
  const { animations: talking } = useFBX("animations/Talking.fbx");
  const { animations: explaining } = useFBX("animations/explaining.fbx");

  explaining[0].name = "explaining";
  waving[0].name = "waving";
  talking[0].name = "talking";
  idle[0].name = "idle";

  const { actions } = useAnimations(explaining, meGrp);
  console.log(actions);

  useEffect(() => {
    actions["explaining"].play();
  }, []);

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

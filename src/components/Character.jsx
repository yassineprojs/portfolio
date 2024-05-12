import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Character(props) {
  const meGrp = useRef();
  const { nodes, materials, animations } = useGLTF("models/me6.glb");
  const { actions } = useAnimations(animations, meGrp);

  useEffect(() => {
    if (actions[props.animation] && meGrp.current) {
      actions[props.animation].reset().fadeIn(0.5).play();
    }
    return () => actions[props.animation].fadeOut(0.5);
  }, [props.animation]);
  return (
    <group ref={meGrp} {...props} dispose={null}>
      <group name="Scene">
        <group name="CharacterArmature">
          <group name="Body">
            <skinnedMesh
              name="Cube004"
              geometry={nodes.Cube004.geometry}
              material={materials.Skin}
              skeleton={nodes.Cube004.skeleton}
            />
            <skinnedMesh
              name="Cube004_1"
              geometry={nodes.Cube004_1.geometry}
              material={materials.Shirt}
              skeleton={nodes.Cube004_1.skeleton}
            />
            <skinnedMesh
              name="Cube004_2"
              geometry={nodes.Cube004_2.geometry}
              material={materials.Pants}
              skeleton={nodes.Cube004_2.skeleton}
            />
            <skinnedMesh
              name="Cube004_3"
              geometry={nodes.Cube004_3.geometry}
              material={materials.Belt}
              skeleton={nodes.Cube004_3.skeleton}
            />
            <skinnedMesh
              name="Cube004_4"
              geometry={nodes.Cube004_4.geometry}
              material={materials.Face}
              skeleton={nodes.Cube004_4.skeleton}
            />
            <skinnedMesh
              name="Cube004_5"
              geometry={nodes.Cube004_5.geometry}
              material={materials.Hair}
              skeleton={nodes.Cube004_5.skeleton}
            />
          </group>
          <primitive object={nodes.Bone} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("models/me6.glb");

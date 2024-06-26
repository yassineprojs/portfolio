import * as THREE from "three";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  shaderMaterial,
  MeshPortalMaterial,
  useCursor,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Decal, Html } from "@react-three/drei";
import { DissolveMaterial } from "./components/DissolveMaterial.jsx";
import InsideWorld from "./components/insideWorld.jsx";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { debounce } from "lodash";
import { useLocation } from "./utils/LocationContext.jsx";

// import WaveShaderMaterial from "./components/Paper.jsx";
// extend({ WaveShaderMaterial });

export function Room({ onMeshClick, onHintClick, visibleCube, gameWon }) {
  const { nodes, materials } = useGLTF("./models/bekedPortfolio7.glb");
  const textbill = useRef();
  const { camera } = useThree();
  const { currentLocation, setCurrentLocation } = useLocation();

  const [hovered, setHovered] = useState();
  useCursor(hovered);

  const [hintHovered, setHintHovered] = useState();
  useCursor(hintHovered);

  const portalMaterial = useRef();
  const [active, setActive] = useState(0);
  // const [currentLocation, setCurrentLocation] = useState("room");
  const [isPortalActive, setIsPortalActive] = useState(false);

  const [phoneHovered, setPhoneHovered] = useState(false);
  useCursor(phoneHovered);

  const chairRef = useRef();

  /***** textures *******/

  function loadAndConfigureTexture(path) {
    const texture = useTexture(path);
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const guitarChairCouchTvLittleLamp = loadAndConfigureTexture(
    "./bakedPortfolioTextures/guitarChairCouchLampTVBaked.jpg"
  );
  const bag = loadAndConfigureTexture("./bakedPortfolioTextures/bagBaked.jpg");
  const bed = loadAndConfigureTexture(
    "./bakedPortfolioTextures/bedBakedFinalFinal.jpg"
  );
  const boardPapers = loadAndConfigureTexture(
    "./bakedPortfolioTextures/papersBoard3Baked3.jpg"
  );
  const booksPC = loadAndConfigureTexture(
    "./bakedPortfolioTextures/outsideBooksPCBaked.jpg"
  );
  const cameraPolaroidBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/polaroidCamBaked.jpg"
  );
  const CarpetNightStandFileCabBoardWindowBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/carpetBoardQRwindowFileCabNightStandBaked.jpg"
  );
  const deskBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/desk2Baked.jpg"
  );
  const mouseKeyboardBigLampBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/mouseKeyboardBigLampBaked.jpg"
  );
  const pcBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/pcBaked.jpg"
  );
  const phoneBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/phoneBaked.jpg"
  );

  const plantsBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/plantsBaked.jpg"
  );
  const vinylsBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/newVinylsBaked.jpg"
  );
  const voiceRcorderCasetteBAked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/voiceBaked.jpg"
  );
  const diskBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/diskBaked.jpg"
  );

  const picsPolaroidBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/picsPolaroidBaked.jpg"
  );
  const floorWalls5Baked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/floorWalls5Baked.jpg"
  );
  const pinsInsideBooksBaked = loadAndConfigureTexture(
    "./bakedPortfolioTextures/newBooksDecorPins.jpg"
  );
  const hintPaperTexture = useTexture("./bakedPortfolioTextures/qr1.png");
  hintPaperTexture.colorSpace = THREE.SRGBColorSpace;

  const meAndHachhouch = useTexture("./images/meHachhouch.jpg");
  meAndHachhouch.colorSpace = THREE.SRGBColorSpace;
  meAndHachhouch.offset.set(-0.2, -0.1);
  meAndHachhouch.repeat.set(1.5, 1);
  //********** materials ***********/

  const bagMaterial = new THREE.MeshBasicMaterial({
    map: bag,
  });

  const bedMaterial = new THREE.MeshBasicMaterial({
    map: bed,
  });
  const bordPaper = new THREE.MeshBasicMaterial({
    map: boardPapers,
  });
  const booksMaterial = new THREE.MeshBasicMaterial({
    map: booksPC,
  });
  const camPlroid = new THREE.MeshBasicMaterial({
    map: cameraPolaroidBaked,
  });
  const cnsfcbw = new THREE.MeshBasicMaterial({
    map: CarpetNightStandFileCabBoardWindowBaked,
  });
  const deskBakedMaterial = new THREE.MeshBasicMaterial({
    map: deskBaked,
  });

  const mouseKeyboardBigLampBakedMaterial = new THREE.MeshBasicMaterial({
    map: mouseKeyboardBigLampBaked,
  });
  const pc = new THREE.MeshBasicMaterial({
    map: pcBaked,
  });

  const plantsBakedMaterial = new THREE.MeshBasicMaterial({
    map: plantsBaked,
  });
  const vnylMaterial = new THREE.MeshBasicMaterial({
    map: vinylsBaked,
  });
  const voiceRcorderCasetteMaterial = new THREE.MeshBasicMaterial({
    map: voiceRcorderCasetteBAked,
  });
  const GcLLTv = new THREE.MeshBasicMaterial({
    map: guitarChairCouchTvLittleLamp,
  });
  const phone = new THREE.MeshBasicMaterial({
    map: phoneBaked,
  });

  const diskBakedMaterial = new THREE.MeshBasicMaterial({
    map: diskBaked,
  });

  const picpolroid = new THREE.MeshBasicMaterial({
    map: picsPolaroidBaked,
  });

  const floorWalls5BakedMaterial = new THREE.MeshBasicMaterial({
    map: floorWalls5Baked,
  });
  const pinbookMaterial = new THREE.MeshBasicMaterial({
    map: pinsInsideBooksBaked,
  });

  const posterMaterial = new THREE.MeshBasicMaterial({
    map: meAndHachhouch,
  });

  const handleClickPhone = useCallback(
    debounce(() => {
      setIsPortalActive((prev) => !prev);
      setCurrentLocation((prevLocation) =>
        prevLocation === "room" ? "insideWorld" : "room"
      );
    }, 200),

    [camera]
  );

  const handleBackClick = useCallback(() => {
    setIsPortalActive(false);
    setCurrentLocation("room");
  }, []);

  useFrame((_state, delta) => {
    if (portalMaterial.current) {
      easing.damp(
        portalMaterial.current,
        "blend",
        isPortalActive ? 1 : 0,
        0.3,
        delta
      );
    }
  });

  /** code ** */
  // const waveRef = useRef();
  // useFrame(({ clock }) => (waveRef.current.uTime = clock.getElapsedTime()));
  // const plGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  // nodes.Plane014.geometry = plGeometry;

  // const [certifImage] = useLoader(THREE.TextureLoader, [
  //   "./images/Certifs.png",
  // ]);

  return (
    <group dispose={null}>
      {/* phone */}
      <group position={[1.202, 1.036, -0.001]}>
        <mesh
          onPointerOver={() => setPhoneHovered(true)}
          onPointerOut={() => setPhoneHovered(false)}
          geometry={nodes.defaultMaterial013.geometry}
          material={phone}
          onClick={handleClickPhone}
        />

        <mesh
          geometry={nodes.defaultMaterial013_1.geometry}
          material={new THREE.MeshBasicMaterial({ color: "grey" })}
        >
          {isPortalActive && (
            <MeshPortalMaterial ref={portalMaterial}>
              <InsideWorld
                world={currentLocation}
                onBackClick={handleBackClick}
              />
            </MeshPortalMaterial>
          )}
        </mesh>
      </group>

      {/* boardPapers */}
      <group position={[1.762, 1.778, -0.31]}>
        <mesh geometry={nodes.Plane014.geometry}>
          {/* <waveShaderMaterial
            uColor={"hotpink"}
            ref={waveRef}
            uTexture={certifImage}
          /> */}
          {gameWon && (
            <DissolveMaterial baseMaterial={bordPaper} visible={visibleCube} />
          )}
        </mesh>
        <mesh geometry={nodes.Plane014_1.geometry}>
          {gameWon && (
            <DissolveMaterial baseMaterial={bordPaper} visible={visibleCube} />
          )}
        </mesh>
        <mesh geometry={nodes.Plane014_2.geometry}>
          {gameWon && (
            <DissolveMaterial baseMaterial={bordPaper} visible={visibleCube} />
          )}
        </mesh>
        <mesh
          onClick={onHintClick}
          onPointerOver={() => setHintHovered(true)}
          onPointerOut={() => setHintHovered(false)}
          geometry={nodes.Plane014_4.geometry}
          material={bordPaper}
        ></mesh>
        {/* others */}
        <mesh geometry={nodes.Plane014_3.geometry} material={bordPaper} />
        <mesh geometry={nodes.Plane014_5.geometry} material={bordPaper} />
        <mesh geometry={nodes.Plane014_6.geometry} material={bordPaper} />
      </group>
      {/* pc */}

      <group position={[1.52, 1.002, 0.528]} rotation={[0, 0, 0.03]}>
        <mesh geometry={nodes.defaultMaterial002.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_1.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_2.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_3.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_4.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_5.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_6.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_7.geometry} material={pc} />
        <mesh geometry={nodes.defaultMaterial002_8.geometry} material={pc} />
        {currentLocation === "room" && (
          <Html
            style={{
              userSelect: "none",
              pointerEvents: "none",
            }}
            ref={textbill}
            wrapperClass="htmlScreen"
            transform
            center
            distanceFactor={0.155}
            // position={[positionIframe.x, 0.37, positionIframe.z]}
            position={[-0.2, 0.37, 0.02]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <iframe src="https://yassineprojs.github.io/innerWebsite/" />
          </Html>
        )}
      </group>

      <group position={[0.278, 0.793, -0.715]}>
        <mesh
          geometry={
            nodes.CassetteTape_Main_low_01_1_CassetteTape_01a_0001.geometry
          }
          material={voiceRcorderCasetteMaterial}
        />
        <mesh
          onClick={onMeshClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          geometry={
            nodes.CassetteTape_Main_low_01_1_CassetteTape_01a_0001_1.geometry
          }
          material={voiceRcorderCasetteMaterial}
        />
        {currentLocation === "room" && (
          <Html
            distanceFactor={1.5}
            center
            wrapperClass="recorder"
            position={[-0.1, 0.3, 0]}
            style={{ color: "#fff" }}
          >
            Click Me First
          </Html>
        )}
      </group>

      <mesh
        geometry={nodes.hintPaper.geometry}
        // material={cnsfcbw}
        position={[1.735, 1.546, 0.109]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      >
        <Decal
          position={[0, 0, -0.03]} // Position of the decal
          rotation={[-0.15, 0, 0]} // Rotation of the decal
          scale={[0.07, -0.01, 0.07]} // Scale of the decal
        >
          <meshBasicMaterial
            map={hintPaperTexture}
            polygonOffset
            polygonOffsetFactor={-1} // The material should take precedence over the original
          />
        </Decal>
      </mesh>

      {/* poster */}
      <mesh
        geometry={nodes.posterWall.geometry}
        material={posterMaterial}
        position={[1.807, 2.337, -1.159]}
      />

      <group position={[1.774, 2.044, 0.261]} name="boardName">
        <mesh geometry={nodes.Cube037.geometry} material={cnsfcbw} />
        <mesh geometry={nodes.Cube037_1.geometry} material={cnsfcbw} />
      </group>

      {/* pinsInsideBooksBaked */}
      <group position={[1.723, 2.476, -0.467]}>
        <mesh geometry={nodes.pins004.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_1.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_2.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_3.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_4.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_5.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_6.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_7.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_8.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_9.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_10.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_11.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_12.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_13.geometry} material={pinbookMaterial} />
        <mesh geometry={nodes.pins004_14.geometry} material={pinbookMaterial} />
      </group>
      {/* vinylsBaked */}
      <group position={[1.591, 1.28, -1.763]}>
        <mesh geometry={nodes.vinylCircle.geometry} material={vnylMaterial} />
        <mesh geometry={nodes.vinylCircle_1.geometry} material={vnylMaterial} />
        <mesh geometry={nodes.vinylCircle_2.geometry} material={vnylMaterial} />
        <mesh geometry={nodes.vinylCircle_3.geometry} material={vnylMaterial} />
        <mesh geometry={nodes.vinylCircle_4.geometry} material={vnylMaterial} />
        <mesh geometry={nodes.vinylCircle_5.geometry} material={vnylMaterial} />
        <mesh geometry={nodes.vinylCircle_6.geometry} material={vnylMaterial} />
      </group>

      <mesh
        geometry={nodes.Duvet.geometry}
        material={bedMaterial}
        position={[0.332, 0.189, -1.117]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.Pillow_1.geometry}
        material={bedMaterial}
        position={[0.332, 0.189, -1.117]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.Pillow_2.geometry}
        material={bedMaterial}
        position={[0.332, 0.189, -1.117]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.Sheet.geometry}
        material={bedMaterial}
        position={[0.332, 0.189, -1.117]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.bedFrame.geometry}
        material={bedMaterial}
        position={[2.355, 0.189, -1.117]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <group position={[1.182, 1.006, 1.014]}>
        <mesh
          geometry={nodes.floor.geometry}
          material={floorWalls5BakedMaterial}
        />
        <mesh
          geometry={nodes.floor_1.geometry}
          material={floorWalls5BakedMaterial}
        />
      </group>
      <group position={[1.417, 0.995, 0.463]}>
        <mesh geometry={nodes.desk_1.geometry} material={deskBakedMaterial} />
        <mesh geometry={nodes.desk_2.geometry} material={deskBakedMaterial} />
        <mesh geometry={nodes.desk_3.geometry} material={deskBakedMaterial} />
      </group>
      {/* picsPolaroidBaked */}
      <group position={[1.539, 1.004, 1.042]}>
        <mesh geometry={nodes.facPic_1.geometry} material={picpolroid} />
        <mesh geometry={nodes.facPic_2.geometry} material={picpolroid} />
        <mesh geometry={nodes.facPic_3.geometry} material={picpolroid} />
        <mesh geometry={nodes.facPic_4.geometry} material={picpolroid} />
        <mesh geometry={nodes.facPic_5.geometry} material={picpolroid} />
      </group>
      {/* cameraPolaroidBaked */}
      <group
        position={[1.526, 1, 0.968]}
        rotation={[-1.574, -0.002, 0.637]}
        scale={0.0008}
      >
        <mesh geometry={nodes.Object_0007.geometry} material={camPlroid} />
        <mesh geometry={nodes.Object_0007_1.geometry} material={camPlroid} />
        <mesh geometry={nodes.Object_0007_2.geometry} material={camPlroid} />
        <mesh geometry={nodes.Object_0007_3.geometry} material={camPlroid} />
      </group>

      {/* booksPC */}
      <group position={[1.331, 1.276, 1.864]}>
        <mesh geometry={nodes.Cube001.geometry} material={booksMaterial} />
        <mesh geometry={nodes.Cube001_1.geometry} material={booksMaterial} />
        <mesh geometry={nodes.Cube001_2.geometry} material={booksMaterial} />
        <mesh geometry={nodes.Cube001_3.geometry} material={booksMaterial} />
        <mesh geometry={nodes.Cube001_4.geometry} material={booksMaterial} />
      </group>

      {/* CarpetNightStandFileCabBoardWindowBaked */}
      <group position={[0.527, 1.76, -1.847]}>
        <mesh geometry={nodes.Cube006.geometry} material={cnsfcbw} />
        <mesh geometry={nodes.Cube006_1.geometry} material={cnsfcbw} />
        <mesh geometry={nodes.Cube006_2.geometry} material={cnsfcbw} />
      </group>

      <group position={[1.243, 0.525, 1.773]}>
        <mesh geometry={nodes.Cube026.geometry} material={cnsfcbw} />
        <mesh geometry={nodes.Cube026_1.geometry} material={cnsfcbw} />
        <mesh geometry={nodes.Cube026_2.geometry} material={cnsfcbw} />
      </group>

      <mesh
        geometry={nodes.carpet.geometry}
        material={cnsfcbw}
        position={[0.266, 0.208, 0.613]}
      />

      {/* big lamp */}
      <group position={[-1.738, 1.008, -1.659]}>
        <mesh
          geometry={nodes.ARCADE_GREEN.geometry}
          material={mouseKeyboardBigLampBakedMaterial}
        />
        <mesh
          geometry={nodes.ARCADE_GREEN_1.geometry}
          material={mouseKeyboardBigLampBakedMaterial}
        />
      </group>

      <mesh
        geometry={nodes.nightStand.geometry}
        material={cnsfcbw}
        position={[1.6, 0.659, -1.072]}
      />
      {/* guitarChairCouchTvLittleLamp */}
      <group position={[-1.727, 0.482, -1.078]}>
        <mesh geometry={nodes.Cube047.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Cube047_1.geometry} material={GcLLTv} />
      </group>

      <group position={[-0.889, 0.554, -0.782]}>
        <mesh geometry={nodes.Plane017.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Plane017_1.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Plane017_2.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Plane017_3.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Plane017_4.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Plane017_5.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Plane017_6.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Plane017_7.geometry} material={GcLLTv} />
      </group>

      <group position={[1.337, 1.008, -0.148]}>
        <mesh geometry={nodes.Mesh002.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Mesh002_1.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Mesh002_2.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Mesh002_3.geometry} material={GcLLTv} />
      </group>

      <group position={[1.466, 1.678, 1.791]}>
        <mesh geometry={nodes.Text001.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Text001_1.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Text001_2.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Text001_3.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Text001_4.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Text001_5.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Text001_6.geometry} material={GcLLTv} />
      </group>

      <mesh
        geometry={nodes.tvScreen.geometry}
        material={GcLLTv}
        position={[1.381, 1.867, 1.672]}
      />

      <group ref={chairRef} position={[0.714, 0.663, 0.496]}>
        <mesh geometry={nodes.Mesh004.geometry} material={GcLLTv} />
        <mesh geometry={nodes.Mesh004_1.geometry} material={GcLLTv} />
      </group>

      <mesh
        geometry={nodes.bag.geometry}
        material={bagMaterial}
        position={[1.065, 0.371, 1.204]}
        rotation={[0, -1.259, 0]}
        scale={0.103}
      />

      <mesh
        geometry={nodes.mouse.geometry}
        material={mouseKeyboardBigLampBakedMaterial}
        position={[1.182, 1.054, 0.865]}
      />

      <group position={[1.589, 0.193, 1.379]}>
        <mesh geometry={nodes.Mesh.geometry} material={plantsBakedMaterial} />
        <mesh geometry={nodes.Mesh_1.geometry} material={plantsBakedMaterial} />
        <mesh geometry={nodes.Mesh_2.geometry} material={plantsBakedMaterial} />
      </group>

      <group position={[1.218, 1.035, 0.429]}>
        <mesh
          geometry={nodes.Plane015.geometry}
          material={mouseKeyboardBigLampBakedMaterial}
        />
        <mesh
          geometry={nodes.Plane015_1.geometry}
          material={mouseKeyboardBigLampBakedMaterial}
        />
      </group>
      <mesh
        geometry={nodes.disk.geometry}
        material={diskBakedMaterial}
        position={[1.182, 1.008, 1.014]}
      />
    </group>
  );
}

export function Floor2(props) {
  const { nodes, materials } = useGLTF("./models/newBaked.glb");
  const doorWalls2PcScreen = useTexture(
    "./bakedPortfolioTextures/doorWallsPcScreenBetter7.jpg"
  );
  doorWalls2PcScreen.flipY = false;
  doorWalls2PcScreen.colorSpace = THREE.SRGBColorSpace;
  const doorWalls2PcScreenMaterial = new THREE.MeshBasicMaterial({
    map: doorWalls2PcScreen,
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.door.geometry}
        material={doorWalls2PcScreenMaterial}
        position={[-2.036, 1.427, 0.217]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.doorKnob.geometry}
        material={doorWalls2PcScreenMaterial}
        position={[-1.923, 1.451, 0.65]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pcSceen.geometry}
        material={doorWalls2PcScreenMaterial}
        position={[1.52, 1.002, 0.528]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.floorWalls2.geometry}
        material={doorWalls2PcScreenMaterial}
        position={[1.182, 1.006, 1.014]}
      />
    </group>
  );
}
useGLTF.preload("./models/bekedPortfolio7.glb");
useGLTF.preload("./models/newBaked.glb");

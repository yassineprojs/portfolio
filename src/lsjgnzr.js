const doorWalls2PcScreen = useTexture(
  "/bakedPortfolioTextures/doorWallsPcScreenBetter7.jpg"
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
      geometry={newNodes.door.geometry}
      material={doorWalls2PcScreenMaterial}
      position={[-2.036, 1.427, 0.217]}
      rotation={[Math.PI / 2, 0, -Math.PI / 2]}
    />
    <mesh
      castShadow
      receiveShadow
      geometry={newNodes.pc.geometry}
      material={doorWalls2PcScreenMaterial}
      position={[1.52, 1.002, 0.528]}
    />
    <mesh
      castShadow
      receiveShadow
      geometry={newNodes.doorKnob.geometry}
      material={doorWalls2PcScreenMaterial}
      position={[-1.923, 1.451, 0.65]}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
    />
    <mesh
      castShadow
      receiveShadow
      geometry={newNodes.pcSceen.geometry}
      material={doorWalls2PcScreenMaterial}
      position={[1.52, 1.002, 0.528]}
    />
    <mesh
      castShadow
      receiveShadow
      geometry={newNodes.floorWalls2.geometry}
      material={doorWalls2PcScreenMaterial}
      position={[1.182, 1.006, 1.014]}
    />
  </group>
);

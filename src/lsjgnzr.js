export default function Main(props) {
  // ... existing code ...

  const [isAnimating, setIsAnimating] = useState(false); // Define isAnimating state here

  const { goToNextPosition, goToPreviousPosition } = useCameraAnimations(
    camera,
    cameraPositions,
    cameraRotations,
    setIsAnimating // Pass setIsAnimating to the hook
  );

  // ... existing code ...

  return (
    <>
      <CameraContext.Provider value={setCamera}>
        <Canvas
          // ... existing canvas properties ...
        >
          <CustomFirstPersonControls
            lookSpeed={0.01}
            isAnimating={isAnimating} // Pass isAnimating as a prop
          />
          {/* ... other components ... */}
        </Canvas>
        {/* ... other elements ... */}
      </CameraContext.Provider>
    </>
  );
}
Vous avez envoyé
function CustomFirstPersonControls({ lookSpeed, isAnimating }) { // Destructure isAnimating from props
  // ... existing code ...

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (controlsRef.current && !isAnimating) { // Use isAnimating from props
        controlsRef.current.lookSpeed = lookSpeed;
        moveState.current.moving = true;
        moveState.current.lastMoveTime = Date.now();
      }
    };

    domElement.addEventListener("mousemove", handleMouseMove);

    return () => {
      domElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lookSpeed, domElement, isAnimating]); // Include isAnimating in the dependency array

  // ... existing code ...
}


const useCameraAnimations = (camera, positions, rotations, setIsAnimating) => {
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [currentRotationIndex, setCurrentRotationIndex] = useState(0);

  const animateCameraPosition = (newPosition) => {
    if (camera) {
      setIsAnimating(true); // Start animation
      gsap.to(camera.position, {
        ...newPosition,
        duration: 2.3,
        onComplete: () => setIsAnimating(false) // End animation
      });
    }
  };

  const animateCameraRotation = (newRotation) => {
    if (camera) {
      setIsAnimating(true); // Start animation
      gsap.to(camera.rotation, {
        x: newRotation.x * (Math.PI / 180), // Convert to radians
        y: newRotation.y * (Math.PI / 180), // Convert to radians
        z: newRotation.z * (Math.PI / 180), // Convert to radians
        duration: 2.3,
        onComplete: () => setIsAnimating(false) // End animation
      });
    }
  };

  const goToNextPosition = () => {
    if (camera && !isAnimating) {
      const nextPositionIndex = (currentPositionIndex + 1) % positions.length;
      const nextRotationIndex = (currentRotationIndex + 1) % rotations.length;
      animateCameraPosition(positions[nextPositionIndex]);
      animateCameraRotation(rotations[nextRotationIndex]);
      setCurrentPositionIndex(nextPositionIndex);
      setCurrentRotationIndex(nextRotationIndex);
    }
  };

  const goToPreviousPosition = () => {
    if (camera && !isAnimating) {
      const prevPositionIndex =
        (currentPositionIndex - 1 + positions.length) % positions.length;
      const prevRotationIndex =
        (currentRotationIndex - 1 + rotations.length) % rotations.length;
      animateCameraPosition(positions[prevPositionIndex]);
      animateCameraRotation(rotations[prevRotationIndex]);
      setCurrentPositionIndex(prevPositionIndex);
      setCurrentRotationIndex(prevRotationIndex);
    }
  };

  return { goToNextPosition, goToPreviousPosition };
};
import { useProgress } from "@react-three/drei";

export const LoadingScreen = ({ started, onStarted }) => {
  const { progress } = useProgress();
  return (
    <div className={`loadingScreen ${started ? "loadingScreen--started" : ""}`}>
      <div className="loadingScreen__progress">
        <div
          className="loadingScreen__progress__value"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
      <div className="loadingScreen__board">
        <h1 className="loadingScreen__title">
          Loading... Unraveling the mysteries of cyber defense in a virtual
          playground.
        </h1>
        <button
          className="loadingScreen__button"
          disabled={progress < 100}
          onClick={onStarted}
        >
          Access
        </button>
      </div>
    </div>
  );
};

// import { Loader } from "@react-three/drei";

// const containerStyles = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   height: "100vh",
//   backgroundColor: "#282c34", // A dark background
// };

// const innerStyles = {
//   position: "fixed",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "50%",
//   height: "50px",
//   borderRadius: "25px",
//   backgroundColor: "#61dafb", //  blue
// };

// const barStyles = {
//   height: "100%",
//   borderRadius: "25px",
//   backgroundColor: "#ff007b", // pink
//   transition: "width 0.3s ease-in-out",
// };

// const dataStyles = {
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   position: "absolute",
//   marginTop: "-2rem",
//   color: "#ffffff",
//   fontFamily: "Arial, sans-serif",
//   fontSize: "1.5rem",
// };

// const creativeText = (p) =>
//   `Just a moment, we're preparing something amazing for you! ${p.toFixed(2)}%`;

// const LoaderComponent = () => (
//   <Loader
//     containerStyles={containerStyles}
//     innerStyles={innerStyles}
//     barStyles={barStyles}
//     dataStyles={dataStyles}
//     dataInterpolation={creativeText}
//     initialState={(active) => active}
//   />
// );

// export default LoaderComponent;

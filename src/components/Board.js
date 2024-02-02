import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { loadFull } from "tsparticles";
import { useCallback, useMemo } from "react";
import { tsParticles } from "@tsparticles/engine";

const Board = (props) => {
  const options = useMemo(() => {
    return {
      particles: {
        links: {
          enable: true, // enabling this will make particles linked together
          distance: 100, // maximum distance for linking the particles
        },
        shape: {
          type: "image",
          image: {
            src: "./images/a.png",
            width: 100,
            height: 100,
          },
        },
        number: {
          value: 100,
        },
        move: {
          enable: true,
          speed: { min: 1, max: 5 },
        },
        color: {
          value: "#000000",
        },
        size: {
          value: { min: 1, max: 5 },
        },
        opacity: {
          value: { min: 0.5, max: 0.9 }, // using a different opacity, to have some semitransparent effects
        },
      },
      retina_detect: true,

      polygon: {
        enable: true,
        type: "inline",
        inline: {
          arrangement: "equidistant",
        },
        draw: {
          enable: true,
          stroke: {
            color: "#fff",
            width: 0.5,
            opacity: 1,
          },
        },
        move: {
          radius: 10,
          type: "path",
        },
        url: "https://i.imgur.com/6q9s3Za.png",
        scale: 0.5,
        position: {
          x: 50,
          y: 50,
        },
      },
    };
  }, []);
  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadSlim(engine);
  }, []);

  // const particlesLoaded = useCallback(async (container) => {
  //   await console.log(container);
  // }, []);

  return (
    <Particles
      id={props.id}
      init={particlesInit}
      options={options}
      className="particles-container"
    ></Particles>
  );
};
export default Board;

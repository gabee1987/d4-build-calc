import { loadSlim } from "tsparticles-slim";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { useCallback, useMemo } from "react";
import particlesConfig from "../../config/config-particles";
import "./particles.styles.scss";
import { calculateNewValue } from "@testing-library/user-event/dist/utils";

const ParticlesComponent = () => {
  const options = useMemo(() => {
    return {
      fpsLimit: 60,
      particles: {
        number: {
          value: 0,
        },
        color: {
          value: ["#FFA07A", "#FF4500", "#FFD700", "#B22222"],
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        shape: {
          type: ["circle"],
        },
        opacity: {
          value: 0.8,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0,
            sync: false,
          },
        },
        size: {
          value: 6,
          random: { min: 0.5, max: 4 },
          anim: {
            enable: true,
            speed: 5,
            size_min: 0,
            sync: false,
          },
        },
        move: {
          enable: true,
          speed: 5,
          direction: "top",
          random: true,
          straight: false,
          out_mode: "out",
          attract: {
            enable: false,
          },
        },
      },
      emitters: [
        {
          direction: "top",
          rate: {
            quantity: 0.5,
            delay: 0.1,
          },
          size: {
            width: 10,
            height: 10,
          },
          position: {
            x: 50, // Middle position (in percentage)
            y: 110, // Slightly above the bottom of the screen (in percentage)
          },
          life: {
            duration: 1,
            count: -1,
          },
        },
      ],
      retina_detect: true,
    };
  }, []);

  // Add a custom callback to destroy particles when they reach half the window height
  const customAfterUpdate = useCallback((particles) => {
    particles.forEach((particle) => {
      if (particle.position.y <= window.innerHeight / 2) {
        particle.destroy();
      }
    });
  }, []);

  const particlesInit = useCallback((engine) => {
    //loadSlim(engine);
    loadFull(engine);

    // Add custom after-update event
    //engine.particles.addAfterCreateModifier(customAfterUpdate);
  }, []);

  return (
    <Particles
      className="particles-container"
      init={particlesInit}
      options={options}
      style={{
        position: "absolute",
        width: "100%",
        height: "50vh", // Set the height to 50% of the viewport height
        zIndex: "-1", // Optional: set a negative z-index to place the particles below other elements
      }}
    />
  );
};

export default ParticlesComponent;

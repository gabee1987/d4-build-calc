import { loadSlim } from "tsparticles-slim";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { useCallback, useMemo, useEffect, useState } from "react";
import particlesConfig from "../../config/config-particles";
import "./particles.styles.scss";
import { calculateNewValue } from "@testing-library/user-event/dist/utils";

const ParticlesComponent = () => {
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight / 1.8);

  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight / 2);
    };

    window.addEventListener("resize", handleResize);
    console.log("canvas height: " + canvasHeight);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const options = useMemo(() => {
    return {
      fullScreen: false,
      backgroundMode: false,
      fpsLimit: 60, // frame rate limit
      background: {},
      particles: {
        number: {
          value: 0, // No particles initially, using emitters
        },
        color: {
          value: ["#FFA07A", "#FF4500", "#FFD700", "#B22222", "#696969"],
          animation: {
            enable: true, // Enable color animation
            speed: 5, // Speed of color animation
            sync: false, // Don't synchronize color animation
          },
        },
        shape: {
          type: "circle", // Particle shape
        },
        opacity: {
          value: 0.8, // Particle opacity
          random: true, // Random opacity for particles
          anim: {
            enable: true, // Enable opacity animation
            speed: 2, // Speed of opacity animation
            opacity_min: 0, // Minimum opacity
            sync: false, // Don't synchronize opacity animation
          },
        },
        size: {
          value: 1.5, // Particle size
          random: { min: 0.2, max: 5 }, // Random size range
          anim: {
            enable: true, // Disable size animation
          },
        },
        move: {
          enable: true, // Enable particle movement
          speed: 8, // Particle movement speed
          direction: "top", // Particle movement direction
          random: true, // Random movement
          straight: false, // No straight movement
          out_mode: "destroy", // Destroy particles when out of canvas
          attract: {
            enable: false, // Don't enable attraction
          },
        },
      },
      emitters: [
        {
          direction: "top", // Direction of particle movement
          rate: {
            quantity: 2, // Quantity of particles emitted per second
            delay: 0.3, // Delay between particles
          },
          size: {
            width: 100, // Emission area width in percentage
            height: 50, // Emission area height in percentage
          },
          position: {
            x: 50, // Emitter x position in percentage
            y: 100, // Emitter y position in percentage
          },
          life: {
            duration: -1, // Infinite emitter duration
            count: 1,
          },
        },
      ],
      retina_detect: true, // Enable retina display detection
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
    <div
      className="particles-wrapper"
      style={{
        width: "98%",
        height: canvasHeight + "px",
        position: "absolute",
        bottom: 0,
      }}
    >
      <Particles
        className="particles-container"
        init={particlesInit}
        options={options}
      />
    </div>
  );
};

export default ParticlesComponent;

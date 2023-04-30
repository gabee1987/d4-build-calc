import { loadSlim } from "tsparticles-slim";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { useCallback, useMemo, useEffect, useState } from "react";
import particlesConfig from "../../config/config-particles";
import RandomDirectionPlugin from "./randomDirectionPlugin";

import "./particles.styles.scss";

const ParticlesComponent = () => {
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight / 1.6);

  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight / 1.5);
    };

    window.addEventListener("resize", handleResize);
    console.log("canvas height: " + canvasHeight);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const options = useMemo(() => {
    return {
      // plugins: [new RandomDirectionPlugin()],
      fullScreen: false,
      backgroundMode: false,
      fpsLimit: 60, // frame rate limit
      background: {},

      emitters: [
        // ========================== MIDDLE EMITTER ===========================
        {
          direction: "top", // Direction of particle movement
          rate: {
            quantity: 6, // Quantity of particles emitted per second
            delay: 0.2, // Delay between particles
          },
          size: {
            width: 40, // Emission area width in percentage
            height: 20, // Emission area height in percentage
          },
          position: {
            x: 50, // Emitter x position in percentage
            y: 100, // Emitter y position in percentage
          },
          life: {
            duration: -1, // Infinite emitter duration
            count: 1,
          },
          particles: {
            color: {
              value: ["#FFA07A", "#FF4500", "#ff0000", "#B22222", "#000000"],
              animation: {
                enable: true, // Enable color animation
                speed: 6, // Speed of color animation
                sync: false, // Don't synchronize color animation
                colorStops: [
                  { value: "#FFA07A", stop: 0 },
                  { value: "#FF4500", stop: 0.2 },
                  { value: "#ff2600", stop: 0.4 },
                  { value: "#B22222", stop: 0.6 },
                  { value: "#ff8800", stop: 1 },
                ],
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
              value: { min: 0.5, max: 2 }, // Set the size range for the particles
              animation: {
                enable: true, // Enable size animation
                speed: 2, // Set the speed of size animation
                startValue: "max", // The animation will start from the max value
                destroy: "min", // The particles will be destroyed when they reach the min size
                sync: false, // The size animation will not be synchronized across particles
              },
            },
            move: {
              enable: true, // Enable particle movement
              speed: {
                // Set a range for random movement speed
                min: 6,
                max: 20,
              }, // Particle movement speed
              angle: { offset: 0.1, value: 5 },
              drift: {
                min: -1,
                max: 1,
              },
              vibrate: {
                min: 1,
                max: 10,
              },
              direction: "top", // Particle movement direction
              straight: false, // No straight movement
              out_mode: "destroy", // Destroy particles when out of canvas
              attract: {
                enable: true,
                rotateX: 100,
                rotateY: -100,
              },
              noise: {
                enable: true,
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 10,
                  },
                  value: 50,
                },
                sync: false,
              },
              // spin: {
              //   enable: true,
              //   acceleration: 0.05, // Adjust the acceleration value to control the intensity of the spin
              //   position: {
              //     x: 50, // x and y position where the spin force is applied
              //     y: 50,
              //   },
              // },
              // gravity: {
              //   enable: true,
              //   acceleration: 0.2, // Adjust the acceleration value to control the intensity of gravity
              //   maxSpeed: 50,
              // },
            },
            rotate: {
              value: 0,
              random: {
                enable: true,
                minimumValue: 0,
              },
              direction: "random", // random rotation direction (clockwise or counter-clockwise)
              animation: {
                enable: true, // enable rotation animation
                speed: 10, // rotation speed (degrees per frame)
                sync: false, // don't synchronize rotation animation across particles
              },
            },
            trail: {
              enable: true,
              length: 10,
              fillColor: {
                value: "#ffffff",
              },
            },
          },
        },

        // LEFT EMITTER =====================================================
        {
          direction: "top-right", // Direction of particle movement
          rate: {
            quantity: 1.9, // Quantity of particles emitted per second
            delay: 0.3, // Delay between particles
          },
          size: {
            width: 40, // Emission area width in percentage
            height: 30, // Emission area height in percentage
          },
          position: {
            x: 10, // Emitter x position in percentage
            y: 100, // Emitter y position in percentage
          },
          life: {
            duration: -1, // Infinite emitter duration
            count: 1,
          },
          particles: {
            color: {
              value: ["#FFA07A", "#FF4500", "#ff0000", "#B22222", "#000000"],
              animation: {
                enable: true, // Enable color animation
                speed: 5, // Speed of color animation
                sync: false, // Don't synchronize color animation
                colorStops: [
                  { value: "#FFA07A", stop: 0 },
                  { value: "#FF4500", stop: 0.2 },
                  { value: "#ff1e00", stop: 0.4 },
                  { value: "#B22222", stop: 0.6 },
                  { value: "#ff3300", stop: 1 },
                ],
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
                speed: 3, // Speed of opacity animation
                opacity_min: 0, // Minimum opacity
                sync: false, // Don't synchronize opacity animation
              },
            },
            size: {
              value: { min: 0.5, max: 2.2 }, // Set the size range for the particles
              animation: {
                enable: true, // Enable size animation
                speed: 2, // Set the speed of size animation
                startValue: "max", // The animation will start from the max value
                destroy: "min", // The particles will be destroyed when they reach the min size
                sync: false, // The size animation will not be synchronized across particles
              },
            },
            move: {
              enable: true, // Enable particle movement
              speed: {
                // Set a range for random movement speed
                min: 6,
                max: 15,
              }, // Particle movement speed
              angle: { offset: 10, value: 5 },
              drift: {
                min: 1,
                max: 2,
              },
              vibrate: {
                min: 1,
                max: 2,
              },
              direction: "top", // Particle movement direction
              straight: false, // No straight movement
              out_mode: "destroy", // Destroy particles when out of canvas
              attract: {
                enable: true,
                rotateX: 1000,
                rotateY: 1200,
              },
              noise: {
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 0.5,
                  },
                  value: 1,
                },
                enable: true,
              },
              // spin: {
              //   enable: true,
              //   acceleration: 1,
              //   position: { x: 50, y: 50 },
              // },
              // gravity: {
              //   enable: true,
              //   acceleration: 2,
              //   maxSpeed: 5,
              //   direction: "top",
              // },
            },
            trail: {
              enable: true,
              length: 10,
              fillColor: {
                value: "#ffffff",
              },
            },
          },
        },

        // ===================================================== RIGHT EMITTER
        {
          direction: "top-left", // Direction of particle movement
          rate: {
            quantity: 1.5, // Quantity of particles emitted per second
            delay: 0.1, // Delay between particles
          },
          size: {
            width: 40, // Emission area width in percentage
            height: 30, // Emission area height in percentage
          },
          position: {
            x: 90, // Emitter x position in percentage
            y: 100, // Emitter y position in percentage
          },
          life: {
            duration: -1, // Infinite emitter duration
            count: 1,
          },
          particles: {
            color: {
              value: ["#FFA07A", "#FF4500", "#ff0000", "#B22222", "#000000"],
              animation: {
                enable: true, // Enable color animation
                speed: 5, // Speed of color animation
                sync: false, // Don't synchronize color animation
                colorStops: [
                  { value: "#FFA07A", stop: 0 },
                  { value: "#FF4500", stop: 0.2 },
                  { value: "#000000", stop: 0.4 },
                  { value: "#B22222", stop: 0.6 },
                  { value: "#ff5100", stop: 1 },
                ],
              },
            },
            shape: {
              type: "circle", // Particle shape
            },
            opacity: {
              // value: 0.6, // Particle opacity
              random: true, // Random opacity for particles
              anim: {
                enable: true, // Enable opacity animation
                speed: 3, // Speed of opacity animation
                opacity_min: 0, // Minimum opacity
                sync: false, // Don't synchronize opacity animation
              },
            },
            size: {
              value: { min: 0.5, max: 2 }, // Set the size range for the particles
              animation: {
                enable: true, // Enable size animation
                speed: 2, // Set the speed of size animation
                startValue: "max", // The animation will start from the max value
                destroy: "min", // The particles will be destroyed when they reach the min size
                sync: false, // The size animation will not be synchronized across particles
              },
            },
            move: {
              enable: true, // Enable particle movement
              speed: {
                // Set a range for random movement speed
                min: 8,
                max: 18,
              }, // Particle movement speed
              angle: { offset: -10, value: 5 },
              drift: {
                min: -1,
                max: 1,
              },
              vibrate: {
                min: -1,
                max: 2,
              },
              direction: "top", // Particle movement direction
              straight: false, // No straight movement
              out_mode: "destroy", // Destroy particles when out of canvas
              attract: {
                enable: true,
                rotateX: 100,
                rotateY: -100,
              },
              noise: {
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 0.5,
                  },
                  value: 1.5,
                },
                enable: true,
              },
              // spin: {
              //   enable: true,
              //   acceleration: 0.5,
              //   position: { x: 50, y: 50 },
              // },
              // gravity: {
              //   enable: true,
              //   acceleration: 2,
              //   maxSpeed: 5,
              //   direction: "top",
              // },
            },
            trail: {
              enable: true,
              length: 10,
              fillColor: {
                value: "#ffffff",
              },
            },
          },
        },

        // ================================ Between middle and right with gravity
        {
          direction: "top-left", // Direction of particle movement
          rate: {
            quantity: 0.5, // Quantity of particles emitted per second
            delay: 0.2, // Delay between particles
          },
          size: {
            width: 60, // Emission area width in percentage
            height: 80, // Emission area height in percentage
          },
          position: {
            x: 60, // Emitter x position in percentage
            y: 50, // Emitter y position in percentage
          },
          life: {
            duration: -1, // Infinite emitter duration
            count: 1,
          },
          particles: {
            color: {
              value: ["#FFA07A", "#FF4500", "#ff0000", "#B22222", "#000000"],
              animation: {
                enable: true, // Enable color animation
                speed: 5, // Speed of color animation
                sync: false, // Don't synchronize color animation
                colorStops: [
                  { value: "#FFA07A", stop: 0 },
                  { value: "#FF4500", stop: 0.2 },
                  { value: "#000000", stop: 0.4 },
                  { value: "#B22222", stop: 0.6 },
                  { value: "#696969", stop: 1 },
                ],
              },
            },
            shape: {
              type: "circle", // Particle shape
            },
            opacity: {
              // value: 0.6, // Particle opacity
              random: true, // Random opacity for particles
              anim: {
                enable: true, // Enable opacity animation
                speed: 3, // Speed of opacity animation
                opacity_min: 0, // Minimum opacity
                sync: false, // Don't synchronize opacity animation
              },
            },
            size: {
              value: { min: 0.5, max: 2 }, // Set the size range for the particles
              animation: {
                enable: true, // Enable size animation
                speed: 2, // Set the speed of size animation
                startValue: "max", // The animation will start from the max value
                destroy: "min", // The particles will be destroyed when they reach the min size
                sync: false, // The size animation will not be synchronized across particles
              },
            },
            move: {
              enable: true, // Enable particle movement
              speed: {
                // Set a range for random movement speed
                min: 3,
                max: 10,
              }, // Particle movement speed
              angle: { offset: 0, value: 5 },
              drift: {
                min: -1,
                max: 1,
              },
              vibrate: {
                min: -1,
                max: 2,
              },
              direction: "top", // Particle movement direction
              straight: false, // No straight movement
              out_mode: "destroy", // Destroy particles when out of canvas
              // attract: {
              //   enable: true,
              //   rotateX: 100,
              //   rotateY: 120,
              // },
              noise: {
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 0.5,
                  },
                  value: 1.5,
                },
                enable: true,
              },
              // spin: {
              //   enable: true,
              //   acceleration: 0.5,
              //   position: { x: 50, y: 50 },
              // },
              gravity: {
                enable: true,
                acceleration: 2,
                maxSpeed: 5,
                direction: "top",
              },
            },
            trail: {
              enable: true,
              length: 10,
              fillColor: {
                value: "#ffffff",
              },
            },
          },
        },
        // ========= Between middle and left with gravity
        {
          direction: "top-right", // Direction of particle movement
          rate: {
            quantity: 0.3, // Quantity of particles emitted per second
            delay: 0.5, // Delay between particles
          },
          size: {
            width: 60, // Emission area width in percentage
            height: 80, // Emission area height in percentage
          },
          position: {
            x: 30, // Emitter x position in percentage
            y: 50, // Emitter y position in percentage
          },
          life: {
            duration: -1, // Infinite emitter duration
            count: 1,
          },
          particles: {
            color: {
              value: ["#FFA07A", "#FF4500", "#ff0000", "#B22222", "#000000"],
              animation: {
                enable: true, // Enable color animation
                speed: 4, // Speed of color animation
                sync: false, // Don't synchronize color animation
                colorStops: [
                  { value: "#FFA07A", stop: 0 },
                  { value: "#FF4500", stop: 0.2 },
                  { value: "#000000", stop: 0.4 },
                  { value: "#B22222", stop: 0.6 },
                  { value: "#696969", stop: 1 },
                ],
              },
            },
            shape: {
              type: "circle", // Particle shape
            },
            opacity: {
              // value: 0.6, // Particle opacity
              random: true, // Random opacity for particles
              anim: {
                enable: true, // Enable opacity animation
                speed: 3, // Speed of opacity animation
                opacity_min: 0, // Minimum opacity
                sync: false, // Don't synchronize opacity animation
              },
            },
            size: {
              value: { min: 0.1, max: 0.5 }, // Set the size range for the particles
              animation: {
                enable: true, // Enable size animation
                speed: 2, // Set the speed of size animation
                startValue: "max", // The animation will start from the max value
                destroy: "min", // The particles will be destroyed when they reach the min size
                sync: false, // The size animation will not be synchronized across particles
              },
            },
            move: {
              enable: true, // Enable particle movement
              speed: {
                // Set a range for random movement speed
                min: 3,
                max: 7,
              }, // Particle movement speed
              angle: { offset: -1, value: 5 },
              drift: {
                min: -1,
                max: 1,
              },
              vibrate: {
                min: 0,
                max: 2,
              },
              direction: "top", // Particle movement direction
              straight: false, // No straight movement
              out_mode: "destroy", // Destroy particles when out of canvas
              // attract: {
              //   enable: true,
              //   rotateX: 100,
              //   rotateY: 120,
              // },
              noise: {
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 0.8,
                  },
                  value: 5.5,
                },
                enable: true,
              },
              // spin: {
              //   enable: true,
              //   acceleration: 0.5,
              //   position: { x: 50, y: 50 },
              // },
              gravity: {
                enable: true,
                acceleration: 3,
                maxSpeed: 5,
                direction: "top",
              },
            },
            trail: {
              enable: true,
              length: 10,
              fillColor: {
                value: "#ffffff",
              },
            },
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
        width: "99%",
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

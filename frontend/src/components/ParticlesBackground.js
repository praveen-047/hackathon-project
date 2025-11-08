import { useEffect } from "react";
import particlesJS from "particles.js";

const ParticlesBackground = () => {
  useEffect(() => {
    // Load the particles configuration
    window.particlesJS("particles-js", {
      particles: {
        number: {
          value: 45,
          density: { enable: true, value_area: 400.85 },
        },
        color: { value: "#969696" },
        shape: {
          type: "circle",
          stroke: { width: 0, color: "#000000" },
          polygon: { nb_sides: 5 },
        },
        opacity: { value: 0.4 },
        size: {
          value: 4,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#ffffff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 3.2,
          random: true,
          straight: false,
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: { enable: false, mode: "repulse" },
          onclick: { enable: false, mode: "repulse" },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }, []);

  return <div id="particles-js"></div>;
};

export default ParticlesBackground;

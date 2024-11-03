"use client";

import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";


const ParticlesBackground = () => {
  // Initialize the tsparticles engine
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    fpsLimit: 60, // Limit FPS to prevent performance issues
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 5,
        random: true,
        anim: {
          enable: true,
          speed: 20,
          size_min: 0.1,
          sync: false,
        },
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        outMode: "out",
        bounce: false,
      },
    },
    interactivity: {
      events: {
        /* onClick: {
          enable: true,
          mode: "repulse",
        }, */
       onHover: {
          enable: true,
          mode: "bubble",
        }, 
        resize: true,
      },
      modes: {
        bubble: {
          distance: 200,
          size: 10,
          duration: 2,
          opacity: 0.8,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit as any} // Correct initialization of particles
      options={particlesOptions as any} // Particle options
      style={{ position: "absolute", width: "100%", height: "100%" }} // Set container style
    />
  );
};

export default ParticlesBackground;

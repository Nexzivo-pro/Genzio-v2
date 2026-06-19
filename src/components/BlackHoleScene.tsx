import { motion } from 'motion/react';

/**
 * BlackHoleScene component which serves as a reserved container for future 3D/Canvas 
 * animations (such as Three.js, React Three Fiber, or complex custom shaders).
 * Currently designed as a lightweight, clean component to preserve performance.
 */
export default function BlackHoleScene() {
  return (
    <div 
      id="root-black-hole-container" 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] pointer-events-none flex items-center justify-center -z-10 select-none overflow-hidden"
    >
      {/* Event Horizon Ring - A subtle futuristic glowing circle indicating the black hole anchor */}
      <div className="relative w-72 h-72 rounded-full flex items-center justify-center">
        {/* Glow Core */}
        <div className="absolute w-44 h-44 rounded-full bg-black shadow-[0_0_80px_rgba(0,243,255,0.15)] border border-neon-cyan/20" />
        
        {/* outer spinning portal aura */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-neon-cyan/10"
        />

        {/* secondary counter-rotating magenta aura */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[85%] h-[85%] rounded-full border border-dotted border-neon-pink/15"
        />

        {/* Glowing light peaks that mimic accretion disk feedback */}
        <div className="absolute inset-0 bg-radial-horizon-glow mix-blend-screen opacity-20 pointer-events-none" />
      </div>
    </div>
  );
}

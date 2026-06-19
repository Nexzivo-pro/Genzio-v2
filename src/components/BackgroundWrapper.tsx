import { ReactNode } from 'react';
import { motion } from 'motion/react';
import BlackHoleScene from './BlackHoleScene';

// Predefined static particle coordinates to prevent costly runtime math evaluation (Low GPU overhead)
const FLOATING_PARTICLES = [
  { id: 1, x: '10%', y: '25%', size: 4, duration: 15, delay: 0, color: '#00f3ff' },
  { id: 2, x: '85%', y: '15%', size: 3, duration: 18, delay: 2, color: '#ff00ff' },
  { id: 3, x: '45%', y: '80%', size: 5, duration: 12, delay: 1, color: '#00f3ff' },
  { id: 4, x: '20%', y: '70%', size: 3, duration: 22, delay: 5, color: '#ff00ff' },
  { id: 5, x: '75%', y: '60%', size: 4, duration: 16, delay: 3, color: '#00f3ff' },
  { id: 6, x: '30%', y: '40%', size: 2, duration: 20, delay: 0, color: '#ffffff' },
  { id: 7, x: '90%', y: '85%', size: 5, duration: 14, delay: 4, color: '#00f3ff' },
  { id: 8, x: '5%', y: '90%', size: 3, duration: 25, delay: 1, color: '#ff00ff' },
  { id: 9, x: '55%', y: '10%', size: 4, duration: 19, delay: 6, color: '#ffffff' },
  { id: 10, x: '80%', y: '45%', size: 3, duration: 17, delay: 2, color: '#ff00ff' }
];

interface BackgroundWrapperProps {
  children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-[#030303]">
      
      {/* BACKGROUND GRAPHIC STACK */}
      <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden">
        
        {/* Layer 1: Deep static matte black base */}
        <div className="absolute inset-0 bg-[#030303]" />

        {/* Layer 2: Moving gradient atmospheric blobs */}
        <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-40">
          {/* Cyan Blob */}
          <motion.div
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-[-10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-neon-cyan/8 blur-[140px] will-change-transform"
          />
          
          {/* Pink Blob */}
          <motion.div
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 40, -30, 0],
              scale: [1, 0.85, 1.1, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[-15%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-neon-pink/10 blur-[150px] will-change-transform"
          />
        </div>

        {/* Layer 3: Floating digital bio-dust particles (GPU optimized hardware-accelerated drifts) */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {FLOATING_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ y: '110vh', opacity: 0 }}
              animate={{ 
                y: '-10vh', 
                opacity: [0, 0.7, 0.7, 0],
                x: ['0px', p.id % 2 === 0 ? '40px' : '-40px', '0px']
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "linear",
              }}
              style={{
                position: 'absolute',
                left: p.x,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                willChange: 'transform'
              }}
            />
          ))}
        </div>

        {/* Layer 4: Subtle animated cyber matrix grid (Sliding downward continuously) */}
        <div className="absolute inset-0 bg-cyber-grid opacity-[0.06] will-change-background" />

        {/* Layer 5: Ambient radial blur vignetting and glows to ground contrast */}
        <div className="absolute inset-0 bg-radial-gradient-vignette opacity-85" />

        {/* Layer 6: Reserved central point for future interactive black holes */}
        <BlackHoleScene />

        {/* Extra Fine CRT scanline / tech grain overlay for premium cyberpunk textures */}
        <div className="absolute inset-0 bg-scanlines mix-blend-overlay opacity-[0.02]" />

      </div>

      {/* FOREGROUND LAYOUT CONTENT CONTAINER */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {children}
      </div>

    </div>
  );
}

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import BlackHoleScene from './BlackHoleScene';

// Predefined static particle coordinates to prevent costly runtime math evaluation (Low GPU overhead)
const FLOATING_PARTICLES = [
  { id: 1, x: '10%', y: '25%', size: 4, duration: 15, delay: 0, color: '#00f3ff' },
  { id: 3, x: '45%', y: '80%', size: 5, duration: 12, delay: 1, color: '#00f3ff' },
  { id: 4, x: '20%', y: '70%', size: 3, duration: 22, delay: 5, color: '#ff00ff' },
  { id: 7, x: '90%', y: '85%', size: 5, duration: 14, delay: 4, color: '#00f3ff' },
  { id: 8, x: '5%', y: '90%', size: 3, duration: 25, delay: 1, color: '#ff00ff' }
];

interface BackgroundWrapperProps {
  children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const particles = isMobile ? FLOATING_PARTICLES.slice(0, 2) : FLOATING_PARTICLES;

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-[#030303]">
      
      {/* BACKGROUND GRAPHIC STACK */}
      <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden">
        
        {/* Layer 1: Deep static matte black base */}
        <div className="absolute inset-0 bg-[#030303]" />

        {/* Layer 2: Moving gradient atmospheric blobs */}
        <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-20">
          {/* Cyan Blob */}
          <div className="absolute top-[-10%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-neon-cyan/5 blur-[80px] transform-gpu translate-z-0" />
          
          {/* Pink Blob */}
          <div className="absolute bottom-[-15%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-neon-pink/5 blur-[80px] transform-gpu translate-z-0" />
        </div>

        {/* Layer 3: Floating digital bio-dust particles (GPU optimized hardware-accelerated drifts) */}
        {!isMobile && (
          <div className="absolute inset-0 z-10 overflow-hidden">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: '110vh', opacity: 0 }}
                animate={{ 
                  y: '-10vh', 
                  opacity: [0, 0.5, 0]
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
                  willChange: 'transform'
                }}
              />
            ))}
          </div>
        )}

        {/* Layer 5: Ambient radial blur vignetting and glows to ground contrast */}
        <div className="absolute inset-0 bg-radial-gradient-vignette opacity-85" />

        {/* Layer 6: Reserved central point for future interactive black holes */}
        {!isMobile && <BlackHoleScene />}

      </div>

      {/* FOREGROUND LAYOUT CONTENT CONTAINER */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {children}
      </div>

    </div>
  );
}

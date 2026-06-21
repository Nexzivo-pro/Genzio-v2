import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function InitialLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [unmount, setUnmount] = useState(false);

  useEffect(() => {
    // Check if the user has visited in this session
    const hasVisited = sessionStorage.getItem('genzioHasVisited');
    if (hasVisited) {
      setIsLoading(false);
      setUnmount(true);
      return;
    }
    
    // Set visited flag
    sessionStorage.setItem('genzioHasVisited', 'true');
    
    // Loader duration (800ms)
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setUnmount(true), 1000); // Wait for exit animation
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const text = "Genzio AI";

  if (unmount) return null;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-2xl bg-[var(--bg-base)]"
        >
          <div className="relative flex flex-col items-center">
            {/* Logo Orb container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.1, 1],
                opacity: 1,
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="relative w-20 h-20 mb-8 flex items-center justify-center"
            >
              {/* Outer Glow */}
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px 0px rgba(0,243,255,0.4), 0 0 20px 0px rgba(255,0,255,0.4)",
                    "0 0 40px 10px rgba(0,243,255,0.6), 0 0 40px 10px rgba(255,0,255,0.6)",
                    "0 0 20px 0px rgba(0,243,255,0.4), 0 0 20px 0px rgba(255,0,255,0.4)",
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-full opacity-20 blur-xl"
                style={{
                  background: "linear-gradient(to top right, var(--accent-cyan), var(--accent-pink))"
                }}
              />
              
              {/* Central Orb */}
              <div 
                className="absolute inset-0 rounded-2xl flex items-center justify-center overflow-hidden border"
                style={{
                  backgroundColor: "var(--surface-base)",
                  borderColor: "rgba(255,255,255,0.1)"
                }}
              >
                 <div 
                   className="w-6 h-6 rounded-full"
                   style={{
                     background: "linear-gradient(to top right, var(--accent-cyan), var(--accent-pink))"
                   }} 
                 />
              </div>
            </motion.div>

            {/* Text Animation */}
            <div className="flex space-x-1 overflow-hidden">
              {text.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + index * 0.05,
                    ease: "easeOut"
                  }}
                  className="text-3xl font-display font-medium tracking-wider"
                  style={{ color: "var(--text-primary)" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
            
            {/* Initializing Text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 text-xs font-mono tracking-[0.3em] uppercase"
              style={{ color: "var(--accent-cyan)" }}
            >
              Initializing.
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

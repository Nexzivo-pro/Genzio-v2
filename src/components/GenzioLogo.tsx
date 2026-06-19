import React from 'react';
import { motion } from 'motion/react';

interface GenzioLogoProps {
  className?: string; // used for defining the outer box size (e.g. w-8 h-8, w-12 h-12)
  isDark?: boolean;
}

export const GenzioLogo: React.FC<GenzioLogoProps> = ({ className = "w-8 h-8", isDark = true }) => {
  const solidStart = isDark ? "#ffffff" : "#0f172a";
  const solidEnd = isDark ? "#a1a1aa" : "#475569";
  const glowCyan = "#00f3ff";
  const glowPink = "#ff00ff";

  return (
    <div className={`relative flex items-center justify-center group select-none ${className}`}>
      {/* Outer subtle backdrop glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/20 to-neon-pink/20 rounded-full blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
        
        <defs>
          <linearGradient id="genzio-base" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={solidStart} />
            <stop offset="100%" stopColor={solidEnd} />
          </linearGradient>
        </defs>

        {/* Base Solid Silhouette (The Vault / Core) */}
        <g stroke="url(#genzio-base)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
          {/* Main vertical core engine */}
          <path d="M 37 32 V 68" />
          {/* Input channel */}
          <path d="M 15 50 H 37" />
          {/* Branches */}
          <path d="M 37 32 L 55 14 H 85" strokeWidth="7" />
          <path d="M 37 50 H 85" strokeWidth="7" />
          <path d="M 37 68 L 55 86 H 85" strokeWidth="7" />
        </g>

        {/* Data Nodes (Dots) Base */}
        <circle cx="15" cy="50" r="4" fill={solidStart} />
        <circle cx="85" cy="14" r="4" fill={solidStart} />
        <circle cx="85" cy="50" r="4" fill={solidStart} />
        <circle cx="85" cy="86" r="4" fill={solidStart} />

        {/* Animated Flow Paths */}
        {/* Top Branch (Cyan) */}
        <motion.path
          d="M 15 50 H 37 V 32 L 55 14 H 85"
          stroke={glowCyan}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.6, 1] }}
          className="drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]"
        />

        {/* Middle Branch (Solid White Flow) */}
        <motion.path
          d="M 15 50 H 85"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.6, 1], delay: 1 }}
        />

        {/* Bottom Branch (Pink) */}
        <motion.path
          d="M 15 50 H 37 V 68 L 55 86 H 85"
          stroke={glowPink}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", times: [0, 0.6, 1], delay: 1.5 }}
          className="drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
        />

        {/* End Node Arrival Pulses */}
        <motion.circle
          cx="85" cy="14" r="4" fill={glowCyan}
          animate={{ scale: [1, 1.8, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.8 }}
          className="drop-shadow-[0_0_5px_rgba(0,243,255,1)]"
        />
        
        <motion.circle
          cx="85" cy="50" r="4" fill="#ffffff"
          animate={{ scale: [1, 1.8, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2.8 }}
        />

        <motion.circle
          cx="85" cy="86" r="4" fill={glowPink}
          animate={{ scale: [1, 1.8, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 3.3 }}
          className="drop-shadow-[0_0_5px_rgba(255,0,255,1)]"
        />

        {/* Central Engine / T-Junction Pulse */}
        <motion.rect
          x="35" y="48" width="4" height="4" rx="2" fill="#00f3ff"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="drop-shadow-[0_0_8px_rgba(0,243,255,1)]"
        />
      </svg>
    </div>
  );
};

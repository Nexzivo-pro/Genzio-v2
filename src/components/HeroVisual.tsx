import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Zap,
  Target,
  RefreshCw,
  Send,
  CheckCircle2,
  User,
  Clock,
  MessageSquare,
} from "lucide-react";

const simulatorSteps = [
  {
    icon: <User className="w-8 h-8 text-neon-cyan" />,
    title: "Lead Imported",
    color: "neon-cyan",
    bgClass: "bg-neon-cyan/20",
    textClass: "text-neon-cyan",
    borderClass: "border-neon-cyan/50",
    glow: "shadow-[0_0_30px_rgba(0,243,255,0.4)]",
    desc: "10x variables enriched",
    duration: 2500
  },
  {
    icon: <Sparkles className="w-8 h-8 text-purple-400" />,
    title: "Variables Personalized",
    color: "purple-400",
    bgClass: "bg-purple-400/20",
    textClass: "text-purple-400",
    borderClass: "border-purple-400/50",
    glow: "shadow-[0_0_30px_rgba(192,132,252,0.4)]",
    desc: "AI icebreaker generated",
    duration: 2500
  },
  {
    icon: <Clock className="w-8 h-8 text-yellow-400" />,
    title: "Smart Delay Applied",
    color: "yellow-400",
    bgClass: "bg-yellow-400/20",
    textClass: "text-yellow-400",
    borderClass: "border-yellow-400/50",
    glow: "shadow-[0_0_30px_rgba(250,204,21,0.4)]",
    desc: "Waiting for optimal open time",
    duration: 2500
  },
  {
    icon: <Send className="w-8 h-8 text-neon-cyan" />,
    title: "Email Sent",
    color: "neon-cyan",
    bgClass: "bg-neon-cyan/20",
    textClass: "text-neon-cyan",
    borderClass: "border-neon-cyan/50",
    glow: "shadow-[0_0_30px_rgba(0,243,255,0.4)]",
    desc: "Delivered to primary inbox",
    duration: 2500
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-neon-pink" />,
    title: "Reply Tracked",
    color: "neon-pink",
    bgClass: "bg-neon-pink/20",
    textClass: "text-neon-pink",
    borderClass: "border-neon-pink/50",
    glow: "shadow-[0_0_30px_rgba(255,0,255,0.4)]",
    desc: "Positive intent identified",
    duration: 3000
  },
];

function Sparkles(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export function LiveOutreachSimulator() {
  const [activeStep, setActiveStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const nextStep = () => {
      setActiveStep((prev) => {
        const next = (prev + 1) % simulatorSteps.length;
        timeout = setTimeout(nextStep, simulatorSteps[next].duration);
        return next;
      });
    };
    timeout = setTimeout(nextStep, simulatorSteps[0].duration);
    return () => clearTimeout(timeout);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ 
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div 
      className="relative w-full max-w-[420px] mx-auto lg:ml-auto group"
      onMouseMove={handleMouseMove}
    >
      {/* Background gradients and particles */}
      <div className="absolute -inset-8 bg-gradient-to-tr from-neon-cyan/20 to-neon-pink/20 blur-[80px] opacity-50 group-hover:opacity-70 transition-opacity duration-1000 rounded-full pointer-events-none" />
      
      {/* Subtle orbit/energy lines */}
      <div className="absolute inset-[-4rem] border border-white/5 rounded-full border-dashed animate-[spin_40s_linear_infinite] pointer-events-none hidden md:block" />
      <div className="absolute inset-[-2.5rem] border border-neon-cyan/10 rounded-full animate-[spin_30s_linear_infinite_reverse] pointer-events-none hidden md:block" />
      
      <div className="relative glass p-[2px] rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden hover:-translate-y-2 transition-transform duration-500 bg-gradient-to-b from-white/10 to-transparent">
        
        {/* Mouse interactive spotlight glow */}
        <div 
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-overlay z-10"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.4), transparent 40%)`
          }}
        />

        <div className="bg-[#050508]/80 backdrop-blur-3xl rounded-[2.4rem] p-6 sm:p-8 relative overflow-hidden border border-white/5">
           
           {/* Top Header */}
           <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
             </div>
             <div className="flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
               </span>
               <div className="text-[10px] font-mono text-neon-cyan tracking-[0.2em] font-bold uppercase">
                 Live Simulator
               </div>
             </div>
           </div>
           
           {/* Stage */}
           <div className="relative h-[220px] flex flex-col justify-center items-center">
              <AnimatePresence mode="popLayout">
                {simulatorSteps.map((step, idx) => {
                  if (idx !== activeStep) return null;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center w-full"
                    >
                      <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${step.borderClass} ${step.bgClass} ${step.glow}`}>
                        {/* Ping ring */}
                        <div className={`absolute inset-0 rounded-2xl border ${step.borderClass} animate-ping opacity-20`} />
                        {step.icon}
                      </div>

                      <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-sm font-mono text-gray-400 mb-6 tracking-wide">
                        {step.desc}
                      </p>

                      <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: step.duration / 1000, ease: "linear" }}
                          className={`absolute top-0 left-0 bottom-0 ${step.bgClass.replace('/20', '')}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
           </div>

           {/* Metrics bar */}
           <div className="mt-8 flex justify-between items-center text-[10px] sm:text-xs font-mono text-gray-400 border-t border-white/5 pt-5">
             <div className="flex items-center gap-1.5 hover:text-neon-cyan transition-colors">
               <Zap className="w-3.5 h-3.5 text-neon-cyan" />
               12ms Latency
             </div>
             <div className="flex items-center gap-1.5 hover:text-neon-pink transition-colors">
               <Target className="w-3.5 h-3.5 text-neon-pink" />
               Auto-Rotate IP
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function Shield(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 4.8 17 6 19 6a1 1 0 0 1 1 1z" />
    </svg>
  );
}

export function FloatingEmailCards() {
  const cards = [
    {
      text: "Hi {{Name}}",
      delay: 0,
      x: -180,
      y: 10,
      rotate: -12,
      color: "text-neon-cyan",
      borderColor: "border-neon-cyan/30",
    },
    {
      text: "Follow-up scheduled",
      delay: 1,
      x: 200,
      y: -40,
      rotate: 8,
      color: "text-purple-400",
      borderColor: "border-purple-400/30",
    },
    {
      text: "Open tracked",
      delay: 2,
      x: -150,
      y: 150,
      rotate: -5,
      color: "text-neon-pink",
      borderColor: "border-neon-pink/30",
    },
    {
      text: "Reply detected",
      delay: 3,
      x: 180,
      y: 120,
      rotate: 10,
      color: "text-green-400",
      borderColor: "border-green-400/30",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block z-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: card.y + 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [card.y + 20, card.y, card.y - 10, card.y - 20],
              x: [card.x, card.x, card.x, card.x],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: card.delay * 2,
              ease: "linear",
            }}
            style={{
              rotate: card.rotate,
              position: "absolute",
              top: "50%",
              left: "50%",
              marginLeft: "-50px",
              marginTop: "-50px",
            }}
            className={`glass-card px-4 py-2 rounded-xl border ${card.borderColor} bg-[#0a0a0f]/80 backdrop-blur-md shadow-xl flex items-center justify-center whitespace-nowrap`}
          >
            <span
              className={`text-sm font-bold font-mono tracking-wide ${card.color}`}
            >
              {card.text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function GenzioAIOrb() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get position relative to screen center
      const x = (e.clientX - window.innerWidth / 2) * 0.05;
      const y = (e.clientY - window.innerHeight / 2) * 0.05;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
      <motion.div
        animate={{
          x: mousePosition.x * 2 - 120, // offset to the left of the main content
          y: mousePosition.y * 2 - 40,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute top-1/2 left-1/2"
      >
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Core Orb */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan via-[#00a2ff] to-neon-pink p-[1px] shadow-[0_0_40px_rgba(0,243,255,0.4)]">
            <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-neon-cyan/20 animate-pulse"></div>
              <Sparkles className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_10px_#00f3ff] relative z-10" />
            </div>
          </div>

          {/* Glowing ring */}
          <div className="absolute -inset-4 rounded-full border border-neon-cyan/20 animate-[spin_4s_linear_infinite]" />
          <div className="absolute -inset-4 rounded-full border border-neon-pink/20 animate-[spin_3s_linear_infinite_reverse]" />

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neon-cyan tracking-widest uppercase opacity-70 whitespace-nowrap">
            Genzio AI
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

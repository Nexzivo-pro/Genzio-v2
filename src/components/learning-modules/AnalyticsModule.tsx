import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Reply,
  XCircle,
} from "lucide-react";

const METRICS = [
  {
    id: "open",
    label: "Open Rate",
    icon: <TrendingUp className="w-5 h-5 text-neon-cyan" />,
    value: 68,
    suffix: "%",
    desc: "Percentage of delivered emails that were opened. Genzio uses smart tracking pixels.",
  },
  {
    id: "reply",
    label: "Reply Rate",
    icon: <Reply className="w-5 h-5 text-neon-pink" />,
    value: 24,
    suffix: "%",
    desc: "Percentage of opened emails that received a response. Our AI optimization drives this up.",
  },
  {
    id: "click",
    label: "Click Rate",
    icon: <MousePointerClick className="w-5 h-5 text-purple-400" />,
    value: 12,
    suffix: "%",
    desc: "Percentage of clicks on links inside your email. Useful for tracking lead intent.",
  },
  {
    id: "bounce",
    label: "Bounce Rate",
    icon: <XCircle className="w-5 h-5 text-red-500" />,
    value: 1.2,
    suffix: "%",
    desc: "Invalid emails that bounced back. Kept low by our built-in Verification engine.",
  },
];

const AnimatedCounter: React.FC<{ value: number; suffix: string }> = ({
  value,
  suffix,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1500; // 1.5 seconds

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(value * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span className="font-display">
      {count.toFixed(value % 1 === 0 ? 0 : 1)}
      {suffix}
    </span>
  );
};

export default function AnalyticsModule() {
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % METRICS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto h-full">
      {/* Description / Left Panel */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-neon-cyan" /> Analytics
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Granular insights into your campaign health. Real-time metrics
            tracking.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {METRICS.map((m, idx) => (
            <div
              key={m.id}
              onClick={() => setActiveMetric(idx)}
              className={`p-4 rounded-xl border flex gap-4 items-start cursor-pointer transition-all duration-300 ${
                activeMetric === idx
                  ? "bg-white/10 border-white/30 scale-105"
                  : "bg-transparent border-transparent opacity-50 hover:opacity-100 hover:bg-white/5"
              }`}
            >
              <div className="mt-1 shrink-0">{m.icon}</div>
              <div>
                <div className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  {m.label}
                </div>
                <div
                  className={`text-xs text-gray-400 overflow-hidden transition-all duration-300 ${activeMetric === idx ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {m.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Area */}
      <div className="w-full md:w-2/3 h-[450px] relative bg-[#050508] border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 overflow-hidden shadow-2xl">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-neon-cyan/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-neon-pink/5 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md relative z-10">
          <div className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest text-center">
            {METRICS[activeMetric].label} Performance
          </div>

          <div className="text-6xl font-black text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink drop-shadow-[0_0_15px_rgba(255,0,255,0.3)]">
            <AnimatedCounter
              key={activeMetric}
              value={METRICS[activeMetric].value}
              suffix={METRICS[activeMetric].suffix}
            />
          </div>

          <div className="flex items-end justify-between h-32 gap-3 pb-2 border-b border-white/20 relative">
            {/* Trend line SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <motion.path
                key={`path-${activeMetric}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d="M0,80 L20,60 L40,85 L60,40 L80,50 L100,10"
                fill="none"
                strokeWidth="3"
                stroke={
                  METRICS[activeMetric].id === "open"
                    ? "#00f3ff"
                    : METRICS[activeMetric].id === "reply"
                      ? "#ff00ff"
                      : "#a855f7"
                }
                className="drop-shadow-[0_0_8px_currentColor]"
              />
            </svg>

            {/* Bars */}
            {[40, 50, 30, 70, 60, 90].map((h, i) => (
              <motion.div
                key={`bar-${activeMetric}-${i}`}
                initial={{ height: 0 }}
                animate={{
                  height: `${METRICS[activeMetric].id === "bounce" ? h / 2 : h}%`,
                }}
                transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                className="w-full bg-white/5 rounded-t-lg relative group z-10"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity rounded-t-lg ${
                    METRICS[activeMetric].id === "open"
                      ? "bg-neon-cyan"
                      : METRICS[activeMetric].id === "reply"
                        ? "bg-neon-pink"
                        : "bg-purple-500"
                  }`}
                />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-mono">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
        </div>
      </div>
    </div>
  );
}

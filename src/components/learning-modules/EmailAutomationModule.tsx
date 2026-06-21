import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Database, Edit3, Eye, Clock, Zap, BarChart3, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 'connect', icon: <Mail />, title: 'Connect Email', desc: 'Securely sync your inboxes.' },
  { id: 'import', icon: <Database />, title: 'Import Leads', desc: 'Upload CSV or sync Google Sheets directly.' },
  { id: 'variables', icon: <Edit3 />, title: 'Insert Variables', desc: 'Personalize emails at scale automatically.' },
  { id: 'preview', icon: <Eye />, title: 'Preview Emails', desc: 'Check dynamic content before sending.' },
  { id: 'delays', icon: <Clock />, title: 'Smart Delays', desc: 'Set human-like sending intervals.' },
  { id: 'launch', icon: <Zap />, title: 'Launch Campaign', desc: 'Dispatch with optimized rotation.' },
  { id: 'track', icon: <BarChart3 />, title: 'Track Replies', desc: 'Monitor engagement in real-time.' },
];

export default function EmailAutomationModule() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto">
      {/* Left: Progress Steps */}
      <div className="w-full md:w-1/3 flex flex-col gap-2">
        {STEPS.map((step, index) => {
          const isActive = index === activeStepIndex;
          const isPast = index < activeStepIndex;
          
          return (
            <div 
              key={step.id}
              onClick={() => setActiveStepIndex(index)}
              className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                isActive ? 'bg-[#0a0a0f] border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.15)] scale-105 z-10' : 
                isPast ? 'bg-white/5 border-white/10 opacity-50' : 'bg-transparent border-transparent opacity-40 hover:opacity-100 hover:bg-white/5'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                isActive ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan' :
                isPast ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-white/10 border-white/20 text-gray-500'
              }`}>
                {isPast ? <CheckCircle2 className="w-4 h-4" /> : React.cloneElement(step.icon as React.ReactElement, { className: 'w-4 h-4' })}
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isActive ? 'text-neon-cyan' : 'text-gray-300'}`}>{step.title}</h4>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{step.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Visual Area */}
      <div className="w-full md:w-2/3 h-[400px] bg-[#050508] border border-white/10 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden">
        {/* Dynamic decorative background */}
        <div className="absolute inset-0 bg-[#00f3ff]/5 bg-scanlines pointer-events-none opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-cyan/10 blur-[80px] rounded-full pointer-events-none"></div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStepIndex}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full flex-1 h-full flex items-center justify-center relative z-10"
          >
            <RenderVisual stepIndex={activeStepIndex} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function RenderVisual({ stepIndex }: { stepIndex: number }) {
  if (stepIndex === 0) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.2)] flex items-center justify-center relative overflow-hidden">
           <Mail className="w-8 h-8 text-neon-cyan" />
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(0,243,255,0.4)_360deg)] opacity-50" />
        </div>
        <div className="px-4 py-2 bg-green-500/10 text-green-400 text-xs font-mono rounded border border-green-500/20 flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3" /> admin@company.com connected
        </div>
      </div>
    );
  }
  if (stepIndex === 1) {
    return (
      <div className="flex flex-col w-full max-w-sm gap-2">
        <div className="text-xs font-mono text-gray-500 text-center mb-2">parsing CSV columns...</div>
        {[1,2,3].map((i) => (
          <motion.div 
            key={i}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
            className="h-10 bg-white/5 rounded-lg border border-white/10 flex items-center px-4 gap-4"
          >
            <div className="w-4 h-4 rounded bg-gray-700/50" />
            <div className="h-2 bg-gray-600/50 rounded flex-1" />
            <div className={`w-12 h-2 rounded ${i===1 ? 'bg-neon-cyan/50' : 'bg-gray-600/50'}`} />
          </motion.div>
        ))}
      </div>
    );
  }
  if (stepIndex === 2) {
    return (
      <div className="w-full max-w-sm bg-[#0a0a0f] p-4 rounded-xl border border-white/10 text-left font-mono text-xs text-gray-400">
        Hi <motion.span animate={{ backgroundColor: ['rgba(255,0,255,0)', 'rgba(255,0,255,0.2)', 'rgba(255,0,255,0)'] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-neon-pink px-1 rounded">{"{{firstName}}"}</motion.span>,<br/><br/>
        I noticed <motion.span animate={{ backgroundColor: ['rgba(0,243,255,0)', 'rgba(0,243,255,0.2)', 'rgba(0,243,255,0)'] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="text-neon-cyan px-1 rounded">{"{{company}}"}</motion.span> is expanding. Let's talk about solutions...
      </div>
    );
  }
  if (stepIndex === 3) {
    return (
      <div className="w-full max-w-sm bg-white p-4 rounded-xl shadow-2xl relative text-left">
        <div className="text-xs text-gray-500 mb-2 border-b pb-2">To: john@acmecorp.com</div>
        <div className="text-sm text-black font-sans leading-relaxed">
          Hi <strong>John</strong>,<br/><br/>
          I noticed <strong>Acme Corp</strong> is expanding. Let's talk about solutions...
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
    );
  }
  if (stepIndex === 4) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-48 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "20%", x: "0%" }}
            animate={{ width: "20%", x: "400%" }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 bottom-0 bg-neon-cyan shadow-[0_0_10px_#00f3ff]" 
          />
        </div>
        <div className="text-xs font-mono text-neon-cyan">Delay: 45s - 90s (Humanized)</div>
      </div>
    );
  }
  if (stepIndex === 5) {
    return (
      <div className="flex flex-col items-center gap-4">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ duration: 1, repeat: Infinity }}
          className="w-20 h-20 rounded-full bg-neon-pink/20 border-2 border-neon-pink flex items-center justify-center shadow-[0_0_30px_rgba(255,0,255,0.4)]"
        >
          <Zap className="w-10 h-10 text-neon-pink" />
        </motion.div>
        <div className="text-xs font-mono text-white tracking-widest uppercase">Campaign Live</div>
      </div>
    );
  }
  
  // stepIndex 6 Track
  return (
    <div className="w-full max-w-sm flex items-end justify-between h-32 gap-2 border-b border-l border-white/20 p-2">
      {[30, 45, 20, 60, 80, 50, 95].map((h, i) => (
        <motion.div 
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ duration: 0.8, delay: i * 0.1, type: "spring" }}
          className="w-full bg-neon-cyan/50 rounded-t-sm relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-neon-cyan/30" />
        </motion.div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, PlayCircle, BarChart3, Mail, RefreshCw, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';

const CAMPAIGNS = [
  { id: 1, name: 'Q3 Enterprise Outbound', sent: 1420, replies: 156, status: 'active', progress: 45 },
  { id: 2, name: 'SaaS Founder Connect', sent: 500, replies: 42, status: 'paused', progress: 12 },
  { id: 3, name: 'Agency Partner Reactivation', sent: 850, replies: 102, status: 'active', progress: 88 },
];

export default function CampaignsModule() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev + 1) % 5);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto h-full">
      {/* Description Panel */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-neon-pink" /> Campaign Manager
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Orchestrate complex multi-step sequences. Launch, manage, and scale effortlessly from one dashboard.
          </p>
        </div>

        <div className="space-y-1 border-l-2 border-white/10 ml-2 pl-4">
          <div className={`text-sm transition-all duration-300 ${step === 0 ? 'text-neon-pink font-bold -ml-[19px] border-l-2 border-neon-pink pl-4' : 'text-gray-500'}`}>1. Create Campaign</div>
          <div className={`text-sm transition-all duration-300 ${step === 1 ? 'text-neon-pink font-bold -ml-[19px] border-l-2 border-neon-pink pl-4' : 'text-gray-500'}`}>2. Name & Setup</div>
          <div className={`text-sm transition-all duration-300 ${step === 2 ? 'text-neon-pink font-bold -ml-[19px] border-l-2 border-neon-pink pl-4' : 'text-gray-500'}`}>3. Assign Inboxes</div>
          <div className={`text-sm transition-all duration-300 ${step === 3 ? 'text-neon-pink font-bold -ml-[19px] border-l-2 border-neon-pink pl-4' : 'text-gray-500'}`}>4. Sequence Logic</div>
          <div className={`text-sm transition-all duration-300 ${step === 4 ? 'text-neon-pink font-bold -ml-[19px] border-l-2 border-neon-pink pl-4' : 'text-gray-500'}`}>5. Launch & Monitor</div>
        </div>
      </div>

      {/* Visual Area */}
      <div className="w-full md:w-2/3 max-w-xl h-[450px] relative bg-[#050508] border border-white/10 rounded-2xl flex items-center justify-center shadow-xl p-4 md:p-8 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-4 w-full">
               {CAMPAIGNS.map(c => (
                 <div key={c.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-sm text-white font-bold">{c.name}</div>
                      <div className="text-xs text-gray-500 flex gap-2 mt-1">
                        <span><Mail className="w-3 h-3 inline mr-1" />{c.sent}</span>
                        <span><RefreshCw className="w-3 h-3 inline mr-1" />{c.replies} reps</span>
                      </div>
                    </div>
                    {c.status === 'active' ? 
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> : 
                      <span className="w-2 h-2 rounded-full bg-gray-500" />
                    }
                 </div>
               ))}
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                 <button className="bg-neon-pink text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,255,0.4)]">
                    <Plus className="w-5 h-5" /> New Campaign
                 </button>
               </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm bg-white/5 border border-white/10 p-6 rounded-2xl">
               <div className="text-xs text-gray-400 mb-2 font-mono">CAMPAIGN NAME</div>
               <div className="w-full h-12 bg-black/50 border border-neon-pink/50 rounded-xl flex items-center px-4 mb-4 shadow-[0_0_15px_rgba(255,0,255,0.1)]">
                 <span className="text-white">Q4 Marketing Leaders</span>
                 <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-0.5 h-5 bg-neon-pink ml-1" />
               </div>
               <button className="w-full bg-white text-black font-bold py-3 rounded-xl">Continue</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-sm bg-white/5 border border-white/10 p-6 rounded-2xl">
               <div className="text-xs text-gray-400 mb-4 font-mono">ASSIGN SENDERS (LOAD BALANCING)</div>
               <div className="space-y-2 mb-6">
                 {['sales@domain.com', 'admin@domain.com', 'team@domain.com'].map((email, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-black/50 rounded-lg border border-neon-cyan/20">
                     <span className="text-sm text-gray-300">{email}</span>
                     <CheckCircle2 className="w-4 h-4 text-neon-cyan" />
                   </div>
                 ))}
               </div>
               <button className="w-full bg-white text-black font-bold py-3 rounded-xl">Next Step</button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center items-center">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-32 py-2 bg-[#0a0a0f] border border-white/20 rounded-lg text-center text-xs text-white">Step 1: Welcome</div>
                 <div className="h-4 w-px bg-white/20" />
                 <div className="px-3 py-1 bg-neon-pink/20 text-neon-pink border border-neon-pink/30 rounded text-[10px]">Wait 3 Days</div>
                 <div className="h-4 w-px bg-white/20" />
                 <div className="w-32 py-2 bg-[#0a0a0f] border border-white/20 rounded-lg text-center text-xs text-white">Step 2: Value Drop</div>
                 <div className="h-4 w-px bg-white/20" />
                 <div className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded text-[10px]">If no reply (4 Days)</div>
                 <div className="h-4 w-px bg-white/20" />
                 <div className="w-32 py-2 bg-[#0a0a0f] border border-white/20 rounded-lg text-center text-xs text-white">Step 3: Breakup</div>
               </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full flex flex-col gap-4">
              <div className="bg-gradient-to-r from-neon-pink/10 to-neon-cyan/10 border border-white/10 p-5 rounded-2xl flex items-center justify-between">
                 <div>
                   <div className="text-white font-bold text-lg mb-1">Q4 Marketing Leaders <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded ml-2 align-middle">LIVE</span></div>
                   <div className="text-xs text-gray-400 font-mono">1,245 contacts • 3 steps • 3 inboxes</div>
                 </div>
                 <PlayCircle className="w-8 h-8 text-neon-cyan" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                   <div className="text-[10px] uppercase text-gray-500 mb-1">Progress</div>
                   <div className="text-2xl font-bold text-white">45%</div>
                   <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-neon-pink" transition={{ duration: 1 }} />
                   </div>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                   <div className="text-[10px] uppercase text-gray-500 mb-1">Replies</div>
                   <div className="text-2xl font-bold text-neon-cyan">24</div>
                   <div className="text-[10px] text-gray-500 mt-1">Today</div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

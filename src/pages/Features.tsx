import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Mail, Zap, Database, BarChart3, Clock, 
  MessageSquare, Users, Workflow, Sparkles, Fingerprint, 
  ChevronRight, Inbox, RefreshCw, XCircle, CheckCircle2,
  FileSpreadsheet, Edit3
} from 'lucide-react';
import AIMythDecoder from '../components/AIMythDecoder';

const floatingParticles = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: 5 + Math.random() * 10,
  delay: Math.random() * 5,
  size: Math.random() * 3 + 1,
}));

// Section 2 Data
const featuresList = [
  {
    title: "Multi Inbox Connection",
    icon: <Inbox className="w-6 h-6" />,
    desc: "Connect unlimited sender emails horizontally to scale volume safely.",
    color: "cyan"
  },
  {
    title: "Campaign Automation",
    icon: <Workflow className="w-6 h-6" />,
    desc: "Visual drag-and-drop builder for complex logical branching.",
    color: "pink"
  },
  {
    title: "Follow-up Sequences",
    icon: <RefreshCw className="w-6 h-6" />,
    desc: "Auto-pause on reply, and send conditional secondary steps.",
    color: "purple"
  },
  {
    title: "Smart Delays",
    icon: <Clock className="w-6 h-6" />,
    desc: "Human-like natural sending velocity and timezone matching.",
    color: "cyan"
  },
  {
    title: "Google Sheets Integration",
    icon: <FileSpreadsheet className="w-6 h-6" />,
    desc: "Live bi-directional sync for leads and campaign data.",
    color: "pink"
  },
  {
    title: "Template Library",
    icon: <Edit3 className="w-6 h-6" />,
    desc: "High-converting community-tested templates with A/B variation.",
    color: "purple"
  },
  {
    title: "Signature Manager",
    icon: <Fingerprint className="w-6 h-6" />,
    desc: "Rotate custom HTML signatures across all connected inboxes.",
    color: "cyan"
  },
  {
    title: "Campaign Analytics",
    icon: <BarChart3 className="w-6 h-6" />,
    desc: "Real-time parsing of opens, absolute clicks, and categorized replies.",
    color: "pink"
  },
  {
    title: "Genzio AI Assistant",
    icon: <Sparkles className="w-6 h-6" />,
    desc: "Let AI draft sequences, analyze sentiment, and suggest optimizations.",
    color: "purple"
  }
];

// Section 3 Data
const workflowSteps = [
  { name: "Connect Email", icon: <Mail /> },
  { name: "Import Leads", icon: <Database /> },
  { name: "Create Campaign", icon: <Edit3 /> },
  { name: "Launch Automation", icon: <Zap /> },
  { name: "Track Results", icon: <BarChart3 /> }
];

export default function Features() {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Auto-advance workflow steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep(prev => (prev + 1) % workflowSteps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#050508] min-h-screen pt-20 overflow-hidden font-sans">
      
      {/* SECTION 1: Interactive Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center p-6 md:p-12 border-b border-white/5">
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-neon-cyan/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Floating Particles */}
        {floatingParticles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
              <span className="text-[10px] font-mono tracking-widest text-neon-pink uppercase font-bold">Premium Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-tight tracking-tight">
              Everything You Need To <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink">Automate Outreach.</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-xl font-medium leading-relaxed">
              One platform for email automation, campaign management, analytics, and AI assistance. Designed for modern hyper-growth teams.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link to="/signup" className="btn-primary hover-glow-cyan flex items-center justify-center gap-2 group/btn py-4">
                Start Automation <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* AI Orb interactions element */}
          <div className="relative flex justify-center items-center h-[400px]">
             <div className="absolute w-[400px] h-[400px] bg-neon-cyan/10 blur-[100px] rounded-full" />
             <div className="absolute w-[300px] h-[300px] bg-neon-pink/10 blur-[80px] rounded-full translate-x-12 translate-y-12" />
             
             {/* The Hero AI Orb */}
             <motion.div 
               className="w-48 h-48 rounded-full border border-white/10 glass shadow-[inset_0_0_40px_rgba(0,243,255,0.2),0_0_50px_rgba(0,243,255,0.2)] flex items-center justify-center relative z-10 bg-gradient-to-br from-[#0a1520] to-[#120a1c]"
               animate={{ y: [-15, 15, -15] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             >
                <motion.div 
                  className="w-32 h-32 rounded-full border border-dashed border-neon-pink/30 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-10 h-10 text-neon-cyan animate-pulse" />
                </motion.div>
             </motion.div>
             
             {/* Orbiting Elements */}
             <motion.div 
               className="absolute w-[320px] h-[320px] rounded-full border border-white/5"
               animate={{ rotate: -360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0a0f] border border-neon-cyan flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                  <Mail className="w-3 h-3 text-neon-cyan" />
                </div>
                <div className="absolute bottom-12 right-6 w-8 h-8 rounded-full bg-[#0a0a0f] border border-neon-pink flex items-center justify-center shadow-[0_0_15px_rgba(255,10,120,0.5)]">
                  <Users className="w-4 h-4 text-neon-pink" />
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Feature Explorer */}
      <section className="py-32 relative bg-[#010103] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-4">
              Explore The Engine
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Master-class toolsets built natively for modern operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feature, idx) => (
              <div 
                key={idx}
                className="group relative h-48 md:h-56 bg-[#0a0a0f] border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-white/20 transition-all duration-500 cursor-default shadow-xl"
              >
                {/* Background glow injected on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none ${
                    feature.color === 'cyan' ? 'from-neon-cyan to-transparent' : 
                    feature.color === 'pink' ? 'from-neon-pink to-transparent' : 
                    'from-purple-500 to-transparent'
                  }`} 
                />
                
                {/* Floating icon */}
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 ${
                    feature.color === 'cyan' ? 'border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5 group-hover:border-neon-cyan group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 
                    feature.color === 'pink' ? 'border-neon-pink/30 text-neon-pink bg-neon-pink/5 group-hover:border-neon-pink group-hover:shadow-[0_0_20px_rgba(255,10,120,0.3)]' : 
                    'border-purple-500/30 text-purple-400 bg-purple-500/5 group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                }`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{feature.title}</h3>
                
                <p className="text-sm text-gray-500 font-medium leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.desc}
                </p>

                {/* Decorative bottom line */}
                <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out ${
                    feature.color === 'cyan' ? 'bg-neon-cyan' : 
                    feature.color === 'pink' ? 'bg-neon-pink' : 
                    'bg-purple-500'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Interactive Workflow */}
      <section className="py-32 relative bg-[#050508] border-b border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-4">
              The Path To Scale
            </h2>
            <p className="text-gray-400 text-lg">Linear logic mapping for nonlinear results.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 max-w-5xl mx-auto relative">
            {/* Visual connector line background */}
            <div className="hidden md:block absolute top-[50px] left-10 right-10 h-0.5 bg-white/5 -z-10" />
            
            {/* Animated connector overlay */}
            <div className="hidden md:block absolute top-[50px] left-10 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-pink -z-10 shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all duration-500" 
                 style={{ width: `calc(${(activeWorkflowStep / (workflowSteps.length - 1)) * 100}% - 40px)` }} 
            />

            {workflowSteps.map((step, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center w-full md:w-32 relative cursor-pointer group"
                onClick={() => setActiveWorkflowStep(idx)}
              >
                {/* Node icon circle */}
                <div className={`w-24 h-24 rounded-full border-2 flex items-center justify-center bg-[#0a0a0f] transition-all duration-500 relative z-10 ${
                  activeWorkflowStep === idx 
                    ? 'border-neon-cyan text-neon-cyan shadow-[0_0_30px_rgba(0,243,255,0.2)] scale-110' 
                    : activeWorkflowStep > idx
                    ? 'border-neon-pink text-neon-pink shadow-[0_0_20px_rgba(255,10,120,0.1)]'
                    : 'border-white/10 text-gray-500 group-hover:border-white/30'
                }`}>
                  <div className="w-8 h-8">
                    {step.icon}
                  </div>
                  {activeWorkflowStep === idx && (
                    <motion.div 
                       layoutId="workflow-ring"
                       className="absolute inset-[-10px] rounded-full border border-neon-cyan/40 dashed-spin"
                    />
                  )}
                </div>

                {/* Node Label */}
                <div className="mt-6 text-center">
                  <span className={`text-xs font-mono font-bold tracking-widest uppercase transition-colors duration-300 block mb-1 ${
                    activeWorkflowStep === idx ? 'text-neon-cyan' : activeWorkflowStep > idx ? 'text-neon-pink' : 'text-gray-600'
                  }`}>
                    STEP 0{idx + 1}
                  </span>
                  <h4 className={`font-display font-bold transition-colors ${
                    activeWorkflowStep === idx ? 'text-white' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <style>{`
          .dashed-spin { animation: dashedSpin 10s linear infinite; border-style: dashed; }
          @keyframes dashedSpin { 100% { transform: rotate(360deg); } }
        `}</style>
      </section>

      {/* SECTION 4: Myth vs Reality */}
      <AIMythDecoder />

      {/* SECTION 5: Feature Comparison */}
      <section className="py-32 relative bg-[#010103] border-t border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-4">
              The Architecture Upgrade
            </h2>
            <p className="text-gray-400 text-lg">Compare obsolete methodologies versus the modern Genzio standard.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional Outreach Card */}
            <div className="bg-[#050508] border border-white/5 rounded-[2.5rem] p-10 opacity-70 scale-[0.98] transition-transform hover:scale-100 hover:opacity-100">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-12 h-12 rounded-xl bg-gray-800/50 flex items-center justify-center border border-white/5">
                  <XCircle className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-gray-300">Legacy Outreach</h3>
                  <p className="text-xs font-mono text-gray-500 tracking-wider">PRE-2025 STANDARD</p>
                </div>
              </div>
              
              <ul className="space-y-6">
                {[
                  "Single domain sending causing fast IP burn.",
                  "Manual spreadsheet tracking for responses.",
                  "Generic 'Hi {{Name}}' spray-and-pray.",
                  "Zero visibility into spam filter placements.",
                  "Slow, manual inbox warmup phases."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-gray-400 items-start">
                     <span className="mt-1 text-gray-600 block shrink-0"><XCircle className="w-5 h-5" /></span>
                     <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Genzio Standard Card */}
            <div className="bg-gradient-to-br from-[#0a0a0f] to-[#040914] border border-neon-cyan/20 rounded-[2.5rem] p-10 relative shadow-[0_30px_60px_-15px_rgba(0,243,255,0.05)] scale-100 overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full group-hover:bg-neon-cyan/30 transition-all" />
              
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                  <CheckCircle2 className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Genzio Workflow</h3>
                  <p className="text-xs font-mono text-neon-cyan tracking-wider font-bold">MODERN STANDARD</p>
                </div>
              </div>

              <ul className="space-y-6 relative z-10">
                {[
                  "Dynamic multi-inbox rotation protecting IP trust.",
                  "Automated label parsing & sentiment analysis.",
                  "AI hyper-personalization pulling live firmographics.",
                  "Real-time deliverability health scoring.",
                  "Automated background warmup pacing algorithms."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-gray-200 items-start">
                     <span className="mt-1 text-neon-cyan block shrink-0"><CheckCircle2 className="w-5 h-5" /></span>
                     <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Call To Action */}
      <section className="py-32 relative overflow-hidden bg-[#030305]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(0,243,255,0.1)_360deg)] animate-spin" style={{ animationDuration: '10s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-[#0a0a0f] to-[#04040a] rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan to-neon-pink rounded-3xl blur-[15px] opacity-20"></div>
             <Zap className="w-8 h-8 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight mb-8">
            Ready To Automate <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-purple-400">Smarter?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
            Join elite tier operators. Launch your first intelligent outbound sequencer in under 15 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary hover-glow-cyan flex items-center justify-center gap-2 group/btn py-4 px-8 text-lg w-full sm:w-auto">
              Start Automation <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
            <Link to="/tool/email-automation" className="btn-secondary py-4 px-8 text-lg w-full sm:w-auto hover:bg-white/5 border border-white/5 hover:border-white/20 transition-all font-medium">
              Explore Tool UI
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

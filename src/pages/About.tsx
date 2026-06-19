import { motion } from 'motion/react';
import { Target, Eye, Zap, Shield, Sparkles, Cpu, Layers, Globe } from 'lucide-react';

export default function About() {
  const milestones = [
    { year: '2023', title: 'The Inception', desc: 'Born from NEXZIVO lab to solve enterprise cold email deliverability challenges.' },
    { year: '2024', title: 'Engine V1 Launch', desc: 'Introduced smart distribution and auto-warmup layers, hitting 99% placement rates.' },
    { year: '2025', title: 'AI Integration', desc: 'Pioneered contextual conversational AI generation specifically for sales outreach.' },
    { year: '2026', title: 'Global Scale', desc: 'Scaling outbound engines for the top 500 fastest growing B2B companies worldwide.' }
  ];

  return (
    <div className="flex flex-col gap-32 pb-32 pt-40 overflow-hidden">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-display font-extrabold mb-8 tracking-tight"
        >
          We build <br className="hidden md:block"/> <span className="text-gradient drop-shadow-[0_0_30px_rgba(255,0,255,0.3)]">engines of growth.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
        >
          Redefining how modern sales teams engage with prospects through bleeding-edge AI and intelligent automation infrastructure.
        </motion.p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-card hover-glow-cyan p-12 flex flex-col items-start hover-float rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-cyan/10 blur-[50px] rounded-full group-hover:bg-neon-cyan/20 transition-colors" />
            <div className="p-5 bg-[#030303] border border-neon-cyan/30 rounded-2xl mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.15)]">
              <Target className="w-10 h-10 text-neon-cyan" />
            </div>
            <h3 className="text-4xl font-extrabold mb-6 font-display text-white group-hover:text-neon-cyan transition-colors">The Mission</h3>
            <p className="text-gray-300 leading-relaxed text-lg z-10">
              To empower revenue teams with intelligent automation that eliminates manual busywork, 
              ensures pristine deliverability, and turns cold prospects into booked meetings predictably.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="glass-card-pink hover-glow-pink p-12 flex flex-col items-start hover-float rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-pink/10 blur-[50px] rounded-full group-hover:bg-neon-pink/20 transition-colors" />
            <div className="p-5 bg-[#030303] border border-neon-pink/30 rounded-2xl mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,0,255,0.15)]">
              <Eye className="w-10 h-10 text-neon-pink" />
            </div>
            <h3 className="text-4xl font-extrabold mb-6 font-display text-white group-hover:text-neon-pink transition-colors">The Vision</h3>
            <p className="text-gray-300 leading-relaxed text-lg z-10">
              We envision a future where outbound sales is completely friction-free—where software 
              handles the strategy of delivery flawlessly, allowing humans to focus entirely on building relationships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visual Timeline */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold">The <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">Evolution</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.15 }}
               className="glass-card p-8 rounded-[2rem] border-white/5 hover:border-neon-cyan/50 hover-glow-cyan hover-float flex flex-col items-start relative group"
             >
               <div className="text-5xl font-black text-transparent opacity-20 bg-clip-text bg-gradient-to-r from-neon-cyan to-white absolute top-4 right-6 group-hover:opacity-40 transition-opacity">
                 '{m.year.slice(2)}
               </div>
               <div className="text-neon-cyan font-mono font-bold tracking-widest mb-4">
                 {m.year}
               </div>
               <h4 className="text-2xl font-bold font-display text-white mb-3 group-hover:text-neon-cyan transition-colors">{m.title}</h4>
               <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
             </motion.div>
          ))}
        </div>
      </section>

      {/* Why Genzio & NEXZIVO */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center bg-[#0a0a0f]/80 p-12 md:p-16 rounded-[3rem] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="space-y-10">
            <h2 className="text-4xl md:text-5xl font-display font-extrabold mb-8">Technology <span className="text-neon-cyan text-gradient">Showcase</span></h2>
            <div className="space-y-8">
              {[
                { title: 'AI-Native Architecture', desc: 'Built from the ground up with AI injected into every step.', icon: <Cpu className="w-6 h-6 text-neon-cyan" /> },
                { title: 'Deliverability First', desc: 'Industry-leading infrastructure ensuring emails land in primary inbox.', icon: <Layers className="w-6 h-6 text-purple-400" /> },
                { title: 'Global Coverage', desc: 'Multi-region compliance and routing for latency-free delivery.', icon: <Globe className="w-6 h-6 text-neon-pink" /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="p-4 glass rounded-2xl border border-white/10 group-hover:border-neon-cyan/50 group-hover:scale-110 transition-all bg-[#050508] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-neon-cyan/10 transition-colors"></div>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-white group-hover:text-neon-cyan transition-colors">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-pink p-12 rounded-[2.5rem] relative overflow-hidden min-h-[500px] flex flex-col justify-center text-center hover-glow-pink hover-float group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,255,0.15)_0%,_transparent_70%)] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-700" />
            <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="w-48 h-48 text-neon-pink" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full glass border border-neon-pink/30 text-neon-pink font-bold text-xs uppercase tracking-widest mb-4">
                Enterprise Backing
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-extrabold text-white">Backed by <span className="text-neon-pink">NEXZIVO</span></h2>
              <p className="text-gray-300 leading-relaxed text-lg px-4">
                Being part of the NEXZIVO ecosystem gives Genzio an unfair advantage. 
                We leverage enterprise-grade security protocols, massive data pipelines, and cutting-edge 
                machine learning research that standalone startups simply cannot match.
              </p>
              <a href="https://nexzivo.com" target="_blank" rel="noreferrer" className="btn-secondary inline-flex mt-8 hover-glow-pink bg-neon-pink/10 border-neon-pink text-white">
                Explore NEXZIVO Ecosystem &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

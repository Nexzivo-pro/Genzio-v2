import { motion } from 'motion/react';
import { Mail, MessageSquare, MapPin, Building, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  return (
    <div className="relative flex flex-col gap-24 pb-24 pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 min-h-screen">
      
      {/* Background Orbits and Glows */}
      <div className="absolute top-[10%] left-0 w-[600px] h-[600px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-orbit" />
      <div className="absolute bottom-[20%] right-0 w-[500px] h-[500px] bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-orbit-reverse" />

      {/* Header & Main Contact Area */}
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 relative">
        <div className="flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 self-start backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span className="text-[10px] font-mono tracking-widest text-gray-300 uppercase font-bold">Priority Communications</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight leading-tight"
          >
            Let's talk about <br />
            <span className="text-gradient">growth.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-lg leading-relaxed font-medium"
          >
            Whether you are exploring high-volume infrastructure or custom API deployments, our engineering and strategy teams are ready.
          </motion.p>

          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="group flex items-start gap-6 hover-float p-4 -ml-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="p-4 bg-[#0a0a0f] border border-neon-cyan/20 rounded-2xl text-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.1)] group-hover:bg-neon-cyan/10 transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-display font-bold text-white text-xl mb-1 group-hover:text-neon-cyan transition-colors">Business Intelligence</h3>
                <p className="text-gray-400 text-sm mb-2">For general inquiries and infrastructure support.</p>
                <a href="mailto:hello@genzio.com" className="text-neon-cyan font-mono tracking-wider font-bold hover:underline transition-all">hello@genzio.com</a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="group flex items-start gap-6 hover-float p-4 -ml-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="p-4 bg-[#0a0a0f] border border-neon-pink/20 rounded-2xl text-neon-pink shadow-[0_0_20px_rgba(255,10,120,0.1)] group-hover:bg-neon-pink/10 transition-colors">
                <Building className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-display font-bold text-white text-xl mb-1 group-hover:text-neon-pink transition-colors">Enterprise Volume</h3>
                <p className="text-gray-400 text-sm mb-2">Custom architecture and dedicated account managers.</p>
                <a href="mailto:sales@genzio.com" className="text-neon-pink font-mono tracking-wider font-bold hover:underline transition-all">sales@genzio.com</a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="group flex items-start gap-6 hover-float p-4 -ml-4 rounded-2xl hover:bg-white/5 transition-all cursor-default"
            >
              <div className="p-4 bg-[#0a0a0f] border border-purple-500/20 rounded-2xl text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)] group-hover:bg-purple-500/10 transition-colors">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-display font-bold text-white text-xl mb-2 group-hover:text-purple-400 transition-colors">Global Operations</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  100 Innovation Way, Suite 400<br/>
                  San Francisco, CA 94105
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-[#050508]/80"
        >
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-neon-cyan via-neon-pink to-transparent opacity-80" />
          
          <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3 text-white">
            <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
               <MessageSquare className="w-5 h-5 text-neon-cyan" />
            </span>
            Connection Protocol
          </h2>
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-cyan transition-colors ml-1">First Name</label>
                <input type="text" className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-neon-cyan outline-none transition-all shadow-inner text-lg" placeholder="John" />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-cyan transition-colors ml-1">Last Name</label>
                <input type="text" className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-neon-cyan outline-none transition-all shadow-inner text-lg" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-cyan transition-colors ml-1">Work Email</label>
              <input type="email" className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-neon-cyan outline-none transition-all shadow-inner text-lg" placeholder="john@company.com" />
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 group-focus-within:text-neon-cyan transition-colors ml-1">Transmission Data</label>
              <textarea rows={5} className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-neon-cyan outline-none transition-all resize-none shadow-inner text-lg leading-relaxed" placeholder="Detailed objective regarding volume, integrations, or strategy..."></textarea>
            </div>

            <button type="submit" className="magnetic-btn w-full py-5 rounded-2xl bg-white text-black font-display font-black text-lg tracking-wide hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-3 mt-4 group">
              Initialize Transmission <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>

      {/* FAQ */}
      <section className="pt-24 border-t border-white/5 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
           <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-4">Operations <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-purple-400">FAQ</span></h2>
           <p className="text-gray-400 text-lg">Direct answers to scale-related inquiries.</p>
        </div>
        <div className="space-y-6">
          {[
            { q: 'How fast is the onboarding deployment?', a: 'Immediate. You can authorize inboxes, set constraints, and initialize your first sequence in under 15 minutes. Our interface is designed for rapid architectural deployment.' },
            { q: 'Do you offer custom enterprise volume pricing?', a: 'Yes. For infrastructures requiring over 50 connected mailboxes or specialized reverse-proxy API integrations, please transmit a request to enterprise sales.' },
            { q: 'What separates Genzio from standard sequencers?', a: 'We focus obsessively on architectural delivery. Our infrastructure utilizes dynamic neural checking to parse syntax and warm active IPs automatically before transmission, keeping you out of spam networks.' }
          ].map((faq, i) => (
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               key={i} 
               className="glass p-8 md:p-10 rounded-[2rem] border border-white/5 hover:border-neon-cyan/20 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,243,255,0.05)] cursor-default"
            >
              <h4 className="font-display font-bold text-xl md:text-2xl mb-3 text-white flex items-start gap-4">
                 <span className="text-neon-cyan mt-1 opacity-50 font-mono text-sm leading-none">0{i+1}</span>
                 {faq.q}
              </h4>
              <p className="text-gray-400 leading-relaxed pl-8 md:pl-10">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Area */}
      <section className="glass p-12 md:p-20 text-center rounded-[3rem] relative overflow-hidden border border-white/10 mt-12 bg-[#050508]/80 group">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-cyan/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-pink/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">Access the Engine.</h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
            Bypass the evaluation process. Initialize your workspace immediately and experience the infrastructure firsthand.
          </p>
          <div className="flex justify-center flex-wrap gap-6">
            <Link to="/signup" className="magnetic-btn bg-white text-black font-display font-black text-lg px-8 py-4 rounded-xl flex items-center gap-3 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all">
              Initialize Trial <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

import { MessageSquare, Sparkles, Send, Bot, User, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function AIChat() {
  return (
    <div className="relative min-h-[calc(100vh-6rem)] w-full lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-0 flex flex-col pt-8">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-pink/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] pointer-events-none -z-10 rounded-full" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 glass p-6 rounded-[2rem] border border-white/5 shadow-2xl mb-8 opacity-0 animate-fade-in mx-auto w-full max-w-4xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center animate-pulse-slow">
              <Sparkles className="w-6 h-6 text-neon-pink" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
            </span>
          </div>
          <div>
             <h1 className="text-2xl font-display font-black text-white tracking-tight">Nova Central</h1>
             <p className="text-sm font-bold uppercase tracking-widest text-neon-pink/80 mt-1">Autonomous Agent v2.0</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 glass-card border border-white/5 shadow-2xl rounded-[2.5rem] p-6 lg:p-8 flex flex-col relative overflow-hidden opacity-0 animate-fade-in mx-auto w-full max-w-4xl" style={{ animationDelay: '0.1s' }}>
         <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-pink/30 to-transparent"></div>
         
         <div className="flex-1 flex flex-col justify-end space-y-6 overflow-hidden relative z-10 pb-4">
            {/* System Message */}
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex items-center justify-center mb-8"
            >
               <span className="text-[10px] font-mono tracking-widest text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">SESSION INITIALIZED</span>
            </motion.div>

            {/* AI Message */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 }}
               className="flex items-start gap-4"
            >
               <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_rgba(255,10,120,0.15)]">
                  <Bot className="w-5 h-5 text-neon-pink" />
               </div>
               <div className="bg-[#050508] border border-white/5 shadow-inner p-5 rounded-2xl rounded-tl-sm text-gray-300 text-[15px] leading-relaxed max-w-[85%] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  Greetings. I am Nova, your dedicated growth architect. I've analyzed your sequences and prepared three optimization strategies designed to increase engagement by approximately 24%. How would you like to proceed?
               </div>
            </motion.div>

            {/* User Message */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.7 }}
               className="flex items-start gap-4 justify-end"
            >
               <div className="bg-[#0a0a0f] border border-white/10 shadow-inner p-5 rounded-2xl rounded-tr-sm text-gray-300 text-[15px] leading-relaxed max-w-[85%]">
                  Show me the strategies, particularly focusing on the Q3 enterprise cohort.
               </div>
               <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-shrink-0 items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
               </div>
            </motion.div>

            {/* AI Message (Typing) */}
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1.2 }}
               className="flex items-start gap-4"
            >
               <div className="w-10 h-10 rounded-xl bg-neon-pink/10 border border-neon-pink/20 flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_rgba(255,10,120,0.15)]">
                  <Bot className="w-5 h-5 text-neon-pink" />
               </div>
               <div className="bg-[#050508] border border-white/5 shadow-inner p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-pink animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-neon-pink animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-neon-pink animate-bounce" style={{ animationDelay: '300ms' }}></span>
               </div>
            </motion.div>
         </div>

         {/* Input Area */}
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 relative"
         >
            <div className="relative group hover-float">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-pink to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
               <div className="relative flex items-center bg-[#050508] border border-white/10 rounded-[2rem] p-2 pr-4 shadow-2xl">
                  <button className="p-3 bg-white/5 hover:bg-neon-pink/10 hover:text-neon-pink rounded-xl text-gray-400 transition-colors ml-1">
                     <Zap className="w-5 h-5" />
                  </button>
                  <input
                     type="text"
                     placeholder="Command Nova..."
                     className="flex-1 bg-transparent border-none text-white px-4 py-3 placeholder:text-gray-600 focus:outline-none placeholder:font-mono placeholder:text-sm placeholder:tracking-widest"
                     readOnly
                  />
                  <button className="p-3 bg-neon-pink hover:bg-white text-black rounded-xl transition-colors shadow-[0_0_20px_rgba(255,10,120,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                     <Send className="w-5 h-5" />
                  </button>
               </div>
            </div>
            <div className="mt-4 text-center">
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Model generating response...</span>
            </div>
         </motion.div>
      </div>
    </div>
  );
}

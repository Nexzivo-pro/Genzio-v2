import { BarChart3, Download, Calendar, Activity, PieChart, TrendingUp } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-8 relative z-10 w-full lg:max-w-7xl mx-auto px-4 sm:px-6 md:px-0">
      {/* Background glow effects */}
      <div className="absolute top-[20%] right-1/4 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-[60%] left-1/4 w-[400px] h-[400px] bg-neon-pink/5 blur-[100px] pointer-events-none -z-10 rounded-full" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 glass p-6 sm:p-8 rounded-[2rem] border border-white/5 shadow-2xl">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-300">Data & Insights</span>
          </div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">Analytics.</h1>
          <p className="text-gray-400 font-medium">Deep dive into your campaign performance metrics.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 text-gray-300 font-bold text-sm hover:text-white hover:border-white/30 flex items-center justify-center gap-2 transition-all hover-float shadow-inner">
            <Calendar className="w-4 h-4" />
            <span>Last 30 Days</span>
          </button>
          <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover-float transition-all shadow-inner group">
            <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="glass-card p-10 h-96 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-[#0a0a0f] rounded-2xl border border-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:border-neon-cyan/30 transition-colors">
            <BarChart3 className="w-10 h-10 text-gray-600 group-hover:text-neon-cyan transition-colors" />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-2">Visualization Pending</h3>
          <p className="text-gray-400 font-medium text-center max-w-md">Not enough continuous data streams detected to render the master visualization canvas.</p>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-600 mt-4 px-4 py-2 bg-white/5 rounded-full border border-white/5">Check back soon</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 min-h-[350px] rounded-[2rem] border border-white/5 group hover:border-white/10 transition-colors relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-display font-bold text-white">Top Performing Sequences</h3>
          </div>
          <div className="flex flex-col items-center justify-center h-48 bg-[#0a0a0f] rounded-xl border border-white/5 shadow-inner">
            <Activity className="w-8 h-8 text-gray-700 mb-3" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">No telemetry available</span>
          </div>
        </div>
        
        <div className="glass-card p-8 min-h-[350px] rounded-[2rem] border border-white/5 group hover:border-white/10 transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-neon-pink/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="w-5 h-5 text-neon-pink" />
            <h3 className="text-lg font-display font-bold text-white">Reply Intent Analysis</h3>
          </div>
          <div className="flex flex-col items-center justify-center h-48 bg-[#0a0a0f] rounded-xl border border-white/5 shadow-inner">
             <div className="flex items-end gap-2 mb-4 opacity-50 grayscale mix-blend-screen">
                <div className="w-3 h-8 bg-neon-pink/50 rounded-sm"></div>
                <div className="w-3 h-12 bg-purple-500/50 rounded-sm"></div>
                <div className="w-3 h-6 bg-neon-cyan/50 rounded-sm"></div>
                <div className="w-3 h-10 bg-white/50 rounded-sm"></div>
             </div>
            <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Awaiting Signal</span>
          </div>
        </div>
      </div>
    </div>
  );
}

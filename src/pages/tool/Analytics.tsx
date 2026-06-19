import { useState } from 'react';
import { LineChart, BarChart3, CheckCircle2, PlayCircle, MousePointerClick, Reply, TrendingUp } from 'lucide-react';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="bg-transparent text-white min-h-screen pt-32 pb-24 font-sans max-w-6xl mx-auto px-4 lg:px-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight mb-4 text-white">
            Campaign <span className="text-neon-pink">Analytics</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Track exact delivery states, open rates, clicks, and replies across all sequences.
          </p>
        </div>
        <div className="flex gap-2">
           {['24h', '7d', '30d'].map(range => (
             <button
               key={range}
               onClick={() => setTimeRange(range)}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                 timeRange === range ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,255,0.4)]' : 'bg-[#121214] text-gray-400 border border-white/5 hover:border-white/20'
               }`}
             >
               {range}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><PlayCircle className="w-20 h-20 text-neon-cyan" /></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Total Dispatched</p>
          <p className="text-4xl font-display font-black text-white">12,405</p>
          <div className="mt-4 flex items-center gap-1 text-neon-cyan text-sm font-bold">
            <TrendingUp className="w-4 h-4" /> +14% this week
          </div>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><CheckCircle2 className="w-20 h-20 text-neon-pink" /></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Emails Opened</p>
          <p className="text-4xl font-display font-black text-white">4,821</p>
          <p className="mt-2 text-sm text-gray-500 font-mono">38.8% Open Rate</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><MousePointerClick className="w-20 h-20 text-neon-cyan" /></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Link Clicks</p>
          <p className="text-4xl font-display font-black text-white">1,504</p>
          <p className="mt-2 text-sm text-gray-500 font-mono">12.1% Click Rate</p>
        </div>

        <div className="glass p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all"><Reply className="w-20 h-20 text-white" /></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Warm Replies</p>
          <p className="text-4xl font-display font-black text-neon-pink">392</p>
          <p className="mt-2 text-sm text-gray-500 font-mono">3.1% Reply Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="glass p-8 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <LineChart className="w-5 h-5 text-neon-cyan" />
              <h3 className="font-display font-bold text-xl">Performance Trend</h3>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
               {[40, 60, 45, 80, 55, 90, 75, 110, 85, 130, 100, 140].map((h, i) => (
                 <div key={i} className="w-full bg-neon-cyan/20 hover:bg-neon-cyan transition-all rounded-t-sm" style={{ height: `${h}px` }}></div>
               ))}
            </div>
         </div>

         <div className="glass p-8 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-neon-pink" />
              <h3 className="font-display font-bold text-xl">Campaign Leaderboard</h3>
            </div>
            <div className="flex flex-col gap-4">
               {[ 
                 { name: 'Q3 Enterprise Sequences', replies: 89, color: 'neon-cyan' },
                 { name: 'SaaS Founder Direct', replies: 45, color: 'neon-pink' },
                 { name: 'Agency Partner Outreach', replies: 32, color: 'white' },
               ].map((camp, i) => (
                 <div key={i} className="flex justify-between items-center bg-[#050508] p-4 rounded-xl border border-white/5">
                    <p className="font-bold text-sm text-white">{camp.name}</p>
                    <div className="flex items-center gap-3">
                       <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className={`bg-${camp.color} h-full rounded-full`} style={{ width: `${(camp.replies/100)*100}%` }}></div>
                       </div>
                       <p className="text-xs font-mono font-bold w-6 text-right">{camp.replies}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}

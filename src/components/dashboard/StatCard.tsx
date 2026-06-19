import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  isPositive?: boolean;
  delay?: number;
}

export function StatCard({ title, value, icon, trend, isPositive, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 flex flex-col group relative overflow-hidden"
    >
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-neon-cyan/10 transition-colors duration-500 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.1)] group-hover:border-neon-cyan/40 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm tracking-wide font-medium px-2 py-1 rounded-md border ${
            isPositive 
              ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' 
              : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
          }`}>
            {isPositive ? '+' : ''}{trend}
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-gray-400 text-sm font-medium tracking-wide uppercase mb-1">{title}</h3>
        <p className="text-3xl font-display font-semibold text-white tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}

export function EmptyState({ title, description, action }: { title: string, description: string, action?: ReactNode }) {
  return (
    <div className="glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-white/20">
      <div className="w-16 h-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-xl font-display font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/5" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-white/5 rounded" />
          <div className="h-3 w-24 bg-white/5 rounded" />
        </div>
      </div>
      <div className="h-6 w-20 bg-white/5 rounded-full" />
    </div>
  );
}

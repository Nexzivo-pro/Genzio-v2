import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, XCircle, AlertTriangle, Download, ShieldCheck } from 'lucide-react';

const EMAILS = [
  { email: 'john.doe@techcorp.io', status: 'pending', delay: 1000 },
  { email: 'sarah.smith@startup.net', status: 'pending', delay: 1500 },
  { email: 'info@fake-domain123.com', status: 'pending', delay: 2000 },
  { email: 'contact@acmecorp.com', status: 'pending', delay: 2500 },
  { email: 'mike@unknown-server.co', status: 'pending', delay: 3000 },
  { email: 'support@designstudio.us', status: 'pending', delay: 3500 },
];

export default function EmailVerifierModule() {
  const [isRunning, setIsRunning] = useState(false);
  const [emails, setEmails] = useState(EMAILS);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    let timers: NodeJS.Timeout[] = [];
    
    // reset
    setEmails(EMAILS.map(e => ({...e, status: 'checking'})));
    setCompleted(false);

    EMAILS.forEach((e, idx) => {
      const timer = setTimeout(() => {
        setEmails(prev => {
          const arr = [...prev];
          let finalStatus = 'valid';
          if (arr[idx].email.includes('fake')) finalStatus = 'invalid';
          if (arr[idx].email.includes('unknown')) finalStatus = 'catch-all';
          arr[idx].status = finalStatus;
          return arr;
        });

        if (idx === EMAILS.length - 1) {
          setTimeout(() => setCompleted(true), 500);
        }
      }, e.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [isRunning]);

  const reset = () => {
    setIsRunning(false);
    setEmails(EMAILS);
    setCompleted(false);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto h-full">
      {/* Description Panel */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-neon-cyan" /> Email Verifier
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Eliminate bounces before you send. Ensure up to 99% deliverability instantly.
          </p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => isRunning ? reset() : setIsRunning(true)}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
              isRunning && !completed ? 'bg-white/10 text-gray-500 cursor-not-allowed' :
              completed ? 'bg-white text-black hover:bg-gray-200' :
              'bg-neon-cyan text-black hover:bg-[#00e3ee] shadow-[0_0_20px_rgba(0,243,255,0.3)]'
            }`}
            disabled={isRunning && !completed}
          >
           {isRunning && !completed ? <span className="flex h-4 w-4 bg-transparent border-2 border-gray-500 border-t-white rounded-full animate-spin" /> : 
            completed ? <><Download className="w-4 h-4" /> Export Verified</> : 
            <><Play className="w-4 h-4" /> Run Verification</>}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="bg-[#050508] p-3 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-gray-500 mb-1">Valid</div>
            <div className="text-lg font-bold text-green-400">{emails.filter(e => e.status === 'valid').length}</div>
          </div>
          <div className="bg-[#050508] p-3 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-gray-500 mb-1">Catch-all</div>
            <div className="text-lg font-bold text-yellow-400">{emails.filter(e => e.status === 'catch-all').length}</div>
          </div>
          <div className="bg-[#050508] p-3 rounded-lg border border-white/10 text-center">
            <div className="text-xs text-gray-500 mb-1">Invalid</div>
            <div className="text-lg font-bold text-red-500">{emails.filter(e => e.status === 'invalid').length}</div>
          </div>
        </div>
      </div>

      {/* Verification List UI */}
      <div className="w-full md:w-2/3 max-w-lg bg-[#050508] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400 tracking-wider">VERIFICATION LOGS</span>
          <span className="text-[10px] font-mono text-neon-cyan px-2 py-0.5 rounded bg-neon-cyan/10">Scanning Database...</span>
        </div>
        
        <div className="p-2 min-h-[300px]">
          <AnimatePresence>
            {emails.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 border-b border-white/5 last:border-0"
              >
                <span className={`text-sm font-mono ${item.status === 'invalid' ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                  {item.email}
                </span>

                <div className="flex items-center">
                  {item.status === 'pending' && <span className="text-[10px] text-gray-500 font-mono">WAITING</span>}
                  {item.status === 'checking' && <span className="w-4 h-4 rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan animate-spin inline-block" />}
                  {item.status === 'valid' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-green-400 text-xs">
                       <CheckCircle2 className="w-4 h-4" /> Valid
                    </motion.div>
                  )}
                  {item.status === 'catch-all' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-yellow-400 text-xs">
                       <AlertTriangle className="w-4 h-4" /> Risky
                    </motion.div>
                   )}
                  {item.status === 'invalid' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-red-500 text-xs">
                       <XCircle className="w-4 h-4" /> Invalid
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

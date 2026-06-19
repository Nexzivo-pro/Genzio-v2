import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Server, Database, Layers, Sparkles, LineChart } from 'lucide-react';

export function Step1ConnectView() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-500 mb-2">// SECURE SENDER INTEGRATIONS</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-matte-black/55 border border-neon-cyan/25 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <Mail className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-sm font-bold">sales@domain.com</div>
              <div className="text-[10px] text-gray-500 font-mono">Gmail / Google Workspace</div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-sm animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.2)]">
            ACTIVE
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-matte-black/55 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold">partner@domain.com</div>
              <div className="text-[10px] text-gray-500 font-mono">Office 365 Exchange</div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-sm">
            VERIFIED
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-matte-black/55 border border-white/5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Server className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-bold">smtp.outbound-node.net</div>
              <div className="text-[10px] text-gray-500 font-mono">Custom SMTP Gateway</div>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-neon-pink/20 text-neon-pink border border-neon-pink/30 rounded-sm">
            ROTATING
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-gray-400 justify-center">
        <Server className="w-3.5 h-3.5 text-neon-cyan" /> Multi-account dispatch pools bypass sending limits automatically.
      </div>
    </div>
  );
}

export function Step2ImportView() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-400">// AUTOMATIC CONTACT COLUMN PARSING</div>
      <div className="border border-dashed border-neon-pink/30 p-8 rounded-[2rem] bg-[#09090f]/30 flex flex-col items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-pink/5 blur-2xl pointer-events-none rounded-full" />
        <Database className="w-10 h-10 text-neon-pink mb-3 animate-[bounce_2s_infinite]" />
        <div className="text-sm font-bold mb-1 font-display">leads_list_q3_campaign.csv</div>
        <div className="text-xs text-gray-500 font-mono">1.2 MB | 250 verified leads parsed</div>
        
        <div className="w-48 bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden border border-white/10">
          <motion.div 
            className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan" 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 0.8 }}
          />
        </div>
      </div>

      <div className="p-4 bg-matte-black/55 border border-white/5 rounded-2xl">
        <div className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-1.5">
          <span className="flex h-1.5 w-1.5 rounded-full bg-neon-cyan"></span> Auto-extracted template variables:
        </div>
        <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
          <div className="p-2 rounded-xl bg-[#07070a] border border-white/5">
            <span className="text-neon-cyan">"first_name"</span>
            <div className="text-gray-500 mt-1">Col A (seth)</div>
          </div>
          <div className="p-2 rounded-xl bg-[#07070a] border border-white/5">
            <span className="text-neon-cyan">"company"</span>
            <div className="text-gray-500 mt-1">Col C (acme corp)</div>
          </div>
          <div className="p-2 rounded-xl bg-[#07070a] border border-white/5">
            <span className="text-neon-pink">"designation"</span>
            <div className="text-gray-500 mt-1">Col E (VP Sales)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Step3CreateView() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-400">// WRITE PERSONALIZED DRIP CAMPAIGNS</div>
      <div className="bg-matte-black/60 border border-white/10 rounded-2xl p-5 font-sans space-y-3 shadow-inner">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-xs">
          <span className="text-gray-500 font-mono">Subject:</span>
          <span className="text-white font-bold flex items-center gap-1.5">
            Quick question for <span className="text-neon-cyan font-mono px-1.5 py-0.5 bg-neon-cyan/10 border border-neon-cyan/20 rounded">{"{{company}}"}</span> team
          </span>
        </div>
        <div className="text-xs text-gray-300 leading-relaxed space-y-2 pt-1 font-sans">
          <p>
            Hey <span className="text-neon-pink font-mono px-1.5 py-0.5 bg-neon-pink/10 border border-neon-pink/20 rounded">{"{{first_name}}"}</span>,
          </p>
          <p>
            I saw your team is currently scaling cold outreach. At <strong className="text-white">Genzio</strong>, we completely automate sender rotations so you double response rates.
          </p>
          <p>
            Are you open to a brief chat next Tuesday?
          </p>
          <div className="pt-2 text-gray-500 font-mono text-[10px] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-neon-pink" /> Signature Template #1 (rotating variants)
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="p-2 border border-neon-cyan/25 bg-neon-cyan/5 rounded-xl flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> 3 Spintax variations OK
        </div>
        <div className="p-2 border border-neon-pink/25 bg-neon-pink/5 rounded-xl flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-pink" /> Auto-injected unsubscribe links
        </div>
      </div>
    </div>
  );
}

export function Step4SetView() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-500">// CONFIGURE SAFETY send LIMITS</div>
      <div className="p-5 bg-matte-black/55 border border-neon-cyan/20 rounded-[1.5rem] space-y-4">
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-gray-300 font-bold">Throttle Safe Interval</span>
            <span className="text-neon-cyan font-mono font-bold">42s - 85s (humanized delay)</span>
          </div>
          <div className="relative h-6 flex items-center justify-center">
            <div className="absolute inset-x-0 h-1 bg-white/5 rounded-full border border-white/10" />
            <div className="absolute left-[35%] right-[25%] h-1 bg-neon-cyan rounded-full shadow-[0_0_10px_#00f3ff]" />
            <div className="absolute left-[55%] w-3 h-3 bg-white rounded-full shadow-[0_0_10px_#fff]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-matte-black/80 border border-white/5 rounded-2xl font-mono">
            <div className="text-gray-500 mb-1">Weekly Window</div>
            <div className="text-white font-bold">Mon-Fri (EST)</div>
            <div className="text-[10px] text-gray-500 mt-1">SDR Safe Schedule</div>
          </div>
          <div className="p-3 bg-matte-black/80 border border-white/5 rounded-2xl font-mono">
            <div className="text-gray-500 mb-1">Smart follow-up</div>
            <div className="text-neon-pink font-bold">3 Drips sequencial</div>
            <div className="text-[10px] text-gray-500 mt-1">Halts if replied</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Step5LaunchView() {
  const [logs, setLogs] = useState<string[]>([
    "[ENGINE] Initializing Genzio Dispatch core...",
    "[OK] Rotated pool: 3 senders verified active.",
    "[LAUNCH] Starting automatic queue flow...",
    "[DISPATCH] Sent from sales@domain.com to seth@acme.com",
  ]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLogs((prev) => {
        const sliced = prev.length > 4 ? prev.slice(prev.length - 4) : prev;
        const leads = ["julie@stripe.com", "frank@adobe.io", "tony@microsoft.us", "gina@airbnb.co", "emma@uber.net"];
        const accounts = ["sales@domain.com", "partner@domain.com", "smtp.outbound-node.net"];
        const randomLead = leads[Math.floor(Math.random() * leads.length)];
        const randomAcc = accounts[Math.floor(Math.random() * accounts.length)];
        const delays = [45, 52, 63, 74];
        const randomDelay = delays[Math.floor(Math.random() * delays.length)];
        return [...sliced, `[DISPATCH] Sent from ${randomAcc} to ${randomLead} (Safe Delay: ${randomDelay}s)`];
      });
    }, 2800);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-500">// LIVE DISPATCH LEDGER MONITOR</div>
      <div className="bg-[#020205] border border-neon-cyan/20 rounded-2xl p-4 font-mono text-[10px] md:text-xs text-neon-cyan space-y-1.5 min-h-[220px] shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 py-1 px-2.5 rounded-bl-xl bg-neon-cyan/15 border-l border-b border-neon-cyan/20 text-[9px] font-bold animate-pulse text-neon-cyan">
          STREAMING
        </div>
        <div className="space-y-1.5 pt-4">
          {logs.map((log, index) => {
            let colorString = "text-neon-cyan";
            if (log.includes("[ENGINE]")) colorString = "text-white/40";
            if (log.includes("[LAUNCH]")) colorString = "text-neon-pink";
            if (log.includes("[DISPATCH]")) colorString = "text-neon-cyan drop-shadow-[0_0_3px_#00f3ff]";
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -5 }} 
                animate={{ opacity: 1, x: 0 }} 
                className={`${colorString} leading-relaxed`}
              >
                {log}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center text-xs text-gray-500">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        Runs fully server-side. Auto-pauses if bounce triggers exceed 3%.
      </div>
    </div>
  );
}

export function Step6TrackView() {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-gray-500">// DISPATCH CONSOLE ANALYTICS</div>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-matte-black/55 border border-neon-cyan/25 rounded-2xl text-center relative overflow-hidden group">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-neon-cyan/10 blur-xl pointer-events-none rounded-full" />
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Open Rate</div>
          <div className="text-2xl font-extrabold font-display text-neon-cyan mt-1 drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">84.2%</div>
          <div className="text-[9px] text-emerald-400 font-mono mt-1">▲ 14.2% bounce rate</div>
        </div>

        <div className="p-4 bg-matte-black/55 border border-neon-pink/25 rounded-2xl text-center relative overflow-hidden group">
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-neon-pink/10 blur-xl pointer-events-none rounded-full" />
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Reply Rate</div>
          <div className="text-2xl font-extrabold font-display text-neon-pink mt-1 drop-shadow-[0_0_10px_rgba(255,0,255,0.4)]">34.1%</div>
          <div className="text-[9px] text-neon-pink font-mono mt-1">▲ 3x industry median</div>
        </div>

        <div className="p-4 bg-matte-black/55 border border-white/5 rounded-2xl text-center relative overflow-hidden group">
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Unsubscribed</div>
          <div className="text-2xl font-extrabold font-display text-white mt-1">0.4%</div>
          <div className="text-[9px] text-gray-500 font-mono mt-1">SDR safe reputatn</div>
        </div>
      </div>

      <div className="p-4 bg-matte-black/55 border border-white/5 rounded-2xl flex items-center justify-between font-mono text-xs">
        <span className="text-gray-400 flex items-center gap-1.5"><LineChart className="w-4 h-4 text-neon-cyan" /> Domain Heath Protection:</span>
        <span className="text-neon-cyan font-bold">Excellent Status</span>
      </div>
    </div>
  );
}

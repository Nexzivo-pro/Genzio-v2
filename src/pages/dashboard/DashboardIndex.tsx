import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Mail, 
  Send, 
  Activity, 
  MousePointerClick, 
  MessageSquareHeart, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  Check, 
  Flame, 
  X, 
  UserCheck, 
  ShieldAlert, 
  LineChart,
  FilePlus,
  ShieldCheck,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import AnimatedCounter from '../../components/AnimatedCounter';

interface ActivityItem {
  id: string;
  type: 'campaign' | 'account' | 'automation' | 'system' | 'reply';
  text: string;
  time: string;
  status: 'Active' | 'Connected' | 'Triggered' | 'Completed' | 'Warning';
}

export default function DashboardIndex() {
  // State elements to make dashboard dynamic and interactive
  const [totalCampaigns, setTotalCampaigns] = useState(() => {
    const saved = localStorage.getItem('db_total_campaigns');
    return saved ? parseInt(saved, 10) : 12;
  });
  const [connectedAccounts, setConnectedAccounts] = useState(() => {
    const saved = localStorage.getItem('db_connected_accounts');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [emailsSent, setEmailsSent] = useState(() => {
    const saved = localStorage.getItem('db_emails_sent');
    return saved ? parseInt(saved, 10) : 4520;
  });
  const [activeAutomations, setActiveAutomations] = useState(() => {
    const saved = localStorage.getItem('db_active_automations');
    return saved ? parseInt(saved, 10) : 8;
  });
  const [deliverabilityRate, setDeliverabilityRate] = useState(98.4);
  const [activeFilter, setActiveFilter] = useState<'all' | 'campaign' | 'system' | 'reply'>('all');

  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: '1', type: 'campaign', text: 'Campaign "Q3 Enterprise Outreach" initialized', time: '12 mins ago', status: 'Active' },
    { id: '2', type: 'account', text: 'Google Workspace account warmup sequence started for sales@genzio.io', time: '1 hour ago', status: 'Connected' },
    { id: '3', type: 'automation', text: 'Reply Guard: Autoreply sentiment triggered for "Interested Prospect"', time: '2 hours ago', status: 'Triggered' },
    { id: '4', type: 'system', text: 'Optimized warmup loop delivery frequency checked', time: '4 hours ago', status: 'Completed' },
    { id: '5', type: 'reply', text: 'Prospect "Sarah K." from Apex Tech scheduled discovery call', time: '5 hours ago', status: 'Active' },
  ]);

  // Modal Dialog states
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // New item inputs
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignProfile, setNewCampaignProfile] = useState('intent');
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountProvider, setNewAccountProvider] = useState('gmail');
  const [newRuleTrigger, setNewRuleTrigger] = useState('positive_intent');
  const [newRuleAction, setNewRuleAction] = useState('slack_notify');

  // Custom Toast Notifier
  const [toast, setToast] = useState<{ show: boolean; msg: string; success: boolean }>({ show: false, msg: '', success: true });

  const showToast = (msg: string, success = true) => {
    setToast({ show: true, msg, success });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    localStorage.setItem('db_total_campaigns', totalCampaigns.toString());
  }, [totalCampaigns]);

  useEffect(() => {
    localStorage.setItem('db_connected_accounts', connectedAccounts.toString());
  }, [connectedAccounts]);

  useEffect(() => {
    localStorage.setItem('db_emails_sent', emailsSent.toString());
  }, [emailsSent]);

  useEffect(() => {
    localStorage.setItem('db_active_automations', activeAutomations.toString());
  }, [activeAutomations]);

  // Action handlers
  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) {
      showToast('Please specify a valid Campaign Name.', false);
      return;
    }
    setTotalCampaigns(prev => prev + 1);
    const newAct: ActivityItem = {
      id: Date.now().toString(),
      type: 'campaign',
      text: `Campaign "${newCampaignName}" successfully initiated on active nodes.`,
      time: 'Just now',
      status: 'Active'
    };
    setActivities(prev => [newAct, ...prev]);
    setIsCampaignModalOpen(false);
    setNewCampaignName('');
    showToast(`Campaign initiated: ${newCampaignName}`);
  };

  const handleConnectAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountEmail.trim() || !newAccountEmail.includes('@')) {
      showToast('Please insert a valid email address.', false);
      return;
    }
    setConnectedAccounts(prev => prev + 1);
    const newAct: ActivityItem = {
      id: Date.now().toString(),
      type: 'account',
      text: `Sending Domain Node Connected: ${newAccountEmail} (${newAccountProvider.toUpperCase()})`,
      time: 'Just now',
      status: 'Connected'
    };
    setActivities(prev => [newAct, ...prev]);
    setIsAccountModalOpen(false);
    setNewAccountEmail('');
    showToast(`Successfully connected: ${newAccountEmail}`);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveAutomations(prev => prev + 1);
    const triggerLabel = newRuleTrigger === 'positive_intent' ? 'Positive Sentiment Reply' : 'Spam Trap Alert flag';
    const actionLabel = newRuleAction === 'slack_notify' ? 'Post Slack notification' : 'Promote to Premium Outbound';
    
    const newAct: ActivityItem = {
      id: Date.now().toString(),
      type: 'automation',
      text: `Automation Guard activated: If [${triggerLabel}] then [${actionLabel}]`,
      time: 'Just now',
      status: 'Triggered'
    };
    setActivities(prev => [newAct, ...prev]);
    setIsRuleModalOpen(false);
    showToast('Intelligent Automation Guard established.');
  };

  const simulateEmails = () => {
    setEmailsSent(prev => prev + Math.floor(Math.random() * 45) + 15);
    setDeliverabilityRate(prev => {
      const delta = (Math.random() * 0.4 - 0.2);
      return parseFloat(Math.min(100, Math.max(92, prev + delta)).toFixed(1));
    });
    showToast('Simulated outbound check completed. Metrics synchronized.');
  };

  const filteredActivities = activities.filter(act => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'campaign') return act.type === 'campaign';
    if (activeFilter === 'system') return act.type === 'system' || act.type === 'automation';
    if (activeFilter === 'reply') return act.type === 'reply' || act.type === 'account';
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Alert Indicator */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border ${
              toast.success 
                ? 'bg-matte-dark/95 border-neon-cyan text-white shadow-neon-cyan/20' 
                : 'bg-matte-dark/95 border-neon-pink text-white shadow-neon-pink/20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${toast.success ? 'bg-neon-cyan shadow-[0_0_8px_#00f3ff]' : 'bg-neon-pink shadow-[0_0_8px_#ff00ff]'}`} />
            <span className="text-sm font-medium tracking-wide font-sans">{toast.msg}</span>
            <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-gray-400 hover:text-white ml-2">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Block with Futuristic Visual Accents */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-medium tracking-widest text-neon-cyan uppercase bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20">
              Agent Automated
            </span>
            <span className="text-xs font-mono font-medium tracking-widest text-neon-pink uppercase bg-neon-pink/10 px-2 py-0.5 rounded border border-neon-pink/20">
              Outbound Secure
            </span>
          </div>
          <h1 className="text-4xl font-display font-medium text-white tracking-tight">
            Control Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Launch campaigns, integrate mailboxes, and preview deliverability warmth engines.
          </p>
        </div>

        {/* Sync Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 font-mono">
            <Info className="w-3.5 h-3.5 text-neon-cyan animate-pulse animate-duration-1000" />
            <span>Deliverability Index: {deliverabilityRate}%</span>
          </div>
          <button 
            onClick={simulateEmails}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 animate-spin animate-none group-hover:animate-spin duration-1000" />
            <span>Generate Inbound Volleys</span>
          </button>
        </div>
      </div>

      {/* Stats Widgets / Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-5 relative overflow-hidden group hover:border-neon-cyan/50 transition-all duration-300"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-neon-cyan/5 blur-xl rounded-full group-hover:bg-neon-cyan/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">Outbound Sequences</span>
            <div className="p-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-semibold text-white tracking-tight">
            <AnimatedCounter value={totalCampaigns} />
          </p>
          <span className="text-[10px] text-gray-500 font-mono mt-2 block">Total Active Campaigns</span>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="glass-card p-5 relative overflow-hidden group hover:border-neon-cyan/50 transition-all duration-300"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-neon-cyan/5 blur-xl rounded-full group-hover:bg-neon-cyan/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">Linked Mailboxes</span>
            <div className="p-2 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-semibold text-white tracking-tight">
            <AnimatedCounter value={connectedAccounts} />
          </p>
          <span className="text-[10px] text-blue-400 font-mono mt-2 block flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            Outbound Warmup Live
          </span>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card p-5 relative overflow-hidden group hover:border-white/20 transition-all duration-300"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 blur-xl rounded-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">Volleys Delivered</span>
            <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-semibold text-white tracking-tight">
            <AnimatedCounter value={emailsSent} suffix="+" />
          </p>
          <span className="text-[10px] text-emerald-400 font-mono mt-2 block flex items-center gap-1">
            +14.2% delivery velocity
          </span>
        </motion.div>

        {/* Card 4 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="glass-card-pink p-5 relative overflow-hidden group hover:border-neon-pink/50 transition-all duration-300"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-neon-pink/5 blur-xl rounded-full group-hover:bg-neon-pink/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">Average Open Rate</span>
            <div className="p-2 rounded-lg bg-neon-pink/5 border border-neon-pink/20 text-neon-pink">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-semibold text-white tracking-tight">
            <AnimatedCounter value={48.2} decimals={1} suffix="%" />
          </p>
          <span className="text-[10px] text-neon-pink font-mono mt-2 block">Premium Threshold Exceeded</span>
        </motion.div>

        {/* Card 5 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-card-pink p-5 relative overflow-hidden group hover:border-neon-pink/50 transition-all duration-300"
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-neon-pink/5 blur-xl rounded-full group-hover:bg-neon-pink/10 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">Reply Rate</span>
            <div className="p-2 rounded-lg bg-neon-pink/5 border border-neon-pink/20 text-neon-pink">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-semibold text-white tracking-tight">
            <AnimatedCounter value={12.5} decimals={1} suffix="%" />
          </p>
          <span className="text-[10px] text-gray-500 font-mono mt-2 block">34 Hot Replies Detected</span>
        </motion.div>
      </div>

      {/* Two Column Layout: Recent Activities & Bento Quick Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity Logs */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="glass-card overflow-hidden h-full flex flex-col"
          >
            {/* Activities Title & Filter Switches */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-medium text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-neon-cyan animate-pulse" />
                  Dynamic Activity Vault
                </h2>
                <p className="text-xs text-gray-400 mt-1">Real-time status analysis logs updated dynamically.</p>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
                {(['all', 'campaign', 'reply', 'system'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-all capitalize ${
                      activeFilter === filter 
                        ? 'bg-neon-cyan/20 text-neon-cyan font-semibold border-none' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List Rows */}
            <div className="p-0 divide-y divide-white/5 overflow-y-auto max-h-[480px]">
              <AnimatePresence initial={false}>
                {filteredActivities.map((act, index) => {
                  let badgeColor = 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30';
                  if (act.status === 'Connected') badgeColor = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
                  if (act.status === 'Triggered') badgeColor = 'bg-neon-pink/15 text-neon-pink border-neon-pink/30';
                  if (act.status === 'Completed') badgeColor = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';

                  return (
                    <motion.div
                      key={act.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-white/[0.015] transition-all group"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className={`w-2 h-2 mt-2 sm:mt-0 rounded-full shrink-0 ${
                          act.type === 'campaign' ? 'bg-neon-cyan' :
                          act.type === 'reply' ? 'bg-neon-pink' : 'bg-white'
                        } shadow-[0_0_8px_currentColor]`} />
                        <div>
                          <p className="text-sm font-medium text-white group-hover:text-neon-cyan transition-colors">
                            {act.text}
                          </p>
                          <span className="text-xs text-gray-500 mt-1 font-mono block">
                            {act.time}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded border shrink-0 ${badgeColor}`}>
                        {act.status}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredActivities.length === 0 && (
                <div className="py-16 text-center text-gray-500 flex flex-col items-center justify-center">
                  <Activity className="w-8 h-8 opacity-20 mb-2" />
                  <p className="text-sm">No activity logs meet current segment limits.</p>
                </div>
              )}
            </div>

            {/* Simulated Live System Telemetry Banner */}
            <div className="mt-auto p-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Outgoing Gateway: SSL/SMTP Secured
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                Ping: 42ms
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Quick Action Grid + Warmup Trackers */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="glass-card p-6 space-y-4"
          >
            <div>
              <h2 className="text-lg font-medium text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-pink" />
                Dynamic Command Deck
              </h2>
              <p className="text-xs text-gray-400 mt-1">Direct interactive controls for instant automation tasks.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Action 1 */}
              <button 
                onClick={() => setIsCampaignModalOpen(true)}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-neon-cyan/5 to-transparent border border-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,243,255,0.15)] transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan">
                    <FilePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Create Outreach Flow</h3>
                    <p className="text-xs text-gray-400">Initialize a new campaign structure.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
              </button>

              {/* Action 2 */}
              <button 
                onClick={() => setIsAccountModalOpen(true)}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-neon-pink/5 to-transparent border border-neon-pink/20 hover:border-neon-pink hover:shadow-[0_0_15px_rgba(255,0,ff,0.15)] transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neon-pink/10 text-neon-pink">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Integrate Sending Node</h3>
                    <p className="text-xs text-gray-400">Add SMTP workspace or Office account.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
              </button>

              {/* Action 3 */}
              <button 
                onClick={() => setIsRuleModalOpen(true)}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-neon-cyan/5 to-transparent border border-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,243,255,0.15)] transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Configure Sentiment Rule</h3>
                    <p className="text-xs text-gray-400">Define auto-reply on prospect responses.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
              </button>

              {/* Action 4 */}
              <button 
                onClick={() => setIsAuditModalOpen(true)}
                className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-neon-pink/5 to-transparent border border-neon-pink/20 hover:border-neon-pink hover:shadow-[0_0_15px_rgba(255,0,ff,0.15)] transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neon-pink/10 text-neon-pink">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white font-sans">Campaign Health Audit</h3>
                    <p className="text-xs text-gray-400">Check SPF, DKIM, and deliverability warmups.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-pink group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </motion.div>

          {/* Mailbox Warmup Live Monitoring widget */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white font-sans flex items-center gap-2">
                <Flame className="text-neon-pink w-4 h-4 animate-bounce" />
                Sending Health Level
              </h3>
              <span className="text-xs font-mono text-neon-cyan">{deliverabilityRate}% Deliverability</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                  <span>SSL & Warmup Capacity</span>
                  <span>9.2k/10k weekly limit</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-1.5 border border-white/5 overflow-hidden">
                  <div className="bg-gradient-to-r from-neon-cyan to-neon-pink h-full rounded-full transition-all duration-1000" style={{ width: `${deliverabilityRate}%` }}></div>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-mono">Spam Bounces</span>
                  <span className="text-sm font-semibold text-emerald-400 font-mono">0.02%</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-mono">Security Check</span>
                  <span className="text-sm font-semibold text-neon-cyan font-mono flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Passed
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. LAUNCH CAMPAIGN MODAL                                             */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isCampaignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCampaignModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card max-w-md w-full p-6 relative z-10 border border-neon-cyan"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Target className="text-neon-cyan w-5 h-5" />
                  Configure Simulated Outbound Flow
                </h3>
                <button onClick={() => setIsCampaignModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleLaunchCampaign} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Sequence Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Q3 Startup Founders Warm Outbound" 
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">AI Outreach Profile</label>
                  <select 
                    value={newCampaignProfile}
                    onChange={(e) => setNewCampaignProfile(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan/50 cursor-pointer"
                  >
                    <option value="intent">Smart Lead Intent Detector (Highly Targeted)</option>
                    <option value="warmup">Automated Deliverability Warmup Spammer</option>
                    <option value="bulk">Dynamic Follow-Up Sequence (Optimized Easing)</option>
                  </select>
                </div>

                <div className="p-3.5 bg-neon-cyan/5 rounded-lg border border-neon-cyan/10 text-xs text-gray-400 flex gap-2">
                  <Info className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                  <span>Launching will instantaneously increment your Campaign metrics and log outbound command events.</span>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsCampaignModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-xs font-semibold rounded bg-neon-cyan text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all font-sans"
                  >
                    Deploy Outbound Flow
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 2. LINK MAILBOX/SMTP MODAL                                           */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isAccountModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAccountModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card max-w-md w-full p-6 relative z-10 border border-neon-pink"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Mail className="text-neon-pink w-5 h-5" />
                  Integrate Send Node / SMTP
                </h3>
                <button onClick={() => setIsAccountModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleConnectAccount} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Provider Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['gmail', 'outlook', 'custom_smtp'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewAccountProvider(p)}
                        className={`py-2 text-xs font-mono rounded border transition-all ${
                          newAccountProvider === p 
                            ? 'bg-neon-pink/10 border-neon-pink text-neon-pink font-semibold' 
                            : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {p === 'gmail' ? 'Google' : p === 'outlook' ? 'Outlook' : 'SMTP Node'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Account Email Sender</label>
                  <input 
                    type="email" 
                    required
                    placeholder="sales@domain.io" 
                    value={newAccountEmail}
                    onChange={(e) => setNewAccountEmail(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-pink/50"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAccountModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-xs font-semibold rounded bg-neon-pink text-white hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] transition-all font-sans"
                  >
                    Connect sender node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 3. RULE MODAL                                                        */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isRuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRuleModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card max-w-md w-full p-6 relative z-10 border border-neon-cyan"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <Activity className="text-neon-cyan w-5 h-5" />
                  Define Sentiment Rule
                </h3>
                <button onClick={() => setIsRuleModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">IF incoming sentiment detected is:</label>
                  <select 
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan/50 cursor-pointer"
                  >
                    <option value="positive_intent">Positive Business Proposal Request ("Interested")</option>
                    <option value="negative_intent">Opt Out request ("Unsubscribe / Stop")</option>
                    <option value="spam_alerts">Spam trap filter warning alert flag</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">THEN perform system command trigger:</label>
                  <select 
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan/50 cursor-pointer"
                  >
                    <option value="slack_notify">Post immediate Slack Notification message</option>
                    <option value="promote_premium">Promote to custom manual high-value draft folder</option>
                    <option value="blackhole_lead">Remove immediately from current sequence queue</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsRuleModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 text-xs font-semibold rounded bg-neon-cyan text-black hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all font-sans"
                  >
                    Establish Rule
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 4. CAMPAIGN HEALTH AUDIT MODAL                                       */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuditModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card-pink max-w-lg w-full p-6 relative z-10 border border-neon-pink"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <LineChart className="text-neon-pink w-5 h-5" />
                  Technical Outbound Audit Simulation
                </h3>
                <button onClick={() => setIsAuditModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-gray-400">
                  Deliverability index simulation checked for connected workspace nodes.
                </p>

                {/* Audit Items */}
                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                      <span className="text-xs font-mono font-medium text-white">SPF DNS record validation checks</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Valid</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                      <span className="text-xs font-mono font-medium text-white">DKIM Key signing check (2048-bit validation)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Valid</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                      <span className="text-xs font-mono font-medium text-white">DMARC policy strict validation alignment check</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Valid</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_6px_#00f3ff]" />
                      <span className="text-xs font-mono font-medium text-white">Custom Tracking Domain (CNAME active check)</span>
                    </div>
                    <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">Active</span>
                  </div>
                </div>

                <div className="p-3 bg-neon-pink/5 border border-neon-pink/10 rounded-lg text-[11px] text-gray-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-neon-pink shrink-0 mt-0.5" />
                  <span>Outgoing server deliverability warmth optimization scores average out to exactly {deliverabilityRate}%.</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAuditModalOpen(false);
                      showToast('Deliverability index results generated.');
                    }}
                    className="px-5 py-2.5 text-xs font-semibold rounded bg-neon-pink text-white hover:shadow-[0_0_15px_rgba(255,0,255,0.4)] transition-all font-sans"
                  >
                    Acknowledge Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

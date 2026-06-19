import { useState } from 'react';
import { Plus, Settings2, Trash2, Mail, Server, Globe, Star, ShieldCheck, AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import { EmptyState } from '../../components/dashboard/StatCard';

type Provider = 'gmail' | 'outlook' | 'smtp';

interface Account {
  id: string;
  email: string;
  provider: Provider;
  isDefault: boolean;
  health: 'Healthy' | 'Warming Up' | 'Action Required';
}

export default function EmailAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showSmtp, setShowSmtp] = useState(false);
  const [smtpEmail, setSmtpEmail] = useState('');

  const maxAccounts = 5;
  const isMaxReached = accounts.length >= maxAccounts;

  const handleConnect = (provider: Provider, customEmail?: string) => {
    if (isMaxReached) return;
    
    // Mock user interaction adding account
    let defaultEmail = 'user@example.com';
    if (provider === 'gmail') defaultEmail = `hello.${Math.floor(Math.random() * 100)}@gmail.com`;
    if (provider === 'outlook') defaultEmail = `hello.${Math.floor(Math.random() * 100)}@outlook.com`;

    const newAccount: Account = {
      id: Math.random().toString(36).substring(2, 9),
      email: customEmail || defaultEmail,
      provider,
      isDefault: accounts.length === 0, // First account is default
      health: 'Warming Up'
    };

    setAccounts([...accounts, newAccount]);
    setIsAdding(false);
    setShowSmtp(false);
    setSmtpEmail('');
  };

  const handleSetDefault = (id: string) => {
    setAccounts(accounts.map(acc => ({
      ...acc,
      isDefault: acc.id === id
    })));
  };

  const handleRemove = (id: string) => {
    const updated = accounts.filter(acc => acc.id !== id);
    if (updated.length > 0 && accounts.find(a => a.id === id)?.isDefault) {
      updated[0].isDefault = true;
    }
    setAccounts(updated);
  };

  const getProviderIcon = (provider: Provider) => {
    switch (provider) {
      case 'gmail': return <Mail className="w-5 h-5 text-red-500" />;
      case 'outlook': return <Globe className="w-5 h-5 text-blue-500" />;
      case 'smtp': return <Server className="w-5 h-5 text-gray-400" />;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'Healthy':
        return <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Healthy</span>;
      case 'Warming Up':
        return <span className="flex items-center gap-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full"><ShieldCheck className="w-3 h-3" /> Warming Up</span>;
      case 'Action Required':
        return <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded-full"><AlertTriangle className="w-3 h-3" /> Action Required</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white mb-2 tracking-tight">Email Accounts</h1>
          <p className="text-gray-400">Connect sending domains and monitor warmup progress. {accounts.length}/{maxAccounts} used.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
            <Settings2 className="w-5 h-5" />
          </button>
          {!isAdding && !isMaxReached && (
            <button 
              onClick={() => setIsAdding(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Connect Account</span>
            </button>
          )}
        </div>
      </div>

      {(isAdding || accounts.length === 0) && !isMaxReached && (
        <div className="glass-card p-6 border-neon-cyan/30">
          <h3 className="text-lg font-medium text-white mb-4">Connect New Provider</h3>
          <p className="text-gray-400 text-sm mb-6">Choose an email provider to orchestrate your outbound campaigns.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <button 
              onClick={() => handleConnect('gmail')}
              className="flex flex-col items-center justify-center p-6 bg-[#050508] border border-white/10 rounded-xl hover:border-red-500/50 hover:bg-red-500/5 transition-all gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Mail className="w-6 h-6 text-red-500" />
              </div>
              <span className="font-medium text-white">Google / Gmail</span>
            </button>

             <button 
              onClick={() => handleConnect('outlook')}
              className="flex flex-col items-center justify-center p-6 bg-[#050508] border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <span className="font-medium text-white">Outlook / 365</span>
            </button>

            <button 
              onClick={() => setShowSmtp(!showSmtp)}
              className={`flex flex-col items-center justify-center p-6 bg-[#050508] border rounded-xl hover:bg-white/5 transition-all gap-3 ${showSmtp ? 'border-neon-cyan/50' : 'border-white/10 hover:border-white/20'}`}
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Server className="w-6 h-6 text-gray-400" />
              </div>
              <span className="font-medium text-white">SMTP / IMAP</span>
            </button>
          </div>

          {showSmtp && (
            <div className="bg-[#050508] border border-white/10 rounded-xl p-6 mt-4 animate-in fade-in slide-in-from-top-4">
              <h4 className="text-sm font-medium text-white flex items-center gap-2 mb-4">
                Advanced SMTP Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={smtpEmail}
                    onChange={(e) => setSmtpEmail(e.target.value)}
                    placeholder="hello@yourdomain.com"
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-neon-cyan outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Password / App Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-neon-cyan outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">SMTP Host</label>
                  <input 
                    type="text" 
                    placeholder="smtp.example.com"
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-neon-cyan outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">SMTP Port</label>
                  <input 
                    type="text" 
                    placeholder="465 or 587"
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-neon-cyan outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => {
                    if (smtpEmail) handleConnect('smtp', smtpEmail);
                  }}
                  disabled={!smtpEmail}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all border ${!smtpEmail ? 'bg-white/5 text-gray-500 border-white/5 cursor-not-allowed' : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30 hover:bg-neon-cyan/20 hover:border-neon-cyan/50'}`}
                >
                  Connect Custom SMTP
                </button>
              </div>
            </div>
          )}

          {accounts.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => { setIsAdding(false); setShowSmtp(false); }}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {accounts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {accounts.map(account => (
              <div key={account.id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    {getProviderIcon(account.provider)}
                  </div>
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      {account.email}
                      {account.isDefault && (
                        <span className="text-[10px] uppercase tracking-wider bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-bold">
                          Default
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 relative">
                       {getHealthBadge(account.health)}
                       <span className="text-xs text-gray-500 capitalize">{account.provider} Provider</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!account.isDefault && (
                    <button 
                      onClick={() => handleSetDefault(account.id)}
                      className="p-2 text-gray-500 hover:text-yellow-500 bg-white/5 hover:bg-yellow-500/10 rounded-lg transition-colors group"
                      title="Set as Default Sender"
                    >
                      <Star className="w-4 h-4 group-hover:fill-yellow-500" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleRemove(account.id)}
                    className="p-2 text-gray-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Remove Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {isMaxReached && (
               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-sm text-yellow-500 flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4" />
                 <span>Maximum account limit reached (5/5). Upgrade your plan to add more sending domains.</span>
               </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-medium text-white mb-4">Global Health Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Average Deliverability</span>
                  <span className="text-white font-medium text-neon-cyan">98.4%</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-2 border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-neon-pink rounded-full" style={{ width: '98.4%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Accounts are properly authenticated (SPF, DKIM, DMARC).</p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Total Sent (30d)</span>
                   <span className="font-mono text-white">12,450</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Avg Open Rate</span>
                   <span className="font-mono text-white">42.8%</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-400">Inbox Placement</span>
                   <span className="font-mono text-emerald-400">Excellent</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

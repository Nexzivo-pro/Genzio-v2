import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'billing', label: 'Billing' },
    { id: 'team', label: 'Team Members' },
    { id: 'api', label: 'API Keys' }
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-medium text-white mb-2 tracking-tight">Settings</h1>
        <p className="text-gray-400">Manage your workspace preferences and billing.</p>
      </div>

      <div className="flex border-b border-white/5 space-x-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-medium tracking-wide whitespace-nowrap transition-colors relative ${
              activeTab === tab.id ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
            )}
          </button>
        ))}
      </div>

      <div className="glass-card p-6 md:p-8 space-y-6">
        {activeTab === 'profile' && (
          <>
            <h2 className="text-xl font-medium text-white mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Email Address</label>
                <input type="email" defaultValue="admin@genzio.com" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed" disabled />
                <p className="text-xs text-gray-500">Contact support to change your primary email.</p>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button className="btn-primary">Save Changes</button>
            </div>
          </>
        )}

        {activeTab !== 'profile' && (
          <div className="py-12 text-center text-gray-400">
            <p>Settings for {tabs.find(t => t.id === activeTab)?.label} will go here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

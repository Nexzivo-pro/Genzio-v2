import React from 'react';
import { Layers } from 'lucide-react';

export default function Campaigns() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center border border-neon-cyan/30">
          <Layers className="w-6 h-6 text-neon-cyan" />
        </div>
        <h1 className="text-3xl font-display font-bold">Campaigns</h1>
      </div>
      
      <div className="glass p-12 rounded-2xl border border-white/10 text-center">
        <h2 className="text-xl font-bold mb-4 text-white">Campaign Management</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Create, track, and optimize your outreach campaigns. The full campaign manager interface is currently being upgraded to Genzio 2.0 architecture and will be available soon.
        </p>
      </div>
    </div>
  );
}

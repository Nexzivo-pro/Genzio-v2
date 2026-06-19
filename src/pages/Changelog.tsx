import React from 'react';

export default function Changelog() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-display font-bold mb-8">Changelog</h1>
      <div className="glass p-8 rounded-2xl border border-white/10 space-y-8">
        <div className="border-l-2 border-neon-cyan pl-6">
          <p className="text-sm text-neon-cyan mb-2">June 2026</p>
          <h2 className="text-2xl font-bold mb-4">Genzio 2.0: AI Ecosystem Update</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>Introduced Advanced Email Automation Workflows.</li>
            <li>New predictive Analytics dashboard.</li>
            <li>Enhanced AI Copywriting with deep personalization.</li>
            <li>Redesigned premium interface and layout.</li>
          </ul>
        </div>
        <div className="border-l-2 border-neon-pink pl-6">
          <p className="text-sm text-neon-pink mb-2">May 2026</p>
          <h2 className="text-2xl font-bold mb-4">Genzio 1.5: Performance Boost</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>Improved template rendering speeds.</li>
            <li>Added comprehensive campaign tracking tools.</li>
            <li>Resolved minor UI inconsistencies.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

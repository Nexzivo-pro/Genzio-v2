import React from 'react';

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-display font-bold mb-8">Platform Disclaimer</h1>
      <div className="prose prose-invert prose-neon max-w-none space-y-6 text-gray-400">
        <div className="glass p-8 rounded-2xl border border-white/10">
          <p className="mb-4">
            <strong>Genzio provides software tooling only.</strong> We do not act as your legal counsel or direct proxy.
          </p>
          <h2 className="text-xl font-bold mb-2 text-white">User Responsibility</h2>
          <p className="mb-4">
            Users are entirely responsible for their own campaigns, outreach practices, and messaging content. It is your responsibility to ensure compliance with all applicable local, national, and international laws, including but not limited to CAN-SPAM, GDPR, CCPA, and standard email provider policies (such as Google Workspace and Microsoft 365 sending limits).
          </p>
          <h2 className="text-xl font-bold mb-2 text-white">No Guarantees</h2>
          <p>
            While we strive to provide excellent delivery infrastructure and AI templates, we cannot guarantee specific deliverability rates, open rates, or replies. Email ecosystem rules change actively, and results vary based on user domain reputation and audience targeting.
          </p>
        </div>
      </div>
    </div>
  );
}

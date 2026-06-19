import React from 'react';

export default function Security() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-display font-bold mb-8">Security Configuration</h1>
      <div className="prose prose-invert prose-neon max-w-none space-y-6 text-gray-400">
        <div className="glass p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-white">Our Commitment to Enterprise Security</h2>
          <p className="mb-4">
            At Genzio, securing your data and ensuring the privacy of your automated outreach is our architectural priority. 
            We utilize end-to-end encryption, regular auditing, and secure infrastructure layers aligned with premium enterprise standards.
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li><strong>Data Encryption:</strong> All data is encrypted at rest and in transit using advanced cryptographic protocols.</li>
            <li><strong>Infrastructure:</strong> We host on secure cloud platforms that are SOC-2 compliant.</li>
            <li><strong>Access Controls:</strong> Strict role-based access management ensuring your assets are exclusively yours.</li>
            <li><strong>AI Privacy:</strong> Language models used in automations do not continuously train on unstructured personal data without consent.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

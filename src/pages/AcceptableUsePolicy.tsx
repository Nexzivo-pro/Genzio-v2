import React from 'react';

export default function AcceptableUsePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-display font-bold mb-8">Acceptable Use Policy</h1>
      <div className="prose prose-invert prose-neon max-w-none space-y-6 text-gray-400">
        <div className="glass p-8 rounded-2xl border border-white/10">
          <p className="mb-4">
            This Acceptable Use Policy establishes the rules and guidelines for using the Genzio platform. By accessing our services, you agree not to misuse our systems.
          </p>
          <h2 className="text-xl font-bold mb-2 text-white">Prohibited Activities</h2>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Sending unsolicited spam, phishing emails, or maliciously deceptive outreach.</li>
            <li>Bypassing or attempting to bypass the security layers of Genzio.</li>
            <li>Using automations to scrape or harvest private data without consent.</li>
            <li>Generating or distributing illegal, harmful, or explicitly offensive content via our AI generation tooling.</li>
          </ul>
          <h2 className="text-xl font-bold mb-2 text-white">Enforcement</h2>
          <p>
            Violations of this Acceptable Use Policy may result in immediate suspension or termination of your account without notice.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Nexzivo() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-display font-bold mb-6 tracking-tight">Built by NEXZIVO</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          The innovative technology parent company behind the Genzio platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="glass p-10 rounded-[2rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 blur-[100px] rounded-full group-hover:bg-neon-cyan/20 transition-all duration-700" />
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-400">
            NEXZIVO exists to redefine how businesses automate and scale intelligent communication. We build premium SaaS environments that blend advanced AI capabilities with pristine aesthetic craftsmanship.
          </p>
        </div>
        
        <div className="glass p-10 rounded-[2rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-pink/10 blur-[100px] rounded-full group-hover:bg-neon-pink/20 transition-all duration-700" />
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-400">
            We envision a seamlessly connected digital ecosystem where high-volume outreach is entirely automated, securely managed, and flawlessly personalized in real-time.
          </p>
        </div>
      </div>

      <div className="glass p-10 rounded-[2rem] border border-white/10 mt-8">
        <h2 className="text-2xl font-bold mb-4">Relationship with Genzio</h2>
        <p className="text-gray-400 mb-6">
          Genzio is a premier product developed entirely by the core engineering and design teams at NEXZIVO. By leveraging proprietary intelligence and automation models built at NEXZIVO, Genzio achieves unparalleled standards in modern email automation.
        </p>
        <a href="https://nexzivo.com" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 group">
          Visit NEXZIVO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    name: 'Starter',
    price: { monthly: 49, annual: 39 },
    desc: 'Perfect for solo founders and small teams starting their outreach.',
    color: 'neon-cyan',
    features: [
      { name: '1 User Seat', included: true },
      { name: '5 Connected Email Accounts', included: true },
      { name: '2,000 Active Contacts', included: true },
      { name: 'Basic Email Automation', included: true },
      { name: 'Standard Deliverability Pool', included: true },
      { name: 'AI Personalization Engine', included: false },
      { name: 'CRM Integrations', included: false },
      { name: 'Dedicated IP', included: false }
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Growth',
    price: { monthly: 149, annual: 119 },
    desc: 'For scaling sales teams that need volume and AI capabilities.',
    color: 'neon-pink',
    features: [
      { name: '5 User Seats', included: true },
      { name: 'Unlimited Email Accounts', included: true },
      { name: '25,000 Active Contacts', included: true },
      { name: 'Advanced Multi-channel', included: true },
      { name: 'Premium Automated Warmup', included: true },
      { name: 'AI Personalization Engine', included: true },
      { name: 'Native CRM Integrations', included: true },
      { name: 'Dedicated IP', included: false }
    ],
    cta: 'Start Automation',
    popular: true
  },
  {
    name: 'Enterprise',
    price: { monthly: 399, annual: 349 },
    desc: 'For revenue orgs requiring maximum deliverability and control.',
    color: 'purple-500',
    features: [
      { name: 'Unlimited User Seats', included: true },
      { name: 'Unlimited Email Accounts', included: true },
      { name: 'Unlimited Active Contacts', included: true },
      { name: 'Custom Workflow Builder', included: true },
      { name: 'Enterprise Deliverability', included: true },
      { name: 'AI Personalization Engine', included: true },
      { name: 'Advanced API Access', included: true },
      { name: 'Dedicated IPs & Support', included: true }
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className="flex flex-col gap-16 pb-24 pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center relative overflow-hidden">
      
      {/* Background Orbits */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-20 -z-10">
        <div className="absolute inset-0 rounded-full border border-neon-cyan/20 animate-[spin_30s_linear_infinite]" />
        <div className="absolute inset-[150px] rounded-full border border-neon-pink/10 animate-[spin_20s_linear_infinite_reverse]" />
      </div>

      <div className="relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-8 shadow-lg"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-neon-pink shadow-[0_0_10px_#ff00ff] animate-pulse"></span>
          <span className="text-xs font-mono tracking-widest text-gray-300 uppercase font-bold">Pricing Plans</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">
          Pricing built for <span className="text-gradient drop-shadow-[0_0_20px_rgba(0,243,255,0.3)]">scale.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Start with our 14-day free trial. No credit card required. Upgrade or downgrade at any time.
        </p>
        
        {/* Billing Toggle  */}
        <div className="inline-flex glass p-1.5 rounded-[1.25rem] items-center mb-16 border border-white/5 shadow-2xl relative z-20 bg-[#0a0a0f]/80 backdrop-blur-xl">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all relative ${billingCycle === 'monthly' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle('annual')}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 relative overflow-hidden group ${billingCycle === 'annual' ? 'bg-neon-pink/20 text-white shadow-[0_0_20px_rgba(255,0,255,0.2)] border border-neon-pink/30' : 'text-gray-400 hover:text-white border border-transparent'}`}
          >
            {billingCycle === 'annual' && <div className="absolute inset-0 bg-neon-pink/10 animate-pulse pointer-events-none" />}
            <span className="relative z-10">Annual</span> 
            <span className="relative z-10 bg-neon-pink text-matte-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-[0_0_10px_rgba(255,0,255,0.4)]">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid lg:grid-cols-3 gap-8 items-stretch relative z-10 w-full max-w-6xl mx-auto">
        {PLANS.map((plan, idx) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            className={`relative p-10 flex flex-col text-left rounded-[2.5rem] transition-all duration-500 overflow-hidden group hover:-translate-y-4 hover-float ${
              plan.popular 
                ? 'glass-card-pink border-neon-pink/50 transform lg:-translate-y-4 shadow-[0_0_50px_rgba(255,0,255,0.2)] z-20 scale-105' 
                : 'glass border-white/5 hover:border-white/30'
            }`}
          >
            {/* Hover Glow */}
            <div className={`absolute top-0 right-0 w-48 h-48 bg-${plan.color}/10 blur-[60px] pointer-events-none group-hover:bg-${plan.color}/20 transition-all duration-700`} />

            {plan.popular && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
            )}

            {plan.popular && (
              <div className="absolute top-6 right-6 bg-neon-pink/20 border border-neon-pink/30 text-neon-pink text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,255,0.2)]">
                Most Popular
              </div>
            )}
            
            <h3 className={`text-3xl font-bold mb-3 font-display ${plan.popular ? `text-${plan.color}` : 'text-white'}`}>{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-8 min-h-[40px] leading-relaxed relative z-10">{plan.desc}</p>
            
            <div className="mb-10 flex items-end gap-2 relative z-10">
              <span className="text-6xl font-black text-white tracking-tighter">${plan.price[billingCycle]}</span>
              <span className="text-gray-500 font-medium mb-2">/mo</span>
            </div>
            
            <ul className="space-y-5 flex-grow mb-10 relative z-10">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4 text-sm group/feat">
                  {feature.included ? (
                    <div className={`mt-0.5 p-1 rounded-full bg-${plan.color}/10 border border-${plan.color}/20 flex-shrink-0 group-hover/feat:bg-${plan.color}/20 transition-colors`}>
                      <CheckCircle2 className={`w-4 h-4 ${plan.popular ? `text-${plan.color}` : 'text-white'}`} />
                    </div>
                  ) : (
                    <div className="mt-0.5 p-1 rounded-full flex-shrink-0">
                       <XCircle className="w-4 h-4 text-white/20" />
                    </div>
                  )}
                  <span className={`leading-relaxed ${feature.included ? 'text-gray-200' : 'text-gray-600 line-through decoration-white/10 decoration-1'}`}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            <Link 
              to={plan.name === 'Enterprise' ? '/contact' : '/signup'} 
              className={`w-full flex items-center justify-center gap-2 text-center py-4 rounded-xl font-bold transition-all relative z-10 uppercase tracking-widest text-xs btn-primary ${
                plan.popular 
                  ? 'bg-neon-pink text-matte-black border-none hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] hover:bg-white' 
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10 border'
              }`}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full mt-10 z-10">
        <div className="p-10 md:p-12 glass-card-pink border border-neon-pink/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 text-left hover-float hover-glow-pink transition-all duration-500 overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-pink/5 blur-[50px] pointer-events-none group-hover:bg-neon-pink/15 transition-all"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-neon-pink/20 mb-4 bg-neon-pink/5">
              <span className="text-[10px] font-mono tracking-widest text-neon-pink uppercase font-bold">Partner Program</span>
            </div>
            <h4 className="text-3xl font-bold mb-3 font-display">Are you an Agency?</h4>
            <p className="text-gray-300 max-w-xl leading-relaxed text-lg">We offer white-label solutions and heavily discounted workspace pricing for outbound lead generation agencies.</p>
          </div>
          <Link to="/contact" className="btn-secondary whitespace-nowrap bg-neon-pink text-matte-black border-none hover:bg-white shadow-[0_0_20px_rgba(255,0,255,0.3)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] px-8 py-4 relative z-10 text-lg font-bold">
            Contact Partner Team
          </Link>
        </div>
      </div>

    </div>
  );
}

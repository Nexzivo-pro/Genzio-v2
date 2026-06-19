import React, {
  useState,
  useEffect,
  FormEvent,
  ReactNode,
  MouseEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Database,
  ChevronDown,
  CheckCircle2,
  Mail,
  Users,
  Send,
  Settings,
  LineChart,
  Globe,
  Server,
  Box,
  Target,
  Layers,
  PlayCircle,
  RefreshCw,
  Sparkles,
  Cloud,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CinematicProductDemo } from "../components/CinematicProductDemo";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import {
  LiveOutreachSimulator,
  FloatingEmailCards,
  GenzioAIOrb,
} from "../components/HeroVisual";

const EmailParticle: React.FC<{ angle: number; delay: number }> = ({
  angle,
  delay,
}) => {
  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
      animate={{
        x: Math.cos(angle) * 80,
        y: Math.sin(angle) * 80,
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
        rotate: [0, Math.random() * 90 - 45],
      }}
      transition={{ duration: 1.5, repeat: Infinity, delay, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neon-cyan"
    >
      <Mail className="w-4 h-4" />
    </motion.div>
  );
};

function EmailParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <EmailParticle key={i} angle={(i * Math.PI * 2) / 6} delay={i * 0.2} />
      ))}
    </div>
  );
}

function WorkflowTooltip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 p-3 rounded-xl border border-neon-pink/30 bg-[#0a0a0f]/90 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,255,0.2)] pointer-events-none z-50 text-left"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-white">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>{" "}
          1. Connect
        </div>
        <div className="flex items-center gap-2 text-xs text-white">
          <div className="w-2 h-2 rounded-full bg-purple-400"></div> 2. Create
        </div>
        <div className="flex items-center gap-2 text-xs text-white">
          <div className="w-2 h-2 rounded-full bg-neon-pink"></div> 3. Dispatch
        </div>
      </div>
    </motion.div>
  );
}

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "primary" | "secondary";
  to?: string;
}

function MagneticButton({
  children,
  onClick,
  className = "",
  type = "primary",
  to,
}: MagneticButtonProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (
    e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setCoords({ x: x * 0.25, y: y * 0.25 });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const motionProps = {
    animate: { x: coords.x, y: coords.y, scale: isHovered ? 1.05 : 1 },
    transition: { type: "spring", stiffness: 150, damping: 15 },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: () => setIsHovered(true),
  };

  const baseClass =
    type === "primary"
      ? "relative px-10 py-5 font-bold rounded-2xl bg-neon-cyan text-matte-black shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_35px_rgba(0,243,255,0.75)] hover:bg-[#00e3ee] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer text-base uppercase tracking-wider overflow-hidden " +
        className
      : "relative px-10 py-5 font-bold rounded-2xl text-white border border-neon-pink bg-transparent shadow-[0_0_15px_rgba(255,0,255,0.1)] hover:shadow-[0_0_30px_rgba(255,0,255,0.5)] hover:bg-neon-pink/15 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer text-base uppercase tracking-wider overflow-hidden " +
        className;

  if (to) {
    return (
      <Link to={to} className="inline-block w-full sm:w-auto">
        <motion.span className={baseClass} {...motionProps}>
          {children}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={baseClass}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}

export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  const topRowFeatures = [
    {
      icon: <Mail className="w-8 h-8 text-neon-cyan" />,
      title: "Email Automation",
      desc: "Connect unlimited mailboxes and automate sending sequences to engage prospects at scale.",
    },
    {
      icon: <Zap className="w-8 h-8 text-neon-pink" />,
      title: "Campaign Management",
      desc: "Coordinate multi-step sequences, manage your sending pool, and configure limits.",
    },
    {
      icon: <LineChart className="w-8 h-8 text-neon-cyan" />,
      title: "Advanced Analytics",
      desc: "Track exact delivery states, open rates, and replies in a consolidated dashboard.",
    },
    {
      icon: <Users className="w-8 h-8 text-neon-pink" />,
      title: "Lead Management",
      desc: "Import contacts quickly through simple CSV uploads directly within the app.",
    },
    {
      icon: <Shield className="w-8 h-8 text-neon-cyan" />,
      title: "Deliverability Protection",
      desc: "Intelligent rotation and time-delays make your emails look perfectly human.",
    },
    {
      icon: <Settings className="w-8 h-8 text-neon-pink" />,
      title: "AI Ready Structure",
      desc: "Built natively to integrate with upcoming AI Chat Assistants for writing.",
    },
    {
      icon: <Layers className="w-8 h-8 text-neon-cyan" />,
      title: "Smart Spintax",
      desc: "Automatically generate variations of your emails to evade spam filters.",
    },
    {
      icon: <Globe className="w-8 h-8 text-neon-pink" />,
      title: "Global Blocklists",
      desc: "Continuous scanning against 100+ global blocklists to keep domains safe.",
    },
  ];

  const bottomRowFeatures = [
    {
      icon: <Server className="w-8 h-8 text-neon-pink" />,
      title: "Dedicated IP Support",
      desc: "Connect your own custom SMTP servers for complete sender reputation control.",
    },
    {
      icon: <Sparkles className="w-8 h-8 text-neon-cyan" />,
      title: "Auto-Warmup",
      desc: "Gradually increase sending limits to build perfect sender reputation automatically.",
    },
    {
      icon: <Target className="w-8 h-8 text-neon-pink" />,
      title: "A/B Testing Engine",
      desc: "Split test subject lines, body copy, and sending times to maximize conversions.",
    },
    {
      icon: <PlayCircle className="w-8 h-8 text-neon-cyan" />,
      title: "Action Triggers",
      desc: "Start or stop campaigns automatically when prospects reply or click links.",
    },
    {
      icon: <Database className="w-8 h-8 text-neon-pink" />,
      title: "B2B Database Access",
      desc: "Direct integration with verified B2B contact lists inside your dashboard.",
    },
    {
      icon: <RefreshCw className="w-8 h-8 text-neon-cyan" />,
      title: "Bounce Detection",
      desc: "Pause sending immediately when hard bounce thresholds are detected.",
    },
    {
      icon: <Box className="w-8 h-8 text-neon-pink" />,
      title: "Agency White-label",
      desc: "Manage multiple client workspaces under your own custom agency branding.",
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-neon-cyan" />,
      title: "Custom Workflows",
      desc: "Build advanced logical branching based on prospect engagement and replies.",
    },
  ];

  const faqs = [
    {
      q: "Does Genzio integrate with my existing email providers?",
      a: "Yes. You can connect standard Google Workspace, Office 365, or ANY custom IMAP/SMTP accounts in just clicks.",
    },
    {
      q: "Is there a limit to how many leads I can upload?",
      a: "We offer plans that grow with your volume. You can import large CSV files effortlessly.",
    },
    {
      q: "How does the campaign rotation work?",
      a: "Genzio automatically spreads out your emails across all connected inboxes to keep your sending limits perfectly safe.",
    },
    {
      q: "Do you offer an AI Assistant?",
      a: "We have built a powerful new AI Outreach Copywriter Studio page where you can draft custom outbound sequences and seamlessly export them to our campaign workspace.",
    },
  ];

  return (
    <div className="bg-transparent text-white min-h-screen font-sans overflow-x-hidden selection:bg-neon-pink selection:text-matte-black">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Orbit animations behind hero */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] pointer-events-none opacity-30">
          <div className="absolute inset-0 rounded-full border border-neon-cyan/20 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-[100px] rounded-full border border-neon-pink/10 animate-[spin_15s_linear_infinite_reverse]" />
          <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full bg-neon-cyan shadow-[0_0_20px_#00f3ff] animate-pulse" />
          <div className="absolute bottom-[100px] right-1/2 w-3 h-3 rounded-full bg-neon-pink shadow-[0_0_15px_#ff00ff] animate-pulse" />
        </div>

        <GenzioAIOrb />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10 w-full mt-12 md:mt-0">
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-start text-left relative z-20 w-full">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-neon-cyan/30 mb-8 shadow-[0_0_20px_rgba(0,243,255,0.15)] backdrop-blur-3xl"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_#00f3ff]"></span>
              <span className="text-xs font-mono tracking-widest text-neon-cyan uppercase font-bold">
                PREMIUM COLD OUTREACH
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl xl:text-[5rem] font-display font-extrabold tracking-tight mb-6 leading-[1.05] max-w-2xl"
            >
              Cold outreach <br />
              <span className="text-gradient drop-shadow-[0_0_30px_rgba(255,0,255,0.3)]">
                made completely simpler.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl leading-relaxed text-left"
            >
              Explore our single-page campaign builder below. Connect inboxes,
              upload leads, configure delays and dispatch sequences with visual
              logging instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto mb-10 justify-start z-20 relative"
            >
              <div className="relative group/btn1">
                <MagneticButton to="/tool/email-automation" type="primary">
                  Start Automation <ArrowRight className="w-5 h-5" />
                </MagneticButton>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover/btn1:opacity-100 transition-opacity duration-300">
                  <EmailParticles />
                </div>
              </div>

              <div className="relative group/btn2">
                <MagneticButton
                  onClick={() => {
                    const el = document.getElementById(
                      "cinematic-demo-section",
                    );
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  type="secondary"
                >
                  How It Works <Sparkles className="w-5 h-5 text-neon-pink" />
                </MagneticButton>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 pointer-events-none opacity-0 group-hover/btn2:opacity-100 transition-opacity duration-300 w-full flex justify-center">
                  <WorkflowTooltip />
                </div>
              </div>
            </motion.div>

            {/* Small status chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 uppercase tracking-wider"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan" /> 99.8%
                Delivery
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-neon-pink" /> AI Optimized
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" /> Auto-Warmup
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - LIVE SIMULATOR */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full relative z-20"
          >
            <LiveOutreachSimulator />
            <FloatingEmailCards />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (Cinematic Demo) */}
      <section
        id="cinematic-demo-section"
        className="relative z-10 bg-[#050508] border-b border-white/5 scroll-mt-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#00f3ff]/5 bg-scanlines pointer-events-none opacity-20"></div>
        {/* Background neon grid behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none"></div>

        <CinematicProductDemo />
      </section>

      {/* FEATURES MARQUEE */}
      <section className="py-24 bg-[#07070a]/40 backdrop-blur-md border-y border-white/5 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-display font-extrabold mb-4 hover:scale-105 transition-transform duration-500 inline-block">
              Everything You Need to{" "}
              <span className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                Scale
              </span>
            </h2>
          </div>
        </div>

        <div className="relative w-full overflow-hidden py-20 pause-on-hover flex flex-col gap-8">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-16 md:w-40 bg-gradient-to-r from-matte-black to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-40 bg-gradient-to-l from-matte-black to-transparent z-20 pointer-events-none" />

          {/* Top Marquee */}
          <div className="flex w-max animate-marquee-left py-4">
            {[1, 2].map((set) => (
              <div
                key={set}
                className="flex gap-6 pr-6"
                aria-hidden={set === 2}
              >
                {topRowFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] md:w-[380px] min-h-[300px] shrink-0 glass-card p-10 !rounded-[3rem] relative group border border-white/5 hover:border-neon-cyan/50 hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(0,243,255,0.3)] transition-all duration-500 pointer-events-auto overflow-hidden bg-[#0a0a0f]/80"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-neon-cyan/5 blur-[50px] pointer-events-none group-hover:bg-neon-cyan/15 transition-all duration-700 -translate-y-10 translate-x-10" />
                    <div className="mb-8 p-4 glass !rounded-2xl inline-block border-white/10 group-hover:border-neon-cyan/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 shadow-lg">
                      {feat.icon}
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 text-white group-hover:text-neon-cyan transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Bottom Marquee */}
          <div className="flex w-max animate-marquee-right py-4">
            {[1, 2].map((set) => (
              <div
                key={set}
                className="flex gap-6 pr-6"
                aria-hidden={set === 2}
              >
                {bottomRowFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="w-[320px] md:w-[380px] min-h-[300px] shrink-0 glass-card-pink p-10 !rounded-[3rem] relative group border border-white/5 hover:border-neon-pink/50 hover:scale-[1.05] hover:shadow-[0_0_50px_rgba(255,0,255,0.3)] transition-all duration-500 pointer-events-auto overflow-hidden bg-[#0a0a0f]/80"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-neon-pink/5 blur-[50px] pointer-events-none group-hover:bg-neon-pink/15 transition-all duration-700 -translate-y-10 translate-x-10" />
                    <div className="mb-8 p-4 glass !rounded-2xl inline-block border-white/10 group-hover:border-neon-pink/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      {feat.icon}
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 text-white group-hover:text-neon-pink transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION SECTION */}
      <section className="py-32 relative z-10 bg-[#0a0a0f]/80 border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-pink/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -left-10 top-0 w-1 h-32 bg-gradient-to-b from-neon-pink to-transparent"></div>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white mb-8">
                Stop Manually <br />
                <span className="text-neon-pink drop-shadow-[0_0_20px_rgba(255,0,255,0.3)]">
                  Sending Emails.
                </span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed mb-8">
                Wasting hours every week drafting templates, managing
                attachments, and figuring out who actually replied?
              </p>
            </div>
            <div className="glass-card hover-glow-cyan p-12 rounded-[2.5rem] border-white/10 hover:-translate-y-2 transition-all duration-500 group relative">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-32 h-32 text-neon-cyan" />
              </div>
              <h3 className="text-3xl font-bold font-display text-white mb-6 flex items-center gap-4">
                <div className="p-3 bg-neon-cyan/20 rounded-xl">
                  <Zap className="text-neon-cyan w-8 h-8 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                </div>
                Focus on Closing
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 relative z-10">
                Let Genzio handle the heavy lifting. Our complete automation
                engine runs smoothly in the background, securing deliveries and
                handling scheduling so you only login when a lead is warm.
              </p>
              <Link
                to="/tool/email-automation"
                className="inline-flex items-center gap-3 px-8 py-4 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-xl font-bold hover:bg-neon-cyan hover:text-black uppercase tracking-widest text-sm transition-all duration-300 relative z-10"
              >
                See the Workspace Solution <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TestimonialsCarousel />

      {/* NEWSLETTER CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full relative z-10">
        <div className="glass-card p-16 md:p-24 text-center rounded-[3rem] border border-neon-pink/30 relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-[#120a12] shadow-[0_30px_60px_-15px_rgba(255,0,255,0.2)] group hover:border-neon-pink/60 transition-colors duration-700">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-neon-pink/20 blur-[150px] pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto font-sans">
            <h2 className="text-4xl md:text-6xl font-display font-black mb-6 text-white drop-shadow-lg">
              Join Our Newsletter
            </h2>
            <p className="text-gray-300 mb-12 text-lg md:text-xl">
              Get weekly updates on cold emailing best practices and sales
              engagement strategies directly to your inbox.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 shadow-2xl relative"
            >
              <input
                type="email"
                required
                placeholder="Enter your work email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-grow bg-[#050508]/80 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-5 text-lg text-white placeholder-gray-500 outline-none focus:border-neon-pink focus:ring-2 focus:ring-neon-pink/50 transition-all font-sans"
              />
              <button
                type="submit"
                className="btn-secondary hover-glow-pink bg-neon-pink text-matte-black border-none hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] whitespace-nowrap text-lg font-bold px-10 cursor-pointer select-none rounded-2xl"
              >
                {newsletterSubmitted ? "Subscribed!" : "Subscribe Now"}
              </button>
            </form>
            <AnimatePresence>
              {newsletterSubmitted && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="text-neon-cyan mt-6 text-lg absolute w-full text-center font-bold tracking-wide"
                >
                  You're on the list. Watch your inbox.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

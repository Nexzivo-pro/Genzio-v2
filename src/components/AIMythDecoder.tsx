import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Layers, Terminal, AlertCircle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface MythCard {
  id: number;
  category: string;
  myth: string;
  reality: string;
  tags: string[];
}

const MYTHS_DATA: MythCard[] = [
  {
    id: 1,
    category: "Deliverability",
    myth: "Cold Email Is Dead in 2026.",
    reality: "Bad cold email is dead. Highly relevant, personalized outreach to curated prospects drives over 40%+ open rates and consistent piping.",
    tags: ["Strategy", "Volume"]
  },
  {
    id: 2,
    category: "Spam Protection",
    myth: "If you send 1,000 emails, most will end up in spam folders.",
    reality: "Only if sent from a single domain. Spreading sending volume dynamically across multiple secondary domains keeps your IP reputation pristine.",
    tags: ["Setup", "Deliverability"]
  },
  {
    id: 3,
    category: "Open Rates",
    myth: "Subject lines are the only factor that drives your Open Rates.",
    reality: "Subject lines matter, but core deliverability (custom tracking domains, SPF/DKIM/DMARC alignments) determines if the email is seen at all.",
    tags: ["Technical", "Analytics"]
  },
  {
    id: 4,
    category: "Engagement",
    myth: "Writing longer, comprehensive business pitches gets more replies.",
    reality: "Wrong. Brevity wins. Short, crisp 3-sentence templates focused on a single pain point get 3.2x higher response rates.",
    tags: ["Copywriting", "Replies"]
  },
  {
    id: 5,
    category: "Gmail Limits",
    myth: "You can safely send 500 outbound emails per day from one inbox.",
    reality: "Never. Programmatic sending on single workspaces triggers fast bans. Genzio caps inboxes to 30-50 per day and scales via smart rotation.",
    tags: ["Inboxes", "Scale"]
  },
  {
    id: 6,
    category: "Personalization",
    myth: "Using {{First_Name}} tag is enough personalization.",
    reality: "That's basic spam. High-tier personalization researches the company's latest news, active tech stacks, or recent hire events automatically.",
    tags: ["AI", "Data"]
  },
  {
    id: 7,
    category: "AI Outreach",
    myth: "Fully AI-written emails sound robotic, repetitive, and fake.",
    reality: "Only cheap bots. Genzio's context-aware LLMs analyze recipient LinkedIn profiles to create highly structured, human-like prompts.",
    tags: ["AI Studio", "Automation"]
  },
  {
    id: 8,
    category: "Automation Safety",
    myth: "Email automation is unsafe and gets your core domain blacklisted.",
    reality: "Only when using unaligned sequencers. Safe automation mimics natural human velocity, randomizes intervals, and respects warmup curves.",
    tags: ["Security", "Strategy"]
  },
  {
    id: 9,
    category: "Email Warmup",
    myth: "New secondary domains are ready for full campaigns right away.",
    reality: "Immediate spam block. Brand new domains require a continuous 14-21 day warm-up protocol to build network trust with filters first.",
    tags: ["Domains", "Warmup"]
  },
  {
    id: 10,
    category: "Campaign Scaling",
    myth: "Scaling a campaign 10x simply requires uploading 10x more leads.",
    reality: "Unchecked volume scaling gets you flagged. Real scaling means multiplying independent sending channels and rotating them smoothly.",
    tags: ["Infrastructure", "Enterprise"]
  }
];

const ORB_MESSAGES = {
  idle: "Greetings. I am Genzio AI. Select any card to decode the email myths.",
  decoded: "A classic misconception. Deliverability is pure physics.",
  success: "Absolutely! High-relevance sender alignment is the secret.",
  random: "Ah, letting gravity choose. Decoding a random node...",
  complete: "Fabulous! You have achieved maximum email clarity. Standard sequencers can't compete."
};

const ORB_REACTION_SOUNDS = [
  "Subtle energy signal analyzed.",
  "Frequency shift detected.",
  "Acoustic feedback looped.",
  "System telemetry updated.",
  "Neural state aligned.",
  "Bypassing filter nodes."
];

export default function AIMythDecoder() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [decodedCount, setDecodedCount] = useState(0);
  const [orbState, setOrbState] = useState<'idle' | 'decoded' | 'success' | 'random' | 'complete'>('idle');
  const [orbMessage, setOrbMessage] = useState(ORB_MESSAGES.idle);
  const [orbPulseIntensity, setOrbPulseIntensity] = useState(1);
  const [orbColorStyle, setOrbColorStyle] = useState<'cyan' | 'pink' | 'purple'>('cyan');
  const [ripples, setRipples] = useState<{ id: number; color: string }[]>([]);
  const [currentTopicFilter, setCurrentTopicFilter] = useState<'All' | 'Deliverability' | 'AI' | 'Scale'>('All');

  const progressPercentage = (decodedCount / MYTHS_DATA.length) * 100;

  // React on progress completing
  useEffect(() => {
    if (decodedCount === MYTHS_DATA.length) {
      setOrbState('complete');
      setOrbMessage(ORB_MESSAGES.complete);
      setOrbColorStyle('pink');
    }
  }, [decodedCount]);

  const handleCardClick = (id: number) => {
    const isNowFlipped = !flippedCards[id];
    setFlippedCards(prev => ({ ...prev, [id]: isNowFlipped }));

    // Count decoded unique cards
    if (isNowFlipped) {
      setFlippedCards(prev => {
        const updated = { ...prev, [id]: true };
        const count = Object.keys(updated).filter(k => updated[Number(k)]).length;
        setDecodedCount(count);
        return updated;
      });

      // Trigger Orb Reactions
      triggerOrbReaction(id);
    } else {
      setFlippedCards(prev => {
        const updated = { ...prev, [id]: false };
        const count = Object.keys(updated).filter(k => updated[Number(k)]).length;
        setDecodedCount(count);
        return updated;
      });
      // Silent reset to idle
      setOrbState('idle');
      setOrbMessage("Card reset. Select another to decode.");
    }
  };

  const triggerOrbReaction = (id: number) => {
    // Determine custom messages based on card ID
    let msg = ORB_MESSAGES.decoded;
    if (id === 1) msg = "Myth 1 busted. Bad emails are dead; dynamic, hyper-relevant outreach dominates.";
    if (id === 2) msg = "Exact. Safe deliverability lies in smart horizontal scale, not vertical overload.";
    if (id === 3) msg = "Deliverability is the foundation. Beautiful copy in a Spam mailbox is useless.";
    if (id === 4) msg = "Indeed! Pitch emails should read like quick friendly Slack or LinkedIn notes.";
    if (id === 5) msg = "Gmail filters track sudden high bursts. Steady rotation preserves sending life.";
    if (id === 6) msg = "Standard placeholders look cheap. Genuine personalization analyzes exact context.";
    if (id === 7) msg = "Yes! Modern generative LLM models mimic actual organic context and structure.";
    if (id === 8) msg = "Velocity limits and human-like natural sending delays bypass standard firewalls.";
    if (id === 9) msg = "Domains need a historical pattern of positive replies to qualify for high volume.";
    if (id === 10) msg = "Exactly. Multiple domains distribute the trust rating safely.";

    setOrbMessage(msg);
    setOrbState('decoded');
    
    // Pulse animation logic
    setOrbPulseIntensity(1.5);
    setTimeout(() => setOrbPulseIntensity(1), 800);

    // Randomize Orb Color Style
    const colors: ('cyan' | 'pink' | 'purple')[] = ['cyan', 'pink', 'purple'];
    const randomColor = colors[id % colors.length];
    setOrbColorStyle(randomColor);

    // Emit a dynamic visual ripple
    const newRipple = {
      id: Date.now(),
      color: randomColor === 'cyan' ? 'rgba(0, 243, 255, 0.4)' : randomColor === 'pink' ? 'rgba(255, 10, 120, 0.4)' : 'rgba(168, 85, 247, 0.4)'
    };
    setRipples(prev => [...prev, newRipple]);

    // Clean up ripples
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1500);
  };

  const handleDecodeRandom = () => {
    // Find un-flipped cards
    const unflippedIds = MYTHS_DATA.filter(m => !flippedCards[m.id]).map(m => m.id);
    
    if (unflippedIds.length === 0) {
      // Re-flip a random card anyway
      const randomId = MYTHS_DATA[Math.floor(Math.random() * MYTHS_DATA.length)].id;
      // Reset all and flip that one
      const newFlipped: Record<number, boolean> = {};
      newFlipped[randomId] = true;
      setFlippedCards(newFlipped);
      setDecodedCount(1);
      setOrbMessage("Resetting board. Decoding random node...");
      triggerOrbReaction(randomId);
      return;
    }

    const targetId = unflippedIds[Math.floor(Math.random() * unflippedIds.length)];
    
    setOrbState('random');
    setOrbMessage("Gravitational scan initialized... target locked.");
    setOrbPulseIntensity(2);
    setOrbColorStyle('pink');

    // Add glowing ripple
    const newRipple = { id: Date.now(), color: 'rgba(255, 10, 120, 0.6)' };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setFlippedCards(prev => {
        const updated = { ...prev, [targetId]: true };
        setDecodedCount(Object.keys(updated).filter(k => updated[Number(k)]).length);
        return updated;
      });
      triggerOrbReaction(targetId);
    }, 600);
  };

  // Filter functionality
  const filteredMyths = MYTHS_DATA.filter(myth => {
    if (currentTopicFilter === 'All') return true;
    if (currentTopicFilter === 'Deliverability') return ['Deliverability', 'Spam Protection', 'Email Warmup'].includes(myth.category);
    if (currentTopicFilter === 'AI') return ['AI Outreach', 'Personalization'].includes(myth.category);
    if (currentTopicFilter === 'Scale') return ['Gmail Limits', 'Campaign Scaling', 'Automation Safety'].includes(myth.category);
    return true;
  });

  return (
    <div id="ai-myth-decoder" className="w-full relative z-10 bg-[#050508] py-12">
      {/* Visual background accents */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-neon-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />

      {/* Top Header & Discovery Dashboard Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-[#0a0a0f]/90 backdrop-blur-2xl transition-all duration-300 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
          <div className="flex-1 w-full text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[9px] font-mono tracking-widest text-[#00f3ff] uppercase font-bold">Interactive Deep Education</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight mb-3">
              Genzio AI <span className="text-gradient font-black">Myth Decoder</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
              Ditch the generic guides. Unveil absolute operational secrets and high-volume email strategies validated by live neural analytics.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-stretch gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 self-stretch justify-center">
            {/* Discovery Stats indicator */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold tracking-wider text-gray-400">
                <span>DECRYPTION PROGRESS</span>
                <span className="text-neon-cyan font-black">{decodedCount} / {MYTHS_DATA.length} DECODED</span>
              </div>
              <div className="h-2 w-full sm:w-64 md:w-80 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ type: "spring", stiffness: 60 }}
                />
              </div>
            </div>

            <button
              onClick={handleDecodeRandom}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan/10 to-neon-pink/10 hover:from-neon-cyan/20 hover:to-neon-pink/20 text-white font-mono text-xs font-black tracking-widest uppercase border border-neon-cyan/30 hover:border-neon-pink/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,243,255,0.05)] hover:shadow-[0_0_25px_rgba(255,10,120,0.15)] overflow-hidden"
            >
              <RefreshCw className="w-4 h-4 text-neon-pink animate-spin" style={{ animationDuration: '6s' }} /> 🎲 DECODE RANDOM MYTH
            </button>
          </div>
        </div>

        {/* Categories Filtering tabs */}
        <div className="flex flex-wrap items-center gap-2 justify-center mt-12 bg-white/5 p-1.5 rounded-2xl border border-white/5 max-w-lg mx-auto">
          {(['All', 'Deliverability', 'AI', 'Scale'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTopicFilter(tab)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-mono tracking-wider font-extrabold transition-all uppercase cursor-pointer ${
                currentTopicFilter === tab
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-black font-black shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Orb panel, Right Myth cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Floating AI Orb Container panel (Moves top on mobile) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 flex flex-col items-center justify-center bg-[#07070c] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden order-first lg:order-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,243,255,0.03),transparent_70%)]" />
          
          {/* Subtle design patterns */}
          <div className="absolute top-4 left-4 font-mono text-[9px] text-[#00f3ff]/40 tracking-widest uppercase">Genzio AI Core</div>
          <div className="absolute bottom-4 right-4 font-mono text-[8px] text-gray-600">STATE: ACTIVE</div>

          {/* Animated 3D-effect Orb */}
          <div className="relative w-64 h-64 flex items-center justify-center my-6">
            
            {/* Multiple dynamic rings radiating outwards on action */}
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                className="absolute inset-0 rounded-full border border-solid"
                style={{ borderColor: ripple.color }}
                initial={{ scale: 0.8, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            ))}

            {/* Glowing static background shadow */}
            <div className={`absolute w-44 h-44 rounded-full filter blur-[40px] opacity-40 transition-colors duration-1000 ${
              orbColorStyle === 'pink' ? 'bg-neon-pink' : orbColorStyle === 'purple' ? 'bg-purple-600' : 'bg-neon-cyan'
            }`} />

            {/* Pulsing halo */}
            <motion.div
              className={`absolute w-36 h-36 rounded-full border-2 ${
                orbColorStyle === 'pink' ? 'border-neon-pink/30 shadow-[0_0_30px_rgba(255,10,120,0.15)]' : orbColorStyle === 'purple' ? 'border-purple-500/30' : 'border-neon-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.15)]'
              }`}
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Outer dotted orbit */}
            <motion.div
              className={`absolute w-48 h-48 rounded-full border border-dashed ${
                orbColorStyle === 'pink' ? 'border-neon-pink/20' : 'border-neon-cyan/20'
              }`}
              animate={{
                rotate: [360, 0]
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* The core interactive Sphere */}
            <motion.div
              className={`w-32 h-32 rounded-full cursor-pointer relative z-10 overflow-hidden flex items-center justify-center select-none bg-gradient-to-tr ${
                orbColorStyle === 'pink'
                  ? 'from-purple-900 via-[#1f0a1d]/90 to-[#ff0a78]/80 shadow-[inset_0_0_20px_rgba(255,10,120,0.6),0_0_35px_rgba(255,10,120,0.35)]'
                  : orbColorStyle === 'purple'
                  ? 'from-slate-900 via-indigo-950 to-purple-500 shadow-[inset_0_0_20px_rgba(168,85,247,0.6),0_0_35px_rgba(168,85,247,0.35)]'
                  : 'from-[#031520] via-[#091e2b]/95 to-[#00f3ff]/70 shadow-[inset_0_0_20px_rgba(0,243,255,0.6),0_0_35px_rgba(0,243,255,0.35)]'
              }`}
              animate={{
                y: [-6, 6, -6],
                scale: orbPulseIntensity,
                boxShadow: orbPulseIntensity > 1 ? '0 0 50px rgba(255,255,255,0.4)' : undefined
              }}
              transition={{
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                scale: {
                  type: "spring",
                  stiffness: 120,
                  damping: 10
                }
              }}
              onClick={handleDecodeRandom}
            >
              {/* Inner glowing fluid effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay" />
              <motion.div 
                className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-neon-cyan/40 to-neon-pink/40 blur-xl"
                animate={{
                  x: [-10, 10, -10],
                  y: [-10, 10, -10]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Sparkles className={`w-8 h-8 transition-colors duration-500 ${
                orbColorStyle === 'pink' ? 'text-neon-pink' : 'text-neon-cyan'
              }`} />
            </motion.div>
          </div>

          {/* Interactive Assistant Dialogue card */}
          <div className="w-full bg-[#050508]/90 border border-white/10 rounded-2xl p-5 relative mt-4 shadow-xl">
            <div className="absolute -top-2 left-12 w-4 h-4 bg-[#050508] border-l border-t border-white/10 rotate-45" />
            
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-ping" />
              <span className="text-[10px] font-mono font-black tracking-widest text-neon-cyan uppercase">SYSTEM PROTOCOL SENTIENT</span>
            </div>

            <p className="text-gray-300 font-sans text-sm leading-relaxed mt-1 font-medium transition-all duration-300">
              "{orbMessage}"
            </p>

            {orbState !== 'idle' && (
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-neon-pink" /> {ORB_REACTION_SOUNDS[decodedCount % ORB_REACTION_SOUNDS.length]}
                </span>
                <span className="text-[9px] font-mono text-neon-cyan uppercase">0x81F2_OK</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Myth Cards list */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMyths.map((item, index) => {
              const isFlipped = !!flippedCards[item.id];
              return (
                <motion.div
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full relative h-[180px] md:h-[150px] cursor-pointer"
                  style={{ perspective: "1500px" }}
                  onClick={() => handleCardClick(item.id)}
                >
                  <motion.div
                    className="w-full h-full relative"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 90, damping: 15 }}
                  >
                    
                    {/* FRONT SIDE (MYTH) */}
                    <div
                      className={`absolute inset-0 w-full h-full p-6 md:p-8 rounded-[2rem] border transition-all flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0d0d12] to-[#07070b] ${
                        isFlipped 
                          ? 'border-transparent' 
                          : 'border-white/5 hover:border-neon-cyan/30 hover:shadow-[0_0_30px_rgba(0,243,255,0.05)]'
                      }`}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      {/* Grid background decorative layout */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,0,255,0.02),transparent_50%)]" />

                      {/* Header row */}
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-neon-pink font-bold px-2.5 py-1 rounded-md bg-neon-pink/10 border border-neon-pink/20">
                            Myth {item.id}
                          </span>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold">
                            {item.category}
                          </span>
                        </div>
                        <HelpCircle className="w-5 h-5 text-gray-600 hover:text-neon-cyan transition-colors" />
                      </div>

                      {/* Content statement */}
                      <div className="relative z-10 my-1">
                        <h3 className="text-lg md:text-xl font-display font-black text-white hover:text-neon-cyan transition-colors flex items-center gap-3">
                          <span className="text-neon-pink/80 font-mono select-none">“</span>
                          {item.myth}
                          <span className="text-neon-pink/80 font-mono select-none">”</span>
                        </h3>
                      </div>

                      {/* Bottom tags bar */}
                      <div className="flex justify-between items-center relative z-10 border-t border-white/5 pt-2.5 mt-1">
                        <div className="flex items-center gap-2">
                          {item.tags.map((tg, i) => (
                            <span key={i} className="text-[9px] font-mono font-semibold text-gray-500 uppercase px-1.5 py-0.5 rounded border border-white/5 bg-white/5">
                              #{tg}
                            </span>
                          ))}
                        </div>
                        <span className="text-[9px] font-mono tracking-[0.2em] font-black text-neon-cyan flex items-center gap-1 group-hover:gap-2 transition-all">
                          DECRYPT MYTH <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* BACK SIDE (REALITY) */}
                    <div
                      className="absolute inset-0 w-full h-full p-6 md:p-8 rounded-[2rem] border border-neon-cyan/40 bg-gradient-to-br from-[#0c131a] via-[#05090f] to-[#040407] shadow-[0_0_35px_rgba(0,243,255,0.08)] flex flex-col justify-between overflow-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)"
                      }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,243,255,0.04),transparent_60%)]" />

                      {/* Header row */}
                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#00f3ff] font-bold px-2.5 py-1 rounded-md bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-neon-cyan animate-pulse" /> Verified Reality
                          </span>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 font-bold">
                            Fact Check
                          </span>
                        </div>
                        <CheckCircle className="w-5 h-5 text-neon-cyan" />
                      </div>

                      {/* Content statement */}
                      <div className="relative z-10 my-1">
                        <p className="text-gray-200 font-sans text-sm md:text-base leading-relaxed font-semibold">
                          {item.reality}
                        </p>
                      </div>

                      {/* Bottom action info */}
                      <div className="flex justify-between items-center relative z-10 border-t border-white/10 pt-2.5">
                        <span className="text-[9px] font-mono text-gray-400">
                          Infrastructure Verified • Genzio SaaS 2026
                        </span>
                        <span className="text-[9px] font-mono tracking-widest font-black text-neon-pink uppercase">
                          Click to Flip Back
                        </span>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredMyths.length === 0 && (
            <div className="text-center p-12 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-1">No myths found in category</h4>
              <p className="text-gray-400 text-sm">Please select another topic filter above.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

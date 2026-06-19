import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import Matter from 'matter-js';
import { Bot, Mail, Shield, BarChart, Users, Sparkles, Zap, RefreshCw, Layers, LayoutTemplate, Link2, Target, Clock, FileSpreadsheet, Search, AlertTriangle, Infinity as InfinityIcon } from 'lucide-react';

const faqs = [
  { id: 1, topic: 'Spam Filters', icon: Shield, answer: 'Our AI analyzes content in real-time, matching patterns against 10M+ known spam markers. We enforce warm-up phases and auto-throttle sending rates to keep your domain reputation flawless.' },
  { id: 2, topic: 'Deliverability', icon: Zap, answer: 'We automatically verify SPF, DKIM, and DMARC configurations. We also use a progressive warm-up pool and verify all lead emails before ever clicking send.' },
  { id: 3, topic: 'Open Rates', icon: Search, answer: 'We use invisible 1x1 tracking pixels and custom domains. Apple Mail Privacy (AMPP) can skew open rates, so we build robust datasets to maintain accuracy.' },
  { id: 4, topic: 'Reply Rates', icon: Target, answer: 'We focus on reply rates as the true baseline metric. Every campaign is automatically optimized to push leads into direct conversational phases.' },
  { id: 5, topic: 'Templates', icon: LayoutTemplate, answer: 'Our Vault contains 50+ battle-tested templates used by top SaaS companies, parameterized for dynamic insertion to ensure total uniqueness.' },
  { id: 6, topic: 'Variables', icon: Layers, answer: 'Parameterize for dynamic insertion using Spintax to ensure total uniqueness. Add custom dynamic parameters per lead seamlessly.' },
  { id: 7, topic: 'Analytics', icon: BarChart, answer: 'Real-time telemetry showing true inbox placement, bounce metrics, and positive reply ratios tracked across individual IPs and accounts.' },
  { id: 8, topic: 'Campaigns', icon: Target, answer: 'Build complex multi-step omnichannel flows. Mix email and manual steps to construct scalable high-converting pipelines.' },
  { id: 9, topic: 'Google Sheets', icon: FileSpreadsheet, answer: 'Import natively from Google Sheets or CSVs with automated field mapping and instant variable validation.' },
  { id: 10, topic: 'AI Assistant', icon: Bot, answer: 'It drafts hyper-personalized openers by scanning your prospect’s website and LinkedIn, rewrites your templates, and auto-categorizes replies.' },
  { id: 11, topic: 'Personalization', icon: Sparkles, answer: 'Beyond basic first_name. We extract company pain points, recent news, and tech stacks to weave naturally into your email body.' },
  { id: 12, topic: 'A/B Testing', icon: Layers, answer: 'You can A/B/C test subject lines, body copy, and AI prompts. Genzio automatically shifts volume to the winning variant.' },
  { id: 13, topic: 'Follow-ups', icon: RefreshCw, answer: 'Genzio detects replies and out-of-office autoreplies. If a lead replies, the sequence stops immediately to avoid awkward follow-ups.' },
  { id: 14, topic: 'Security', icon: Users, answer: 'We are SOC 2 Type II compliant. We do not read your emails outside of the active campaigns, and access tokens are AES-256 encrypted at rest.' },
  { id: 15, topic: 'Bounces', icon: AlertTriangle, answer: 'Bounces are instantly logged. If your bounce rate exceeds 3%, we automatically pause the entire campaign to protect your sender reputation.' },
  { id: 16, topic: 'Inbox Rotation', icon: RefreshCw, answer: 'Google Workspace and Outlook rate limits are strictly enforced. We distribute your outgoing volume dynamically across all connected addresses.' },
  { id: 17, topic: 'Scheduling', icon: Clock, answer: 'Schedule emails based on the recipient\'s exact local time zone using reverse-IP geocoding and standard schedule windows.' },
  { id: 18, topic: 'Warmup', icon: InfinityIcon, answer: 'Our progressive P2P warm-up pool safely scales your sending volume dynamically over 30 days before full thrust capacity.' },
  { id: 19, topic: 'Tracking', icon: Target, answer: 'Track opens, clicks, and replies through isolated dedicated tracking domains to prevent negative cross-reputation.' },
  { id: 20, topic: 'Integrations', icon: Link2, answer: 'Native REST two-way sync for Salesforce, HubSpot, and Pipedrive. Catch-all Webhooks for anything else.' },
];

export default function FAQPhysicsVault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const cubesRef = useRef<Record<number, HTMLDivElement | null>>({});
  const bodiesRef = useRef<Matter.Body[]>([]);

  const [activeId, setActiveId] = useState<number | null>(null);
  const activeIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const sizesRef = useRef<Record<number, number>>({});
  const inView = useInView(containerRef, { once: true, amount: 0.1 });

  const updateActiveId = (id: number | null) => {
    activeIdRef.current = id;
    setActiveId(id);
  };

  useEffect(() => {
    if (!inView || !containerRef.current) return;

    faqs.forEach(faq => {
      sizesRef.current[faq.id] = 120 + Math.random() * 40; // 120px to 160px
    });

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = 0.6; // Bouncy float gravity
    
    // Size mapping bounds
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const wallOptions = { 
      isStatic: true, 
      friction: 0.1, 
      restitution: 0.6,
      render: { visible: false }
    };

    // Extra thick walls to prevent tunneling during fast drags
    const ground = Matter.Bodies.rectangle(width / 2, height + 250, width * 3, 500, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-250, height / 2, 500, height * 4, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 250, height / 2, 500, height * 4, wallOptions);
    // Ceiling exists far above to prevent throwing into infinity forever, giving them a chance to fall back down
    const ceiling = Matter.Bodies.rectangle(width / 2, -2500, width * 3, 500, wallOptions);

    Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    const newBodies: Matter.Body[] = [];
    faqs.forEach((faq) => {
      const size = sizesRef.current[faq.id];
      const x = Math.random() * (width - 300) + 150;
      const y = -200 - Math.random() * 1500; // Staggered drop from above
      
      const body = Matter.Bodies.rectangle(x, y, size, size, {
        label: String(faq.id),
        restitution: 0.5,
        friction: 0.05,
        frictionAir: 0.015,
        density: 0.005,
        chamfer: { radius: 24 }
      });
      
      Matter.Body.setAngle(body, Math.random() * Math.PI * 2);
      newBodies.push(body);
    });

    Matter.World.add(engine.world, newBodies);
    bodiesRef.current = newBodies;

    // Interaction handling via default engine plugins
    const mouse = Matter.Mouse.create(containerRef.current);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.15,
        render: { visible: false }
      }
    });

    (mouse.element as HTMLElement).removeEventListener("mousewheel", (mouse as any).mousewheel);
    (mouse.element as HTMLElement).removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    Matter.World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousedown", (event) => {
      const found = Matter.Query.point(newBodies, event.mouse.position);
      if (found.length > 0) {
        isDraggingRef.current = true;
        updateActiveId(Number(found[0].label));
      }
    });

    Matter.Events.on(mouseConstraint, "mousemove", (event) => {
      if (!isDraggingRef.current) {
        const found = Matter.Query.point(newBodies, event.mouse.position);
        if (found.length > 0) {
          const bodyId = Number(found[0].label);
          if (activeIdRef.current !== bodyId) {
             updateActiveId(bodyId);
          }
          document.body.style.cursor = 'grab';
        } else {
          if (activeIdRef.current !== null) {
             updateActiveId(null);
          }
          document.body.style.cursor = 'default';
        }
      } else {
         document.body.style.cursor = 'grabbing';
      }
    });

    Matter.Events.on(mouseConstraint, "mouseup", (event) => {
      isDraggingRef.current = false;
      document.body.style.cursor = 'default';
      
      const found = Matter.Query.point(newBodies, event.mouse.position);
      if (found.length > 0) {
         updateActiveId(Number(found[0].label));
         // Light release physics bump immediately outwards
         const body = newBodies.find(b => b.label === found[0].label);
         if (body) {
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: -6 });
         }
      } else {
         updateActiveId(null);
      }
    });

    // Enforce upright rotation when physically interacting with a cube
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (activeIdRef.current) {
        const body = bodiesRef.current.find(b => Number(b.label) === activeIdRef.current);
        if (body) {
          // Snap strictly to upright to ensure perfect readable cards
          Matter.Body.setAngle(body, 0);
          Matter.Body.setAngularVelocity(body, 0);
        }
      }
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    let frame: number;
    const updateVisuals = () => {
      bodiesRef.current.forEach(body => {
        const id = Number(body.label);
        const el = cubesRef.current[id];
        if (el) {
          el.style.transform = `translate(-50%, -50%) translate(${body.position.x}px, ${body.position.y}px) rotate(${body.angle}rad)`;
          el.style.zIndex = activeIdRef.current === id ? '50' : '10';
        }
      });
      frame = requestAnimationFrame(updateVisuals);
    };
    updateVisuals();

    const handleResize = () => {
       if (!containerRef.current) return;
       const w = containerRef.current.clientWidth;
       const h = containerRef.current.clientHeight;
       Matter.Body.setPosition(ground, { x: w/2, y: h + 250 });
       Matter.Body.setPosition(leftWall, { x: -250, y: h/2 });
       Matter.Body.setPosition(rightWall, { x: w + 250, y: h/2 });
       Matter.Body.setPosition(ceiling, { x: w/2, y: -2500 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      cancelAnimationFrame(frame);
      document.body.style.cursor = 'default';
    };
  }, [inView]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 bg-[#030303] flex flex-col items-center">
      {/* Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="text-center mb-12 z-10 w-full max-w-4xl px-4">
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-pink drop-shadow-[0_0_15px_rgba(0,243,255,0.3)] tracking-tight">
          Knowledge Physics
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Hover any ice cube to unlock its data. Grab, drag, and interact with the physical simulation engine.
        </p>
      </div>

      {/* Physics Container Vault */}
      {/* Note: Purposely omit overflow-hidden to allow cubes dropping from top margin & dragging out! */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-[1400px] h-[800px] mt-4 z-20 rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent shadow-[inset_0_0_100px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm touch-none"
      >
         {/* Vault Top & Bottom glass lines */}
         <div className="absolute top-0 inset-x-20 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent blur-[1px] pointer-events-none"></div>
         <div className="absolute bottom-0 inset-x-20 h-px bg-gradient-to-r from-transparent via-neon-pink/40 to-transparent blur-[1px] pointer-events-none"></div>

         {/* Visual rendering mapping */}
         {faqs.map((faq) => (
             <div 
               key={faq.id}
               ref={(el) => cubesRef.current[faq.id] = el}
               className="absolute top-0 left-0 pointer-events-none"
               style={{ willChange: 'transform' }}
             >
                <CubeVisual faq={faq} isActive={activeId === faq.id} size={sizesRef.current[faq.id] || 120} />
             </div>
          ))}
      </div>
    </div>
  );
}

function CubeVisual({ faq, isActive, size }: { faq: typeof faqs[0], isActive: boolean, size: number }) {
  const Icon = faq.icon;
  
  return (
    <motion.div
      initial={false}
      animate={isActive ? "expanded" : "cube"}
      variants={{
         cube: {
            width: size,
            height: size,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(12px)",
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(0, 243, 255, 0.3), inset 20px 20px 40px -20px rgba(255, 0, 255, 0.4), inset -20px -20px 40px -20px rgba(0, 243, 255, 0.3)`,
            borderRadius: 24,
         },
         expanded: {
            width: 320,
            height: 280,
            backgroundColor: "rgba(10, 10, 14, 0.85)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 243, 255, 0.1), inset 0 0 0 1px rgba(0, 243, 255, 0.3), inset 0 20px 20px -20px rgba(255, 0, 255, 0.1)",
            borderRadius: 24,
         }
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Refraction effect - only in cube mode */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/40 via-white/5 to-neon-pink/40 mix-blend-screen rounded-[inherit] pointer-events-none" 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-2 top-2 h-1/4 bg-gradient-to-b from-white/60 to-transparent rounded-t-[20px] blur-[2px] pointer-events-none" 
          />
        )}
      </AnimatePresence>

      {/* Cube Icon & Title */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none z-10"
          >
            <Icon className="w-10 h-10 text-white/90 mb-3 drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" strokeWidth={1.5} />
            <span className="text-[12px] font-bold text-white leading-tight drop-shadow-md px-2">
              {faq.topic}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass Card Content (Expanded State) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 }}
            className="absolute inset-0 p-6 pb-5 flex flex-col pointer-events-none text-left"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex flex-shrink-0 items-center justify-center shadow-[inset_0_0_15px_rgba(0,243,255,0.2)]">
                <Icon className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{faq.topic}</h3>
            </div>
            
            <p className="text-gray-300 text-[15px] leading-relaxed flex-grow">
              {faq.answer}
            </p>
            
            <div className="mt-auto flex justify-center pt-4 border-t border-white/5">
              <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-pink/80 animate-pulse" />
                Release to launch back into vault
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}




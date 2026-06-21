import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, User, Bot } from 'lucide-react';

const CHAT_SCENARIOS = [
  {
    type: 'related',
    query: "Find SaaS leads",
    response: "I've scanned the database. Found 4,215 recent SaaS founders who raised Seed rounds in the last 30 days. Should I import them to a new campaign?",
  },
  {
    type: 'related',
    query: "Write outreach email",
    response: "Here's a high-converting template: 'Hey {{first_name}}, noticed {{company}} is scaling engineering...'. This pattern yields a 24% reply rate.",
  },
  {
    type: 'related',
    query: "How do I close clients?",
    response: "Focus on their friction points. In your next demo, ask 'What happens if you don't solve this?' before presenting pricing. I can analyze your last call transcript if you upload it.",
  },
  {
    type: 'unrelated',
    query: "Who won the football match?",
    response: "I focus exclusively on client acquisition, outreach, and business growth tasks. How can I help you scale your agency today?",
  }
];

function TypingEffect({ text, speed = 30 }: { text: string, speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

export default function GenzioAIModule() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'responding' | 'done'>('typing');

  useEffect(() => {
    let t1: NodeJS.Timeout, t2: NodeJS.Timeout, t3: NodeJS.Timeout;

    setPhase('typing');
    // Simulate user typing
    t1 = setTimeout(() => {
      setPhase('waiting');
      // Simulate AI thinking
      t2 = setTimeout(() => {
        setPhase('responding');
        // AI reads response, then waits
        t3 = setTimeout(() => {
           setPhase('done');
           setTimeout(() => {
             setScenarioIndex(prev => (prev + 1) % CHAT_SCENARIOS.length);
           }, 2000);
        }, 4000);
      }, 1000);
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [scenarioIndex]);

  const currentScenario = CHAT_SCENARIOS[scenarioIndex];

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-center max-w-5xl mx-auto h-full">
      {/* Description Panel */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <div>
          <h3 className="text-3xl font-display font-black text-white mb-4 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-neon-pink" /> Genzio AI
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Not a generic chatbot. A specialized engine built specifically for <strong className="text-white">client acquisition</strong> and <strong className="text-white">agency growth</strong>.
          </p>
          <div className="bg-neon-pink/10 border border-neon-pink/30 p-4 rounded-xl text-sm text-neon-pink font-medium">
            Trained exclusively on high-performing B2B outreach data, sales frameworks, and growth playbooks.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-[#050508] border border-white/5 p-3 rounded-lg text-sm text-gray-400">✅ Lead Sourcing</div>
          <div className="bg-[#050508] border border-white/5 p-3 rounded-lg text-sm text-gray-400">✅ Copywriting</div>
          <div className="bg-[#050508] border border-white/5 p-3 rounded-lg text-sm text-gray-400">✅ Sales Strategy</div>
          <div className="bg-[#050508] border border-white/5 p-3 rounded-lg text-sm text-gray-400">❌ General Trivia</div>
        </div>
      </div>

      {/* Visual Area */}
      <div className="w-full md:w-1/2 max-w-md bg-[#050508] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative h-[450px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink to-neon-cyan p-[1px]">
             <div className="w-full h-full bg-[#050508] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
             </div>
           </div>
           <div>
             <div className="text-sm font-bold text-white">Genzio Assistant</div>
             <div className="text-[10px] text-green-400 font-mono flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> SPECIALIZED AGENT
             </div>
           </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto w-full relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`user-${scenarioIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="self-end max-w-[80%] bg-white/10 text-white text-sm p-4 rounded-2xl rounded-tr-sm border border-white/5"
            >
              {phase === 'typing' ? (
                 <TypingEffect text={currentScenario.query} speed={50} />
              ) : (
                 currentScenario.query
              )}
            </motion.div>
          </AnimatePresence>

          {(phase === 'waiting' || phase === 'responding' || phase === 'done') && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="self-start max-w-[85%] bg-neon-cyan/5 text-gray-200 text-sm p-4 rounded-2xl rounded-tl-sm border border-neon-cyan/20"
            >
              {phase === 'waiting' && (
                <div className="flex gap-1 py-1">
                  <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                  <motion.div animate={{ y: [0,-5,0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                </div>
              )}
              {(phase === 'responding' || phase === 'done') && (
                <div className={`leading-relaxed ${currentScenario.type === 'unrelated' ? 'text-gray-400 italic' : ''}`}>
                  <TypingEffect text={currentScenario.response} speed={30} />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/5 bg-white/5">
           <div className="w-full h-10 bg-[#050508] border border-white/10 rounded-full px-4 flex items-center">
             <span className="text-xs text-gray-600 font-mono">Ask about growth...</span>
           </div>
        </div>
      </div>
    </div>
  );
}

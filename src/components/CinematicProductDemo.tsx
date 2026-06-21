import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  CheckCircle2,
  XCircle,
  BarChart3,
  Image as ImageIcon,
  Send,
  Clock,
  Sparkles,
  RefreshCw,
  Layers,
  Zap,
  Shield,
  MousePointer2,
} from "lucide-react";

/* 
SCENE 1: Login Screen -> User enters workspace
SCENE 2: Connect Gmail -> Connected successfully
SCENE 3: Connect Google Sheets -> Spreadsheet imported
SCENE 4: Open Email Automation -> Variables inserted -> Email preview generated
SCENE 5: Configure smart delays -> Campaign starts
SCENE 6: Analytics dashboard -> Replies increase -> Open rate increases -> Charts animate
SCENE 7: Email Verifier -> List appears -> Verified emails get green checks -> Invalid get red crosses
SCENE 8: Open Genzio AI -> Upload image / PDF -> AI processes file -> AI generates response
SCENE 9: Campaign completed -> Workflow success animation
*/

const scenes = [
  "LOGIN",
  "CONNECT_GMAIL",
  "CONNECT_SHEETS",
  "EMAIL_AUTOMATION",
  "SMART_DELAYS",
  "ANALYTICS",
  "EMAIL_VERIFIER",
  "GENZIO_AI",
  "COMPLETED",
];

function SceneLogin() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="w-80 glass-card p-6 rounded-2xl border border-white/10 flex flex-col items-center"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-neon-cyan to-neon-pink rounded-xl mb-6 mx-auto flex items-center justify-center">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <div className="w-full h-10 bg-white/5 rounded-lg mb-4 border border-white/10 relative overflow-hidden flex items-center px-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="absolute left-0 top-0 bottom-0 bg-neon-cyan/10"
          />
          <span className="text-xs font-mono text-gray-400">
            admin@work.com
          </span>
        </div>
        <div className="w-full h-10 bg-white/5 rounded-lg mb-6 border border-white/10 flex items-center px-4">
          <span className="text-xs font-mono text-gray-400 text-xl tracking-[0.2em] mt-1">
            ********
          </span>
        </div>
        <motion.div
          animate={{ scale: [1, 0.95, 1] }}
          transition={{ delay: 1.6, duration: 0.2 }}
          className="w-full h-10 bg-white rounded-lg flex items-center justify-center text-black font-bold text-sm border-none shadow-none"
        >
          Enter Workspace
        </motion.div>
      </motion.div>
    </div>
  );
}

function SceneConnectGmail() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Mail className="w-8 h-8 text-gray-400" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 100 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="h-[2px] bg-gradient-to-r from-gray-600 to-neon-cyan relative"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-neon-cyan border-[3px] border-[#050508]"
            />
          </motion.div>
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.2)] flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-neon-cyan" />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center gap-2 text-neon-cyan font-mono text-sm uppercase tracking-widest bg-neon-cyan/10 px-4 py-2 rounded-full border border-neon-cyan/30"
        >
          <CheckCircle2 className="w-4 h-4" /> Connected Successfully
        </motion.div>
      </motion.div>
    </div>
  );
}

function SceneConnectSheets() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="w-[400px] glass-card rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
          <Layers className="w-4 h-4 text-green-400" />
          <span className="text-xs font-mono text-gray-400">
            leads_import.csv
          </span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="ml-auto flex items-center gap-1 text-[10px] text-green-400"
          >
            <CheckCircle2 className="w-3 h-3" />
            IMPORTED
          </motion.div>
        </div>
        <div className="p-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "30%" }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="h-6 bg-white/5 rounded border border-white/5"
              />
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "40%" }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="h-6 bg-white/5 rounded border border-white/5"
              />
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "30%" }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                className="h-6 bg-white/5 rounded border border-white/5 relative overflow-hidden"
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ delay: 1 + i * 0.1, duration: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                />
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SceneEmailAutomation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-lg glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col"
      >
        <div className="h-10 border-b border-white/10 flex items-center px-4 bg-white/5 justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase">
            Automation Sequence #1
          </span>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4 text-sm font-mono text-gray-400">
            Subject:{" "}
            <motion.span
              initial={{ backgroundColor: "rgba(255,0,255,0)" }}
              animate={{
                backgroundColor: [
                  "rgba(255,0,255,0)",
                  "rgba(255,0,255,0.2)",
                  "rgba(255,0,255,0)",
                ],
              }}
              transition={{ delay: 1, duration: 1 }}
              className="text-white bg-neon-pink/20 px-2 py-0.5 rounded border border-neon-pink/30 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              {"{{CompanyName}}"} Update
            </motion.span>
          </div>
          <div className="text-sm font-mono text-gray-400 leading-relaxed space-y-3">
            <p>
              Hi{" "}
              <span className="text-neon-cyan bg-neon-cyan/10 px-1 rounded border border-neon-cyan/20">
                {"{{FirstName}}"}
              </span>
              ,
            </p>
            <p>
              I noticed that{" "}
              <span className="text-neon-cyan bg-neon-cyan/10 px-1 rounded border border-neon-cyan/20">
                {"{{CompanyName}}"}
              </span>{" "}
              recently
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="inline-block overflow-hidden whitespace-nowrap text-white font-bold bg-white/10 px-1 ml-1 rounded align-bottom"
              >
                raised Series B
              </motion.span>
              ...
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="mt-6 flex justify-end"
          >
            <div className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border-none">
              <Send className="w-4 h-4" /> Preview & Build
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function SceneSmartDelays() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-[300px] relative"
      >
        <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-white/10 z-0" />

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex gap-4 items-center mb-6 relative z-10"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative">
            <Mail className="w-5 h-5 text-white" />
            <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#050508]" />
          </div>
          <div className="glass-card flex-1 p-3 rounded-xl border border-white/10 text-sm font-mono text-gray-300">
            Email 1 (Sent)
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 items-center mb-6 relative z-10"
        >
          <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            <Clock className="w-5 h-5 text-neon-cyan" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-neon-cyan/50 border-t-transparent"
            />
          </div>
          <div className="glass-card flex-1 p-3 rounded-xl border border-neon-cyan/30 text-sm font-mono text-neon-cyan bg-neon-cyan/5">
            Wait 2 Days
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-4 items-center relative z-10"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-gray-500" />
          </div>
          <div className="glass-card flex-1 p-3 rounded-xl border border-white/5 text-sm font-mono text-gray-500 line-through decoration-white/20">
            Email 2 (Queued)
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 2, type: "spring" }}
          className="absolute -right-12 top-1/2 -translate-y-1/2 bg-neon-pink text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,255,0.4)] whitespace-nowrap"
        >
          Campaign Active
        </motion.div>
      </motion.div>
    </div>
  );
}

function SceneAnalytics() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        className="w-full max-w-xl grid grid-cols-2 gap-4"
      >
        <div className="col-span-2 glass-card p-6 rounded-2xl border border-white/10">
          <div className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Performance Metrics
          </div>
          <div className="flex items-end gap-2 h-32 relative">
            {/* Chart Bars */}
            {[40, 55, 30, 65, 80, 50, 95].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-white/5 rounded-t-sm relative group"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    delay: 0.2 + i * 0.1,
                    duration: 1,
                    type: "spring",
                  }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-neon-cyan/20 to-neon-cyan rounded-t-sm"
                />
              </div>
            ))}

            {/* Trend Line Overlay */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                d="M0,80 L15,60 L30,85 L45,45 L60,30 L75,65 L100,10"
                fill="none"
                stroke="#ff00ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]"
              />
            </svg>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">
            Open Rate
          </div>
          <div className="flex items-end gap-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-4xl font-display font-bold text-white"
            >
              68<span className="text-2xl text-gray-500">%</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-xs text-green-400 mb-1 flex items-center"
            >
              <Zap className="w-3 h-3 mr-1" /> +12%
            </motion.div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-center">
          <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">
            Reply Rate
          </div>
          <div className="flex items-end gap-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-4xl font-display font-bold text-white"
            >
              24<span className="text-2xl text-gray-500">%</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
              className="text-xs text-neon-pink mb-1 flex items-center"
            >
              <Sparkles className="w-3 h-3 mr-1" /> High
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SceneEmailVerifier() {
  const emails = [
    { email: "john@startup.io", status: "checking", delay: 0.5 },
    { email: "sarah@acmecorp.com", status: "checking", delay: 1.0 },
    { email: "fake.user@test.net", status: "checking", delay: 1.5 },
    { email: "mike.chen@design.co", status: "checking", delay: 2.0 },
  ];

  const [statuses, setStatuses] = useState(emails.map((e) => e.status));

  useEffect(() => {
    emails.forEach((e, i) => {
      setTimeout(
        () => {
          setStatuses((prev) => {
            const newStatuses = [...prev];
            newStatuses[i] = i === 2 ? "invalid" : "valid";
            return newStatuses;
          });
        },
        e.delay * 1000 + 1000,
      );
    });
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-[380px] glass-card rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-mono text-white">
              List Verification
            </span>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </motion.div>
        </div>
        <div className="p-2">
          {emails.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              className="flex justify-between items-center p-3 border-b border-white/5 last:border-0"
            >
              <span className="text-xs font-mono text-gray-300">
                {item.email}
              </span>
              <div>
                {statuses[i] === "checking" && (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-500 border-t-transparent animate-spin inline-block" />
                )}
                {statuses[i] === "valid" && (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                )}
                {statuses[i] === "invalid" && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function SceneGenzioAI() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-lg glass-card rounded-2xl border border-white/10 p-6 flex flex-col gap-4 relative overflow-hidden"
      >
        <motion.div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 via-transparent to-neon-cyan/5 opacity-50" />

        {/* User Message */}
        <div className="flex gap-4 self-end w-3/4 mb-2">
          <div className="bg-white/10 border border-white/20 p-4 rounded-2xl rounded-tr-sm relative z-10 w-full">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-mono text-gray-400">
                invoice_scan.jpg
              </span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="h-[2px] bg-white/20 rounded mb-2"
            />
            <p className="text-xs font-mono text-white">
              Extract data from this attachment.
            </p>
          </div>
        </div>

        {/* AI Response */}
        <div className="flex gap-4 self-start w-[85%] relative z-10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-pink p-[1px] shrink-0 mt-1">
            <div className="w-full h-full rounded-full bg-[#050508] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="bg-neon-cyan/10 border border-neon-cyan/30 p-4 rounded-2xl rounded-tl-sm w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex items-center gap-2 mb-3 text-[10px] font-mono text-neon-cyan uppercase tracking-widest"
            >
              <Zap className="w-3 h-3" /> Processing Vision...
            </motion.div>

            <div className="space-y-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 2.5, duration: 0.5 }}
                className="h-2 bg-white/20 rounded overflow-hidden"
              >
                <div className="w-full h-full bg-neon-cyan/50" />
              </motion.div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80%" }}
                transition={{ delay: 2.7, duration: 0.5 }}
                className="h-2 bg-white/20 rounded overflow-hidden"
              >
                <div className="w-full h-full bg-neon-cyan/50" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5 }}
              className="mt-4 p-3 bg-black/50 rounded-xl border border-white/5 text-xs font-mono text-gray-300"
            >
              <span className="text-green-400">Total:</span> $4,200.00
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SceneCompleted() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050508]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.8 }}
            className="w-24 h-24 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.4)]"
          >
            <CheckCircle2 className="w-12 h-12 text-neon-cyan" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="absolute inset-0 rounded-full border border-neon-cyan"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-2 tracking-wide uppercase">
            Workflow Complete
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function CinematicProductDemo() {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 4500); // Sequence timing
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="w-full max-w-5xl mx-auto my-32 px-4 relative z-10"
      id="cinematic-demo-section"
    >
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-neon-cyan/10 to-neon-pink/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Floating Desktop Monitor Frame */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative aspect-video w-full rounded-2xl md:rounded-[2rem] p-2 md:p-3 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* Inner Screen */}
        <div className="w-full h-full rounded-xl md:rounded-3xl bg-[#050508] relative overflow-hidden border border-black group">
          {/* Top Window Bar (macOS style) */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 z-20 backdrop-blur-md">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            {/* Dynamic URL / Breadcrumb */}
            <div className="mx-auto flex items-center justify-center h-6 rounded-md bg-black/50 border border-white/10 px-4">
              <span className="text-[10px] font-mono text-gray-400 capitalize">
                genzio.app /{" "}
                {scenes[currentScene].toLowerCase().replace("_", " ")}
              </span>
            </div>
            <div className="w-[52px]" /> {/* Spacer for balance */}
          </div>

          {/* Scene Container */}
          <div className="absolute inset-0 pt-10">
            <AnimatePresence mode="wait">
              {currentScene === 0 && (
                <motion.div key="scene0" className="w-full h-full absolute">
                  <SceneLogin />
                </motion.div>
              )}
              {currentScene === 1 && (
                <motion.div key="scene1" className="w-full h-full absolute">
                  <SceneConnectGmail />
                </motion.div>
              )}
              {currentScene === 2 && (
                <motion.div key="scene2" className="w-full h-full absolute">
                  <SceneConnectSheets />
                </motion.div>
              )}
              {currentScene === 3 && (
                <motion.div key="scene3" className="w-full h-full absolute">
                  <SceneEmailAutomation />
                </motion.div>
              )}
              {currentScene === 4 && (
                <motion.div key="scene4" className="w-full h-full absolute">
                  <SceneSmartDelays />
                </motion.div>
              )}
              {currentScene === 5 && (
                <motion.div key="scene5" className="w-full h-full absolute">
                  <SceneAnalytics />
                </motion.div>
              )}
              {currentScene === 6 && (
                <motion.div key="scene6" className="w-full h-full absolute">
                  <SceneEmailVerifier />
                </motion.div>
              )}
              {currentScene === 7 && (
                <motion.div key="scene7" className="w-full h-full absolute">
                  <SceneGenzioAI />
                </motion.div>
              )}
              {currentScene === 8 && (
                <motion.div key="scene8" className="w-full h-full absolute">
                  <SceneCompleted />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar Indicator at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 flex z-20">
            {scenes.map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 transition-colors duration-300 ${i <= currentScene ? "bg-neon-cyan/50" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>

        {/* Base Stand reflection (visual structural bottom) */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-1/3 h-8 bg-gradient-to-t from-white/5 to-transparent blur-xl pointer-events-none" />
      </motion.div>
    </div>
  );
}

import React from "react";
import { ShieldCheck, Zap, ServerOff } from "lucide-react";

const benefits = [
  {
    id: 1,
    value: "100%",
    title: "PRIVATE & SECURE",
    badge: "VERIFIED",
    caption: "Your campaign data stays protected with encrypted workspace logic.",
    icon: <ShieldCheck className="w-8 h-8 text-neon-cyan relative z-10" />,
    color: "cyan",
  },
  {
    id: 2,
    value: "10x",
    title: "FASTER OUTREACH",
    badge: "SMART SPEED",
    caption: "Build, verify and launch outreach workflows faster from one place.",
    icon: <Zap className="w-8 h-8 text-neon-pink relative z-10" />,
    color: "pink",
  },
  {
    id: 3,
    value: "ZERO",
    title: "SERVER LOGS",
    badge: "NO STORAGE",
    caption: "Designed to keep your workspace clean without storing unnecessary logs.",
    icon: <ServerOff className="w-8 h-8 text-purple-400 relative z-10" />,
    color: "purple",
  },
];

export default function PremiumBenefitStrip() {
  return (
    <section className="relative z-20 pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-[#030303]/80 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-4 md:p-8 relative overflow-hidden">
        {/* Subtle diagonal glass reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-white/[0.05] pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="group relative flex flex-col p-8 rounded-3xl bg-[#0a0a0f]/50 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:bg-[#0d0d14]"
              style={{ minHeight: "260px" }}
            >
              {/* Hover dynamic border */}
              <div
                className={`absolute inset-0 rounded-3xl border transition-colors duration-500 opacity-0 group-hover:opacity-100 ${
                  benefit.color === "cyan"
                    ? "border-neon-cyan/50"
                    : benefit.color === "pink"
                    ? "border-neon-pink/50"
                    : "border-purple-500/50"
                } pointer-events-none`}
              ></div>

              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  {/* Icon glow that increases on hover */}
                  <div
                    className={`absolute inset-0 blur-xl transition-all duration-500 opacity-30 group-hover:opacity-80 group-hover:scale-150 ${
                      benefit.color === "cyan"
                        ? "bg-neon-cyan"
                        : benefit.color === "pink"
                        ? "bg-neon-pink"
                        : "bg-purple-500"
                    }`}
                  ></div>
                  {benefit.icon}
                </div>
                <span
                  className={`text-xs font-mono font-bold tracking-wider px-3 py-1 rounded-full border transition-colors duration-500 ${
                    benefit.color === "cyan"
                      ? "text-neon-cyan border-neon-cyan/20 group-hover:border-neon-cyan/50 group-hover:bg-neon-cyan/10"
                      : benefit.color === "pink"
                      ? "text-neon-pink border-neon-pink/20 group-hover:border-neon-pink/50 group-hover:bg-neon-pink/10"
                      : "text-purple-400 border-purple-500/20 group-hover:border-purple-500/50 group-hover:bg-purple-500/10"
                  }`}
                >
                  {benefit.badge}
                </span>
              </div>

              <div className="mt-auto relative">
                <div className="transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight mb-2">
                    {benefit.value}
                  </h3>
                  <p className="text-sm font-bold text-gray-300 tracking-widest uppercase">
                    {benefit.title}
                  </p>
                </div>

                {/* Caption expanding via transform and opacity */}
                <div className="absolute bottom-0 left-0 right-0 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {benefit.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

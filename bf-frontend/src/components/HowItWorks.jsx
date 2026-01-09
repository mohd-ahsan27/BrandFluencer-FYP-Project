import React from "react";
import { FaUserPlus, FaHandshake, FaRocket } from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    { Icon: FaUserPlus, title: "Sign Up", desc: "Create your account as a brand or creator and set up your profile in minutes.", grad: "from-teal-300 to-sky-300" },
    { Icon: FaHandshake, title: "Connect", desc: "Find the perfect match based on niche, audience fit, and campaign goals.", grad: "from-sky-300 to-fuchsia-300" },
    { Icon: FaRocket, title: "Collaborate", desc: "Launch campaigns, communicate smoothly, and track performance in one place.", grad: "from-fuchsia-300 to-pink-300" },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-20 overflow-hidden text-center
                 bg-gradient-to-b from-black via-slate-900 to-slate-950"
    >
      <div className="absolute -top-10 left-1/4 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-fuchsia-300">
            How It Works
          </span>
        </h2>
        <p className="text-white/70 mb-12 max-w-2xl mx-auto px-6">
          A simple flow: join → match → collaborate → measure results.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8
                         shadow-[0_18px_70px_-50px_rgba(0,0,0,0.85)]
                         hover:-translate-y-2 hover:bg-white/8 transition-all duration-500"
            >
              <div className="flex items-center justify-center mb-6">
                <div
                  className={`h-16 w-16 rounded-3xl grid place-items-center bg-gradient-to-br ${s.grad}
                              group-hover:scale-110 transition-transform duration-300`}
                >
                  <s.Icon className="text-3xl text-slate-900" />
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-white mb-3">{s.title}</h3>
              <p className="text-white/70 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <div className="w-28 h-1 bg-gradient-to-r from-teal-300 to-fuchsia-300 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
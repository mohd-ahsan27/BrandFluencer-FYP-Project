import React from "react";
import { motion } from "framer-motion";

// About.jsx in src/components => correct:
import marketingImg2 from "../assets/M_image2.png";

const About = () => {
  return (
    <section
      id="about"
      className="relative py-20 overflow-hidden
                 bg-gradient-to-b from-[#05070f] via-slate-950 to-[#070a12]"
    >
      {/* New glow shades (cleaner + less “same same”) */}
      <div className="absolute top-[-60px] left-[-60px] w-96 h-96 bg-cyan-400/12 rounded-full blur-3xl" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[30rem] h-[30rem] bg-rose-400/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl" />

      {/* Softer overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.12),transparent_48%),radial-gradient(circle_at_85%_78%,rgba(251,113,133,0.10),transparent_50%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-teal-200 to-rose-300">
              About Our Platform
            </span>
          </h2>

          <p className="text-slate-200/90 leading-relaxed text-lg mb-4">
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-cyan-200">
              Brand Fluencer
            </span>{" "}
            bridges the gap between brands and influencers by providing a smart,
            intuitive, and transparent platform that fosters{" "}
            <span className="text-teal-200 font-semibold">genuine collaborations.</span>
          </p>

          <p className="text-slate-300/90 leading-relaxed text-base">
            Whether you’re an influencer seeking growth opportunities or a brand aiming to
            reach the right audience, our system ensures effortless partnerships,
            secure payments, and measurable campaign success — all in one place.
          </p>

          <a
            href="#features"
            className="inline-flex items-center justify-center mt-8 px-8 py-3 rounded-full font-semibold transition-all duration-300
                       bg-gradient-to-r from-cyan-200 via-teal-300 to-rose-300 text-slate-900
                       hover:brightness-110 hover:-translate-y-1 hover:shadow-xl"
          >
            Explore Features
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          {/* Updated ring colors */}
          <div className="rounded-[28px] p-[1px] bg-gradient-to-r from-cyan-400/45 via-teal-300/25 to-rose-400/40 shadow-[0_22px_90px_-55px_rgba(0,0,0,0.95)]">
            <div className="rounded-[27px] bg-slate-950/35 border border-white/10 backdrop-blur-xl p-2">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl">
                <img
                  src={marketingImg2}
                  alt="About Brand Fluencer"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="lazy"
                  draggable={false}
                />
                {/* Cooler overlay so it stays crisp */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
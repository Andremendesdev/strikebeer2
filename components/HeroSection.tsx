"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

/* ─── animation helpers ─────────────────────────────────── */
const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" as const, delay },
  }),
};

/* ─── decorative SVG bolt ───────────────────────────────── */
function LightningBolt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M28 2L4 44H22L20 78L44 36H26L28 2Z"
        fill="var(--neon)"
        stroke="var(--neon)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── floating particle ─────────────────────────────────── */
function Spark({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.7, 0],
        scale: [0, 1, 0],
        y: [0, -40],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4 + 2,
        ease: "easeOut",
      }}
    >
      <div
        className="w-1 h-1 rounded-full"
        style={{
          background: "var(--neon)",
          boxShadow: "0 0 6px 2px rgba(234,179,8,0.6)",
        }}
      />
    </motion.div>
  );
}

/* ─── stat item ─────────────────────────────────────────── */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className="text-3xl md:text-4xl font-black tracking-tight leading-none"
        style={{
          fontFamily: "var(--font-bebas)",
          color: "var(--neon)",
        }}
      >
        {value}
      </span>
      <span className="text-xs uppercase tracking-[0.15em] text-zinc-400 font-medium">
        {label}
      </span>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────── */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const bgY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const sparks = [
    { x: 12, y: 20, delay: 0 },
    { x: 78, y: 15, delay: 0.8 },
    { x: 35, y: 70, delay: 1.4 },
    { x: 88, y: 60, delay: 2.1 },
    { x: 55, y: 30, delay: 0.4 },
    { x: 22, y: 55, delay: 1.8 },
    { x: 67, y: 80, delay: 0.6 },
    { x: 44, y: 88, delay: 2.6 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: "#09090b" }}
    >
      {/* ── background layers ───────────────────────────────── */}

      {/* mobile bg: fundohero1.jpg — visível apenas em mobile */}
      <div
        className="absolute inset-0 md:hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <Image
          src="/fundohero1.jpg"
          alt=""
          fill
          priority
          quality={85}
          className="object-cover object-center"
          style={{ filter: "grayscale(1)", opacity: 0.28 }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(9,9,11,0.55) 0%, rgba(9,9,11,0.3) 40%, rgba(9,9,11,0.55) 80%, #09090b 100%)",
          }}
        />
      </div>

      {/* desktop bg: fundohero.jpg — visível apenas em md+ */}
      <div
        className="absolute inset-0 hidden md:block pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <Image
          src="/fundohero.jpg"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover object-center"
          style={{ filter: "grayscale(1)", opacity: 0.28 }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.5) 50%, rgba(9,9,11,0.65) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(9,9,11,0.4) 0%, transparent 20%, transparent 75%, #09090b 100%)",
          }}
        />
      </div>

      {/* ambient orb left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "-15%",
          top: "10%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(234,179,8,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* ambient orb right */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          bottom: "5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* diagonal slash accent */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ y: bgY }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <div
          style={{
            position: "absolute",
            right: "8%",
            top: "-5%",
            width: "3px",
            height: "110vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(234,179,8,0.5) 30%, rgba(234,179,8,0.8) 50%, rgba(234,179,8,0.5) 70%, transparent)",
            transform: "rotate(12deg)",
            transformOrigin: "top center",
            filter: "blur(1px)",
            boxShadow: "0 0 20px rgba(234,179,8,0.3)",
          }}
        />
      </motion.div>

      {/* second line */}
      <motion.div
        className="absolute pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      >
        <div
          style={{
            position: "absolute",
            right: "12%",
            top: "-5%",
            width: "1px",
            height: "110vh",
            background:
              "linear-gradient(to bottom, transparent, rgba(234,179,8,0.2) 40%, rgba(234,179,8,0.3) 55%, transparent)",
            transform: "rotate(12deg)",
            transformOrigin: "top center",
          }}
        />
      </motion.div>

      {/* grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
        }}
      />

      {/* sparks */}
      <div className="absolute inset-0 pointer-events-none">
        {sparks.map((s, i) => (
          <Spark key={i} {...s} />
        ))}
      </div>

      {/* ── main content ─────────────────────────────────────── */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-32 pb-24"
      >
        {/* eyebrow label */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          custom={0.2}
          className="flex items-center gap-3 mb-6"
        >
          <span className="block h-px w-10" style={{ background: "var(--neon)" }} />
          <span
            className="text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ color: "var(--neon)" }}
          >
            O templo do rock & do burger bruto em Piraju
          </span>
        </motion.div>

        {/* headline */}
        <div className="relative">
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
            className="leading-[0.88] uppercase font-black"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4.5rem, 16vw, 14rem)",
              color: "#ffffff",
              letterSpacing: "0.02em",
            }}
          >
            Strike
          </motion.h1>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.48}
            className="leading-[0.88] uppercase font-black relative"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4.5rem, 16vw, 14rem)",
              color: "var(--neon)",
              letterSpacing: "0.02em",
              textShadow:
                "0 0 40px rgba(234,179,8,0.5), 0 0 80px rgba(234,179,8,0.2)",
            }}
          >
            Beer
            {/* decorative bolt inline */}
            <motion.span
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.9,
                type: "spring",
                stiffness: 200,
              }}
              className="inline-block ml-4 align-middle"
            >
              <LightningBolt className="w-12 h-20 md:w-20 md:h-32 inline-block" />
            </motion.span>
          </motion.h1>
        </div>

        {/* descriptor + CTA row */}
        <div className="mt-10 flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.6}
            className="max-w-md"
          >
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "#a1a1aa" }}
            >
              A melhor experiência de rock bar e hamburguers da cidade. Cerveja
              gelada, Rock ao vivo e sabores que ficam na memória.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.72}
            className="flex flex-col sm:flex-row gap-4 shrink-0"
          >
            <motion.a
              href="#"
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 30px rgba(234,179,8,0.5)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em] transition-colors duration-300"
              style={{
                background: "var(--neon)",
                color: "#000",
                boxShadow: "0 0 20px rgba(234,179,8,0.3)",
              }}
            >
              <LightningBolt className="w-3 h-5" />
              Ver Cardápio
            </motion.a>

            <motion.a
              href="#eventos"
              whileHover={{
                scale: 1.04,
                borderColor: "rgba(234,179,8,0.6)",
                color: "var(--neon)",
              }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em] border text-white transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255,255,255,0.12)",
              }}
            >
              Ver Shows
            </motion.a>
          </motion.div>
        </div>

        {/* ── stats bar ──────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.85}
          className="mt-16 md:mt-20"
        >
          <div
            className="inline-flex items-center gap-8 md:gap-12 px-8 py-5 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 0 0 1px rgba(234,179,8,0.05) inset",
            }}
          >
            <StatItem value="8+" label="Anos de história" />
            <div className="w-px h-10 bg-zinc-800" />
            <StatItem value="🤘" label="Hamburguer e Rock ao vivo" />
            <div className="w-px h-10 bg-zinc-800 hidden sm:block" />
            <StatItem value="4.9★" label="Avaliação média" />
          </div>
        </motion.div>
      </motion.div>

      {/* ── scroll cue ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8"
          style={{
            background:
              "linear-gradient(to bottom, rgba(234,179,8,0.6), transparent)",
          }}
        />
      </motion.div>

      {/* ── bottom edge gradient ─────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(9,9,11,0.9) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}

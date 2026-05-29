"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ─── data ───────────────────────────────────────────────── */
const events = [
  {
    id: 1,
    band: "Dead Signal",
    genre: "Heavy Metal",
    day: "06",
    month: "JUN",
    weekday: "Sáb",
    time: "22:00",
    price: 40,
    description: "Thrash e groove metal pesado. Riffs brutais, energia total e uma noite inesquecível no palco principal.",
  },
  {
    id: 2,
    band: "Neon Wolves",
    genre: "Rock Alternativo",
    day: "13",
    month: "JUN",
    weekday: "Sáb",
    time: "21:30",
    price: 30,
    description: "Rock alternativo com influências dos anos 90 e eletrônico moderno. Atmosfera única, sons que grudam.",
  },
  {
    id: 3,
    band: "Blackout Trio",
    genre: "Blues Rock",
    day: "20",
    month: "JUN",
    weekday: "Sáb",
    time: "21:00",
    price: 25,
    description: "Blues rock raiz com solos que vão arrepiar do início ao fim. Três músicos, muita alma.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── event card ─────────────────────────────────────────── */
function EventCard({ event, index }: { event: typeof events[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.1 }}
      whileHover={{
        y: -4,
        borderColor: "rgba(234,179,8,0.2)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(234,179,8,0.1)",
      }}
      className="group relative flex gap-5 p-6 rounded-2xl transition-all duration-300"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      {/* data */}
      <div
        className="flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-xl"
        style={{
          background: "rgba(234,179,8,0.07)",
          border: "1px solid rgba(234,179,8,0.15)",
        }}
      >
        <span
          className="text-2xl leading-none font-black"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--neon)" }}
        >
          {event.day}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-zinc-500 mt-0.5">
          {event.month}
        </span>
      </div>

      {/* conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
          <h3
            className="text-white uppercase leading-none"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1.45rem", letterSpacing: "0.04em" }}
          >
            {event.band}
          </h3>
          <span className="text-[10px] text-zinc-600 uppercase tracking-[0.12em]">
            {event.genre}
          </span>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
            {event.weekday} · {event.time}h
          </span>
          <span
            className="text-[11px] font-semibold"
            style={{ color: "var(--neon)" }}
          >
            R$ {event.price.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* cta */}
      <motion.a
        href="#"
        whileTap={{ scale: 0.93 }}
        onClick={(e) => e.stopPropagation()}
        className="self-center shrink-0 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex"
        style={{
          background: "var(--neon)",
          color: "#000",
          boxShadow: "0 0 14px rgba(234,179,8,0.25)",
        }}
      >
        Ingressos
      </motion.a>
    </motion.div>
  );
}

/* ─── section ────────────────────────────────────────────── */
export function EventSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: "#09090b" }}
      id="eventos"
    >
      {/* separador */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(234,179,8,0.2) 30%, rgba(234,179,8,0.35) 50%, rgba(234,179,8,0.2) 70%, transparent)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* header */}
        <div ref={headerRef} className="mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="block h-px w-10" style={{ background: "var(--neon)" }} />
            <span className="text-xs uppercase tracking-[0.3em] font-semibold" style={{ color: "var(--neon)" }}>
              Agenda — Shows ao Vivo
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
          >
            <h2
              className="uppercase leading-none text-white"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(3rem, 8vw, 6rem)",
                letterSpacing: "0.02em",
              }}
            >
              Shows{" "}
              <span style={{ color: "var(--neon)", textShadow: "0 0 28px rgba(234,179,8,0.35)" }}>
                ao Vivo
              </span>
            </h2>

            <motion.a
              href="#"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.35 }}
              whileHover={{ color: "var(--neon)" }}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600 transition-colors duration-300 pb-2"
            >
              Ver agenda completa
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </motion.div>
        </div>

        {/* cards */}
        <div className="flex flex-col gap-4">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>

      {/* separador inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.05) 60%, transparent)",
        }}
      />
    </section>
  );
}

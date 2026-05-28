"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

/* ─── types ─────────────────────────────────────────────── */
type BeerStyle = "IPA" | "Stout" | "Lager" | "Weiss" | "Sour" | "Porter";

interface Beer {
  id: number;
  name: string;
  brewery: string;
  style: BeerStyle;
  abv: number;
  ibu?: number;
  description: string;
  price: number;
  volume: string;
  origin: string;
  badge?: string;
  imageUrl: string;
  category: string;
  color: string;
}

/* ─── data ───────────────────────────────────────────────── */
const beers: Beer[] = [
  {
    id: 1,
    name: "Northern Thunder",
    brewery: "Dogfish Head",
    style: "IPA",
    abv: 7.2,
    ibu: 65,
    description:
      "IPA americana com aroma cítrico intenso, notas de pinho e maracujá. Amargor equilibrado com final seco e refrescante.",
    price: 28.9,
    volume: "473ml",
    origin: "EUA",
    badge: "Destaque",
    imageUrl:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&q=85&auto=format&fit=crop",
    category: "ipa",
    color: "#d97706",
  },
  {
    id: 2,
    name: "Midnight Ritual",
    brewery: "Founders Brewing",
    style: "Stout",
    abv: 10.5,
    ibu: 70,
    description:
      "Imperial stout com chocolate amargo, café espresso e toques de baunilha. Corpo denso, cremoso e absolutamente memorável.",
    price: 34.9,
    volume: "355ml",
    origin: "EUA",
    badge: "Premium",
    imageUrl:
      "https://images.unsplash.com/photo-1518176258769-f227c798150e?w=500&q=85&auto=format&fit=crop",
    category: "dark",
    color: "#1c1917",
  },
  {
    id: 3,
    name: "Strike Lager",
    brewery: "Strike Beer Co.",
    style: "Lager",
    abv: 4.8,
    ibu: 18,
    description:
      "Lager artesanal da casa. Leve, cristalina e extremamente refrescante. A escolha perfeita para qualquer momento.",
    price: 18.9,
    volume: "600ml",
    origin: "Brasil",
    badge: "Da Casa",
    imageUrl:
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=500&q=85&auto=format&fit=crop",
    category: "lager",
    color: "#ca8a04",
  },
  {
    id: 4,
    name: "Weiss Engel",
    brewery: "Paulaner",
    style: "Weiss",
    abv: 5.5,
    ibu: 14,
    description:
      "Weissbier bávara com banana, cravo e leve acidez cítrica. Espuma densa, cor turva dourada. Tradição alemã pura.",
    price: 24.9,
    volume: "500ml",
    origin: "Alemanha",
    imageUrl:
      "https://images.unsplash.com/photo-1504474298956-2a944be359de?w=500&q=85&auto=format&fit=crop",
    category: "weiss",
    color: "#a16207",
  },
  {
    id: 5,
    name: "Acid Rain",
    brewery: "Jester King",
    style: "Sour",
    abv: 5.1,
    ibu: 10,
    description:
      "Sour ale fermentada com frutas vermelhas silvestres. Acidez vibrante, leveza refrescante e um final com notas de framboesa.",
    price: 32.9,
    volume: "375ml",
    origin: "EUA",
    badge: "Edição Limitada",
    imageUrl:
      "https://images.unsplash.com/photo-1571613316887-6f8d5cbef406?w=500&q=85&auto=format&fit=crop",
    category: "sour",
    color: "#be123c",
  },
  {
    id: 6,
    name: "Black Rebel",
    brewery: "Anchorage Brewing",
    style: "Porter",
    abv: 6.8,
    ibu: 35,
    description:
      "Robust Porter com toffee, caramelo torrado e leve defumação. Suave no palato, complexo no pós-gosto. Rock n' Roll em forma de cerveja.",
    price: 26.9,
    volume: "473ml",
    origin: "EUA",
    imageUrl:
      "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=500&q=85&auto=format&fit=crop",
    category: "dark",
    color: "#292524",
  },
];

const categories = [
  { id: "todas", label: "Todas" },
  { id: "ipa", label: "IPA" },
  { id: "lager", label: "Lager" },
  { id: "dark", label: "Dark" },
  { id: "weiss", label: "Weiss" },
  { id: "sour", label: "Sour" },
];

const styleColors: Record<BeerStyle, { bg: string; text: string }> = {
  IPA:    { bg: "rgba(217,119,6,0.15)",  text: "#fbbf24" },
  Stout:  { bg: "rgba(28,25,23,0.6)",    text: "#a8a29e" },
  Lager:  { bg: "rgba(202,138,4,0.15)",  text: "#facc15" },
  Weiss:  { bg: "rgba(161,98,7,0.15)",   text: "#fde68a" },
  Sour:   { bg: "rgba(190,18,60,0.15)",  text: "#fb7185" },
  Porter: { bg: "rgba(41,37,36,0.6)",    text: "#d6d3d1" },
};

/* ─── abv dots ───────────────────────────────────────────── */
function AbvDots({ abv }: { abv: number }) {
  const filled = Math.min(Math.round(abv / 2), 5);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="block rounded-full transition-all duration-300"
          style={{
            width: i < filled ? "8px" : "5px",
            height: i < filled ? "8px" : "5px",
            background: i < filled ? "#facc15" : "rgba(255,255,255,0.12)",
            boxShadow: i < filled ? "0 0 6px rgba(250,204,21,0.5)" : "none",
          }}
        />
      ))}
      <span className="ml-1 text-[10px] font-bold text-zinc-500">{abv}%</span>
    </div>
  );
}

/* ─── beer card ──────────────────────────────────────────── */
function BeerCard({ beer, index }: { beer: Beer; index: number }) {
  const { addBeer } = useCart();
  const [added, setAdded] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const styleColor = styleColors[beer.style];

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addBeer({
      id: beer.id,
      name: beer.name,
      price: beer.price,
      meta: `${beer.brewery} · ${beer.volume}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30, scale: 0.96 }}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        delay: index * 0.07,
      }}
      className="relative group cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setFlipped((v) => !v)}
    >
      <motion.div
        className="relative w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        style={{ transformStyle: "preserve-3d", minHeight: "420px" }}
      >
        {/* ── frente ─────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "#111113",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* imagem */}
          <div className="relative h-52 overflow-hidden bg-zinc-900 shrink-0">
            <Image
              src={beer.imageUrl}
              alt={beer.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, #111113 0%, rgba(17,17,19,0.3) 50%, transparent 100%)`,
              }}
            />

            {/* badge */}
            {beer.badge && (
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ background: "#facc15", color: "#000" }}
              >
                {beer.badge}
              </div>
            )}

            {/* flip hint */}
            <div
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[0.1em] font-semibold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Ver detalhes
            </div>
          </div>

          {/* conteúdo */}
          <div className="flex flex-col flex-1 p-5 gap-3">
            {/* estilo pill */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                style={{ background: styleColor.bg, color: styleColor.text }}
              >
                {beer.style}
              </span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-[0.1em]">
                {beer.origin}
              </span>
            </div>

            {/* nome + brewery */}
            <div>
              <h3
                className="text-xl leading-none text-white uppercase"
                style={{ fontFamily: "var(--font-bebas)", fontSize: "1.5rem", letterSpacing: "0.04em" }}
              >
                {beer.name}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5 uppercase tracking-[0.1em]">
                {beer.brewery}
              </p>
            </div>

            {/* abv */}
            <AbvDots abv={beer.abv} />

            {/* divider */}
            <div className="h-px bg-zinc-800 mt-auto" />

            {/* preço + volume + cta */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-600 uppercase tracking-[0.1em]">
                  {beer.volume}
                </span>
                <span
                  className="text-2xl font-black leading-none"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    color: "#facc15",
                    textShadow: "0 0 16px rgba(250,204,21,0.3)",
                  }}
                >
                  R$ {beer.price.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250,204,21,0.4)" }}
                onClick={handleAdd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-colors duration-300"
                style={
                  added
                    ? { background: "#22c55e", color: "#fff", boxShadow: "0 0 16px rgba(34,197,94,0.35)" }
                    : { background: "#facc15", color: "#000", boxShadow: "0 0 12px rgba(250,204,21,0.2)" }
                }
              >
                {added ? "Adicionado" : "Pedir"}
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── verso (detalhes) ────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col rounded-2xl p-6 gap-5"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "#111113",
            border: "1px solid rgba(250,204,21,0.15)",
            boxShadow: "0 0 40px rgba(250,204,21,0.08), 0 4px 24px rgba(0,0,0,0.45)",
          }}
        >
          {/* topo verso */}
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="text-3xl leading-none text-white uppercase"
                style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
              >
                {beer.name}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1 uppercase tracking-[0.12em]">
                {beer.brewery} · {beer.origin}
              </p>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full shrink-0 mt-1"
              style={{ background: styleColor.bg, color: styleColor.text }}
            >
              {beer.style}
            </span>
          </div>

          {/* descrição */}
          <p className="text-sm leading-relaxed text-zinc-400 flex-1">
            {beer.description}
          </p>

          {/* specs grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "ABV", value: `${beer.abv}%` },
              { label: "IBU", value: beer.ibu ? `${beer.ibu}` : "—" },
              { label: "Volume", value: beer.volume },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center py-3 rounded-xl gap-1"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="text-xl font-black leading-none"
                  style={{ fontFamily: "var(--font-bebas)", color: "#facc15" }}
                >
                  {value}
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* abv dots */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              Teor alcoólico
            </span>
            <AbvDots abv={beer.abv} />
          </div>

          {/* verso CTA */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(250,204,21,0.45)" }}
              onClick={handleAdd}
              className="flex-1 py-3 rounded-full text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-300"
              style={
                added
                  ? { background: "#22c55e", color: "#fff", boxShadow: "0 0 16px rgba(34,197,94,0.35)" }
                  : { background: "#facc15", color: "#000", boxShadow: "0 0 14px rgba(250,204,21,0.25)" }
              }
            >
              {added ? "Adicionado" : "Adicionar ao Pedido"}
            </motion.button>
            <button
              onClick={(e) => { e.stopPropagation(); setFlipped(false); }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              aria-label="Voltar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

/* ─── section ────────────────────────────────────────────── */
export function BeersSection() {
  const [activeCategory, setActiveCategory] = useState("todas");
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  const filtered =
    activeCategory === "todas"
      ? beers
      : beers.filter((b) => b.category === activeCategory);

  return (
    <section
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: "#09090b" }}
      id="cervejas"
    >
      {/* orb de luz de fundo */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          top: "20%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(250,204,21,0.04) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── header ───────────────────────────────────────── */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="flex items-center gap-3 mb-5"
          >
            <span className="block h-px w-10" style={{ background: "#facc15" }} />
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold"
              style={{ color: "#facc15" }}
            >
              Cardápio — Cervejas
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 }}
            >
              <h2
                className="uppercase leading-none text-white"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  letterSpacing: "0.02em",
                }}
              >
                Cervejas
                <br />
                <span
                  style={{
                    color: "#facc15",
                    textShadow: "0 0 30px rgba(250,204,21,0.35)",
                  }}
                >
                  Artesanais
                </span>
              </h2>
              <p className="mt-3 text-sm text-zinc-500 max-w-sm">
                Mais de 200 rótulos selecionados. Clique no card para ver todos os detalhes.
              </p>
            </motion.div>

            {/* filtros */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.22 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <motion.button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    whileTap={{ scale: 0.93 }}
                    className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300"
                    style={
                      isActive
                        ? { background: "#facc15", color: "#000", boxShadow: "0 0 16px rgba(250,204,21,0.3)" }
                        : { background: "rgba(255,255,255,0.05)", color: "#71717a", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {cat.label}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── grid ─────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((beer, i) => (
              <BeerCard key={beer.id} beer={beer} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── ver carta completa ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mt-14 flex justify-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.04, borderColor: "rgba(250,204,21,0.5)", color: "#facc15" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em] border text-zinc-400 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            Ver Carta Completa de Cervejas
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

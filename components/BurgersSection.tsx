"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

/* ─── types ─────────────────────────────────────────────── */
type Badge = "Mais Pedido" | "Novo" | "Chef's Pick" | "Vegano" | "Limitado";

interface Burger {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: Badge;
  category: string;
  tags: string[];
  imageUrl: string;
  calories: number;
}

/* ─── data ───────────────────────────────────────────────── */
const burgers: Burger[] = [
  {
    id: 1,
    name: "Strike Smash",
    description:
      "Dois smash patties de angus, queijo americano duplo, molho especial da casa, pickles crocantes e cebola caramelizada.",
    price: 42.9,
    rating: 4.9,
    reviews: 312,
    badge: "Mais Pedido",
    category: "classicos",
    tags: ["Angus", "Smash", "Duplo"],
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=85&auto=format&fit=crop",
    calories: 820,
  },
  {
    id: 2,
    name: "Rock'n Bacon",
    description:
      "Blend de costela bovina, bacon crocante defumado, cheddar inglês, alface roxa, tomate confit e aioli de alho negro.",
    price: 48.9,
    oldPrice: 54.9,
    rating: 4.8,
    reviews: 198,
    badge: "Chef's Pick",
    category: "premium",
    tags: ["Costela", "Bacon", "Cheddar"],
    imageUrl:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=85&auto=format&fit=crop",
    calories: 960,
  },
  {
    id: 3,
    name: "Thunder Beast",
    description:
      "Blend wagyu 180g, queijo gruyère fundido, cogumelos salteados na manteiga, rúcula selvagem e molho de trufas.",
    price: 64.9,
    rating: 4.9,
    reviews: 87,
    badge: "Limitado",
    category: "premium",
    tags: ["Wagyu", "Trufas", "Gruyère"],
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=85&auto=format&fit=crop",
    calories: 1050,
  },
  {
    id: 4,
    name: "Neon Crispy",
    description:
      "Frango empanado artesanal, jalapeños em conserva, coleslaw cremoso, cheddar derretido e molho ranch defumado.",
    price: 38.9,
    rating: 4.7,
    reviews: 245,
    badge: "Novo",
    category: "especiais",
    tags: ["Frango", "Crispy", "Picante"],
    imageUrl:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=85&auto=format&fit=crop",
    calories: 780,
  },
  {
    id: 5,
    name: "Black Label",
    description:
      "Costela bovina low & slow 12h, queijo brie gratinado, cebola roxa marinada, mostarda dijon e pão brioche artesanal.",
    price: 56.9,
    rating: 4.8,
    reviews: 134,
    category: "premium",
    tags: ["Costela", "Slow Cook", "Brie"],
    imageUrl:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&q=85&auto=format&fit=crop",
    calories: 1100,
  },
  {
    id: 6,
    name: "Green Machine",
    description:
      "Blend de grão-de-bico e cogumelos, queijo vegano de castanha, guacamole fresco, tomate e alface crocante.",
    price: 36.9,
    rating: 4.6,
    reviews: 89,
    badge: "Vegano",
    category: "veganos",
    tags: ["Plant-based", "Vegano", "Saudável"],
    imageUrl:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&q=85&auto=format&fit=crop",
    calories: 580,
  },
];

const categories = [
  { id: "todos", label: "Todos" },
  { id: "classicos", label: "Clássicos" },
  { id: "premium", label: "Premium" },
  { id: "especiais", label: "Especiais" },
  { id: "veganos", label: "Veganos" },
];

const badgeColors: Record<Badge, { bg: string; text: string }> = {
  "Mais Pedido": { bg: "#facc15", text: "#000" },
  "Novo": { bg: "#3b82f6", text: "#fff" },
  "Chef's Pick": { bg: "#f97316", text: "#fff" },
  "Vegano": { bg: "#22c55e", text: "#fff" },
  "Limitado": { bg: "#ef4444", text: "#fff" },
};

/* ─── star rating ───────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className="w-3 h-3"
          viewBox="0 0 12 12"
          fill={i <= Math.round(rating) ? "#facc15" : "rgba(255,255,255,0.15)"}
        >
          <path d="M6 1l1.24 3.82H11L7.88 7.08l1.24 3.82L6 8.64l-3.12 2.26L4.12 7.08 1 4.82h3.76z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── burger card ────────────────────────────────────────── */
function BurgerCard({ burger, index }: { burger: Burger; index: number }) {
  const { addBurger } = useCart();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAdd = () => {
    addBurger({ id: burger.id, name: burger.name, price: burger.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const badgeStyle = burger.badge ? badgeColors[burger.badge] : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.07,
      }}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
      whileHover={{
        y: -6,
        boxShadow:
          "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(250,204,21,0.12)",
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {/* image */}
      <div className="relative h-52 overflow-hidden bg-zinc-900">
        <Image
          src={burger.imageUrl}
          alt={burger.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* image overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(17,17,19,0.9) 0%, rgba(17,17,19,0.2) 50%, transparent 100%)",
          }}
        />

        {/* badge */}
        {badgeStyle && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
            style={{ background: badgeStyle.bg, color: badgeStyle.text }}
          >
            {burger.badge}
          </div>
        )}

        {/* like button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          whileTap={{ scale: 0.85 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          aria-label="Favoritar"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={liked ? "#facc15" : "none"}
            stroke={liked ? "#facc15" : "rgba(255,255,255,0.6)"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.button>

        {/* calories pill */}
        <div
          className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] text-zinc-400 font-medium"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {burger.calories} kcal
        </div>
      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* tags */}
        <div className="flex flex-wrap gap-1.5">
          {burger.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-[0.1em] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(250,204,21,0.07)",
                color: "rgba(250,204,21,0.7)",
                border: "1px solid rgba(250,204,21,0.12)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* name */}
        <h3
          className="text-xl font-black uppercase tracking-tight leading-none text-white"
          style={{ fontFamily: "var(--font-bebas)", fontSize: "1.5rem" }}
        >
          {burger.name}
        </h3>

        {/* description */}
        <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2 flex-1">
          {burger.description}
        </p>

        {/* rating */}
        <div className="flex items-center gap-2">
          <Stars rating={burger.rating} />
          <span className="text-xs font-semibold text-zinc-300">
            {burger.rating.toFixed(1)}
          </span>
          <span className="text-xs text-zinc-600">({burger.reviews})</span>
        </div>

        {/* divider */}
        <div className="h-px bg-zinc-800" />

        {/* price + cta */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            {burger.oldPrice && (
              <span className="text-xs text-zinc-600 line-through">
                R$ {burger.oldPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
            <span
              className="text-2xl font-black leading-none"
              style={{
                fontFamily: "var(--font-bebas)",
                color: "#facc15",
                textShadow: "0 0 16px rgba(250,204,21,0.3)",
              }}
            >
              R$ {burger.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.93 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 shrink-0"
            style={
              added
                ? {
                    background: "#22c55e",
                    color: "#fff",
                    boxShadow: "0 0 20px rgba(34,197,94,0.4)",
                  }
                : {
                    background: "#facc15",
                    color: "#000",
                    boxShadow: "0 0 16px rgba(250,204,21,0.2)",
                  }
            }
            animate={added ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.25 }}
          >
            {added ? (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Adicionado
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                Adicionar
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── section ────────────────────────────────────────────── */
export function BurgersSection() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  const filtered =
    activeCategory === "todos"
      ? burgers
      : burgers.filter((b) => b.category === activeCategory);

  return (
    <section
      className="relative w-full py-24 md:py-32 overflow-hidden"
      style={{ background: "#09090b" }}
      id="cardapio"
    >
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(250,204,21,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* ── header ───────────────────────────────────────── */}
        <div ref={headerRef} className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-5"
          >
            <span
              className="block h-px w-10"
              style={{ background: "#facc15" }}
            />
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold"
              style={{ color: "#facc15" }}
            >
              Cardápio — Burgers
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <h2
                className="uppercase leading-none text-white"
                style={{
                  fontFamily: "var(--font-bebas)",
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  letterSpacing: "0.02em",
                }}
              >
                Burgers
                <br />
                <span
                  style={{
                    color: "#facc15",
                    textShadow: "0 0 30px rgba(250,204,21,0.4)",
                  }}
                >
                  Gourmet
                </span>
              </h2>
              <p className="mt-3 text-sm text-zinc-500 max-w-sm">
                Ingredientes selecionados, receitas exclusivas, experiência
                gastronômica de outro nível.
              </p>
            </motion.div>

            {/* category pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
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
                        ? {
                            background: "#facc15",
                            color: "#000",
                            boxShadow: "0 0 16px rgba(250,204,21,0.3)",
                          }
                        : {
                            background: "rgba(255,255,255,0.05)",
                            color: "#71717a",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }
                    }
                    animate={
                      isActive
                        ? { scale: 1 }
                        : { scale: 1 }
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
            {filtered.map((burger, i) => (
              <BurgerCard key={burger.id} burger={burger} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── ver cardápio completo ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex justify-center"
        >
          <motion.a
            href="#"
            whileHover={{
              scale: 1.04,
              borderColor: "rgba(250,204,21,0.5)",
              color: "#facc15",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-[0.12em] border text-zinc-400 transition-all duration-300"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            Ver Cardápio Completo
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

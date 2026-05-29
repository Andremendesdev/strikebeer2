"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

/* ─── labels de categoria (slug do banco → rótulo amigável) ─ */
const CATEGORY_LABELS: Record<string, string> = {
  classico: "Clássicos",
  premium: "Premium",
  especial: "Especiais",
  vegano: "Veganos",
};

function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

/* ─── burger card ────────────────────────────────────────── */
function BurgerCard({ burger, index }: { burger: Product; index: number }) {
  const { addBurger } = useCart();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleAdd = () => {
    addBurger({ id: burger.id, name: burger.name, price: burger.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

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
          "0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(234,179,8,0.12)",
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {/* image */}
      <div className="relative h-52 overflow-hidden bg-zinc-900">
        {burger.imageUrl ? (
          <Image
            src={burger.imageUrl}
            alt={burger.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-zinc-800 text-zinc-600">
            <span className="text-xs uppercase tracking-[0.2em]">Sem imagem</span>
          </div>
        )}

        {/* image overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(17,17,19,0.9) 0%, rgba(17,17,19,0.2) 50%, transparent 100%)",
          }}
        />

        {/* category badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]"
          style={{ background: "var(--neon)", color: "#000" }}
        >
          {categoryLabel(burger.category)}
        </div>

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
            fill={liked ? "var(--neon)" : "none"}
            stroke={liked ? "var(--neon)" : "rgba(255,255,255,0.6)"}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </motion.button>

      </div>

      {/* content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
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

        {/* divider */}
        <div className="h-px bg-zinc-800" />

        {/* price + cta */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span
              className="text-2xl font-black leading-none"
              style={{
                fontFamily: "var(--font-bebas)",
                color: "var(--neon)",
                textShadow: "0 0 16px rgba(234,179,8,0.3)",
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
                    background: "var(--neon)",
                    color: "#000",
                    boxShadow: "0 0 16px rgba(234,179,8,0.2)",
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
export function BurgersSection({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headerRef, { once: true, margin: "-80px" });

  /* categorias geradas dinamicamente a partir dos produtos do banco */
  const categories = useMemo(() => {
    const slugs = Array.from(new Set(products.map((p) => p.category)));
    return [
      { id: "todos", label: "Todos" },
      ...slugs.map((slug) => ({ id: slug, label: categoryLabel(slug) })),
    ];
  }, [products]);

  const filtered =
    activeCategory === "todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

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
            "radial-gradient(circle at 50% 0%, rgba(234,179,8,0.04) 0%, transparent 60%)",
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
              style={{ background: "var(--neon)" }}
            />
            <span
              className="text-xs uppercase tracking-[0.3em] font-semibold"
              style={{ color: "var(--neon)" }}
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
                    color: "var(--neon)",
                    textShadow: "0 0 30px rgba(234,179,8,0.4)",
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
                            background: "var(--neon)",
                            color: "#000",
                            boxShadow: "0 0 16px rgba(234,179,8,0.3)",
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

        {products.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
              Cardápio em atualização. Volte em breve.
            </p>
          </div>
        )}

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
              borderColor: "rgba(234,179,8,0.5)",
              color: "var(--neon)",
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

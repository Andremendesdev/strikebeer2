"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface FloatingCartButtonProps {
  count?: number;
  onClick?: () => void;
}

export function FloatingCartButton({ count = 0, onClick }: FloatingCartButtonProps) {
  const hasItems = count > 0;

  return (
    <motion.div
      className="fixed z-40 bottom-6 right-6 md:bottom-8 md:right-8"
      initial={{ opacity: 0, scale: 0.85, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay: 0.9 }}
    >
      {hasItems && (
        <motion.span
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "rgba(234,179,8,0.3)" }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}

      <motion.button
        type="button"
        onClick={onClick}
        aria-label={
          hasItems ? `Abrir carrinho, ${count} ${count === 1 ? "item" : "itens"}` : "Abrir carrinho"
        }
        whileHover={{
          scale: 1.07,
          boxShadow:
            "0 0 36px rgba(234,179,8,0.65), 0 0 64px rgba(234,179,8,0.2), 0 12px 40px rgba(0,0,0,0.45)",
        }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center justify-center w-14 h-14 md:w-[4.25rem] md:h-[4.25rem] rounded-full transition-shadow duration-300"
        style={{
          background: "linear-gradient(145deg, var(--neon) 0%, var(--neon) 45%, var(--neon) 100%)",
          color: "#09090b",
          border: "1px solid rgba(255,255,255,0.25)",
          boxShadow:
            "0 0 28px rgba(234,179,8,0.5), 0 0 56px rgba(234,179,8,0.12), 0 10px 36px rgba(0,0,0,0.5)",
        }}
      >
        <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.25} aria-hidden />

        <AnimatePresence>
          {hasItems && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="absolute -top-0.5 -right-0.5 min-w-[1.375rem] h-[1.375rem] px-1 flex items-center justify-center rounded-full text-[11px] font-bold leading-none"
              style={{
                background: "#09090b",
                color: "var(--neon)",
                border: "2px solid var(--neon)",
                boxShadow: "0 0 14px rgba(234,179,8,0.55)",
              }}
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

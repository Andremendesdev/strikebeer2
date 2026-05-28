"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Guitar } from "lucide-react";
import { isStrikeBeerOpen } from "@/lib/opening-hours";

/* ─── data ───────────────────────────────────────────────── */
const links = [
  { label: "Cardápio", href: "#cardapio" },
  { label: "Cervejas", href: "#cervejas" },
  { label: "Eventos", href: "#eventos" },
  { label: "Contato", href: "#contato" },
];

/* ─── status aberto / fechado ───────────────────────────── */
function OpenStatusBadge({ isOpen }: { isOpen: boolean }) {
  const color = isOpen ? "#4ade80" : "#f87171";
  const glow = isOpen ? "rgba(74,222,128,0.5)" : "rgba(248,113,113,0.5)";
  const bg = isOpen ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)";
  const border = isOpen ? "rgba(74,222,128,0.35)" : "rgba(248,113,113,0.35)";

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: `0 0 16px ${glow}`,
      }}
      role="status"
      aria-live="polite"
      aria-label={isOpen ? "Estabelecimento aberto agora" : "Estabelecimento fechado agora"}
    >
      {isOpen ? (
        <motion.span
          className="block w-2 h-2 rounded-full shrink-0"
          style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      ) : (
        <span
          className="block w-2 h-2 rounded-full shrink-0"
          style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
          aria-hidden
        />
      )}
      <span
        className="text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color, textShadow: `0 0 12px ${glow}` }}
      >
        {isOpen ? "Aberto" : "Fechado"}
      </span>
    </div>
  );
}

/* ─── nav link with animated underline ──────────────────── */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="group relative text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 hover:text-white transition-colors duration-300 py-1"
    >
      {label}
      <span
        className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 ease-out"
        style={{ background: "#facc15" }}
      />
    </a>
  );
}

/* ─── mobile menu overlay ────────────────────────────────── */
function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-[80vw] max-w-sm flex flex-col"
            style={{
              background: "#0d0d0f",
              borderLeft: "1px solid rgba(250,204,21,0.1)",
            }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* top bar */}
            <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <Guitar className="w-6 h-8 text-[#facc15]" strokeWidth={2} aria-hidden />
                <span
                  className="text-lg font-black uppercase text-white"
                  style={{
                    fontFamily: "var(--font-bebas)",
                    letterSpacing: "0.18em",
                  }}
                >
                  Strike Beer
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
                aria-label="Fechar menu"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* links */}
            <nav className="flex flex-col px-8 py-8 gap-1 flex-1">
              {links.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1 + i * 0.06,
                  }}
                  className="group flex items-center justify-between py-4 border-b text-white hover:text-[#facc15] transition-colors duration-300"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="text-2xl font-black uppercase"
                    style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em" }}
                  >
                    {link.label}
                  </span>
                  <svg
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#facc15"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.a>
              ))}
            </nav>

            {/* bottom CTA */}
            <motion.div
              className="px-8 pb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold uppercase tracking-[0.12em] transition-all duration-300 active:scale-95"
                style={{
                  background: "#facc15",
                  color: "#000",
                  boxShadow: "0 0 24px rgba(250,204,21,0.3)",
                }}
              >
                <Guitar className="w-6 h-8 text-[#facc15]" strokeWidth={2} aria-hidden />
                Pedir Agora
              </a>
              <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-[0.15em]">
                Delivery · Retirada · Mesa
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── main navbar ────────────────────────────────────────── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => setIsOpen(isStrikeBeerOpen());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-30"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        {/* top ticker */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          style={{
            height: "2px",
            background: "linear-gradient(90deg, transparent, #facc15 40%, #facc15 60%, transparent)",
            transformOrigin: "left",
          }}
        />

        {/* bar */}
        <div
          className="flex items-center justify-between px-6 md:px-12 lg:px-20 transition-all duration-500"
          style={{
            height: scrolled ? "64px" : "80px",
            background: scrolled
              ? "rgba(9,9,11,0.85)"
              : "linear-gradient(to bottom, rgba(9,9,11,0.7) 0%, transparent 100%)",
            backdropFilter: scrolled ? "blur(20px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
            borderBottom: scrolled
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid transparent",
          }}
        >
          {/* logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Guitar className="w-6 h-8 text-[#facc15]" strokeWidth={2} aria-hidden />
            </motion.div>
            <span
              className="font-black uppercase text-white"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: scrolled ? "1.3rem" : "1.5rem",
                letterSpacing: "0.18em",
                transition: "font-size 0.4s ease",
              }}
            >
              Strike{" "}
              <span style={{ color: "#facc15" }}>Beer</span>
            </span>
          </a>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavLink key={link.label} {...link} />
            ))}
          </nav>

          {/* right side */}
          <div className="hidden md:flex items-center gap-4">
            <OpenStatusBadge isOpen={isOpen} />
            {/* phone */}
            <a
              href="tel:+551199999999"
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-zinc-500 hover:text-zinc-300 transition-colors duration-300"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.83-1.34a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Reservas
            </a>

            <motion.a
              href="#"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 28px rgba(250,204,21,0.5)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-300"
              style={{
                background: "#facc15",
                color: "#000",
                boxShadow: "0 0 16px rgba(250,204,21,0.25)",
              }}
            >
              <Guitar className="w-2 h-3.5 text-[#facc15]" strokeWidth={2} aria-hidden />
              Pedir Agora
            </motion.a>
          </div>

          {/* mobile: status + menu */}
          <div className="flex md:hidden items-center gap-2">
            <OpenStatusBadge isOpen={isOpen} />
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col gap-[5px] p-2 group"
            aria-label="Abrir menu"
          >
            <span
              className="block h-px transition-all duration-300 group-hover:w-6"
              style={{ width: "24px", background: "#fff" }}
            />
            <span
              className="block h-px transition-all duration-300"
              style={{ width: "16px", background: "#facc15" }}
            />
            <span
              className="block h-px transition-all duration-300 group-hover:w-6"
              style={{ width: "24px", background: "#fff" }}
            />
          </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

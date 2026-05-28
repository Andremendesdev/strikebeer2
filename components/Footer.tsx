import { Guitar, MapPin, Phone, Clock, Mail, ExternalLink } from "lucide-react";

const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.348!2d-46.657!3d-23.561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce599ceb8f9f63%3A0xeb45ea586429733!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr";

const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Strike+Beer+São+Paulo";

const navLinks = [
  { label: "Cardápio", href: "#cardapio" },
  { label: "Cervejas", href: "#cervejas" },
  { label: "Eventos", href: "#eventos" },
  { label: "Avaliações", href: "#avaliacoes" },
];

const hours = [
  { days: "Seg — Qui", time: "18h às 01h" },
  { days: "Sex — Sáb", time: "18h às 03h" },
  { days: "Domingo", time: "17h às 00h" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="relative w-full overflow-hidden"
      style={{ background: "#09090b" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(250,204,21,0.25) 40%, rgba(250,204,21,0.4) 50%, rgba(250,204,21,0.25) 60%, transparent)",
        }}
      />

      {/* map */}
      <div className="relative w-full">
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, #09090b 0%, transparent 12%, transparent 88%, #09090b 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to right, #09090b 0%, transparent 8%, transparent 92%, #09090b 100%)",
          }}
        />
        <iframe
          title="Localização Strike Beer no Google Maps"
          src={MAPS_EMBED_URL}
          className="w-full h-[280px] md:h-[360px] border-0 grayscale opacity-70 hover:opacity-90 transition-opacity duration-500"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-8 md:-mt-12 pb-10">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 p-8 md:p-10 rounded-2xl"
          style={{
            background: "rgba(17,17,19,0.95)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* brand */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-flex items-center gap-2.5 mb-4">
              <Guitar className="w-5 h-7 text-[#facc15]" strokeWidth={2} aria-hidden />
              <span
                className="text-xl font-black uppercase text-white"
                style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.18em" }}
              >
                Strike <span className="text-[#facc15]">Beer</span>
              </span>
            </a>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Rock bar premium, burgers gourmet e mais de 200 rótulos de cerveja artesanal.
            </p>
          </div>

          {/* contato */}
          <div>
            <h3
              className="text-white uppercase mb-4"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.15rem",
                letterSpacing: "0.12em",
              }}
            >
              Contato
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-sm text-zinc-400 hover:text-[#facc15] transition-colors group"
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-[#facc15]" strokeWidth={2} />
                  <span>
                    Rua Augusta, 1456 — Consolação
                    <br />
                    São Paulo — SP, 01305-100
                    <ExternalLink className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+5511999999999"
                  className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-[#facc15] transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 text-[#facc15]" strokeWidth={2} />
                  (11) 99999-9999
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@strikebeer.com.br"
                  className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-[#facc15] transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-[#facc15]" strokeWidth={2} />
                  contato@strikebeer.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* horários */}
          <div>
            <h3
              className="text-white uppercase mb-4"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.15rem",
                letterSpacing: "0.12em",
              }}
            >
              Horários
            </h3>
            <ul className="space-y-2.5">
              {hours.map((row) => (
                <li key={row.days} className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-3.5 h-3.5 text-[#facc15]" strokeWidth={2} />
                    {row.days}
                  </span>
                  <span className="text-zinc-300 font-medium">{row.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* links */}
          <div>
            <h3
              className="text-white uppercase mb-4"
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.15rem",
                letterSpacing: "0.12em",
              }}
            >
              Navegação
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-[#facc15] transition-colors uppercase tracking-[0.08em]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: "#facc15",
                color: "#000",
                boxShadow: "0 0 16px rgba(250,204,21,0.25)",
              }}
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />
              Como chegar
            </a>
          </div>
        </div>

        {/* bottom bar */}
        <div
          className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-zinc-600"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p>© {year} Strike Beer. Todos os direitos reservados.</p>
          <p>Rock Bar & Burgers Gourmet · São Paulo</p>
        </div>
      </div>
    </footer>
  );
}

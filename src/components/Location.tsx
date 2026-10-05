import { ArrowUpRight, Bus, MapPin, Phone, Plane } from "lucide-react";
import Reveal from "./Reveal";
import { HOTEL, NEARBY } from "../lib/site";

const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Mayoral Hotel & Suites, " + HOTEL.plusCode
)}`;

function SketchMap() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden hairline bg-panel/50 sm:aspect-square">
      {/* Abstract street plan */}
      <svg
        viewBox="0 0 600 600"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g stroke="#2a2318" strokeWidth="1.5" fill="none">
          <path d="M-20,140 C120,120 300,160 620,110" />
          <path d="M-20,300 C160,270 380,330 620,290" />
          <path d="M-20,470 C200,440 400,500 620,450" />
          <path d="M120,-20 C140,150 100,420 160,620" />
          <path d="M330,-20 C350,180 300,420 370,620" />
          <path d="M500,-20 C520,200 470,400 540,620" />
        </g>
        <path
          d="M-20,215 C180,190 420,250 620,205"
          stroke="#c9a35c"
          strokeOpacity="0.35"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M235,-20 C250,160 210,420 265,620"
          stroke="#c9a35c"
          strokeOpacity="0.2"
          strokeWidth="3"
          fill="none"
        />
        <text x="556" y="40" fill="#a3987f" fontSize="11" letterSpacing="3">
          N ↑
        </text>
      </svg>

      {/* Hotel pin */}
      <div className="absolute left-[44%] top-[36%]">
        <span className="gold-pin absolute -inset-3 rounded-full" />
        <span className="relative grid h-8 w-8 place-items-center rounded-full bg-gold text-ink shadow-[0_0_30px_rgba(201,163,92,0.45)]">
          <MapPin className="h-4 w-4" />
        </span>
        <span className="absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap bg-ink/85 px-2.5 py-1 font-display text-[11px] uppercase tracking-[0.2em] text-gold-2 backdrop-blur">
          Mayoral
        </span>
      </div>

      {/* Surrounding markers */}
      {[
        { x: "70%", y: "20%", label: "Synagogue Church", icon: null },
        { x: "74%", y: "66%", label: "Ajao Estate", icon: null },
        { x: "30%", y: "42%", label: "Bus stop · 3 min", icon: Bus },
        { x: "12%", y: "82%", label: "MMIA Airport", icon: Plane },
      ].map((m) => (
        <div
          key={m.label}
          className="absolute flex items-center gap-2"
          style={{ left: m.x, top: m.y }}
        >
          <span className="grid h-5 w-5 shrink-0 -translate-x-1/2 place-items-center rounded-full border border-gold/50 bg-ink text-gold">
            {m.icon ? (
              <m.icon className="h-2.5 w-2.5" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            )}
          </span>
          <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.18em] text-fog">
            {m.label}
          </span>
        </div>
      ))}

      {/* Map HUD */}
      <div className="hairline-t absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-ink/80 px-5 py-4 backdrop-blur">
        <span className="text-[10px] uppercase tracking-[0.25em] text-fog">
          Plus code
        </span>
        <span className="font-display text-sm tracking-[0.2em] text-cream">
          {HOTEL.plusCode}
        </span>
      </div>
    </div>
  );
}

export default function Location() {
  return (
    <section id="location" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <Reveal className="mb-10 flex items-center gap-4 md:mb-16">
        <span className="font-editorial text-lg italic text-gold">( 06 )</span>
        <span className="h-px w-12 bg-gold/60" />
        <span className="text-[11px] uppercase tracking-[0.4em] text-fog">
          Getting here
        </span>
      </Reveal>

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <Reveal>
            <h2 className="font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.04] text-cream">
              14 Aminu Ajibode Ave,
              <br />
              <span className="font-editorial lowercase italic text-gold-2">
                Isheri Olofin,
              </span>
              <br />
              Lagos 102213
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 bg-gold px-7 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-ink transition-colors duration-500 hover:bg-gold-2"
              >
                Get directions
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={`tel:${HOTEL.phoneIntl}`}
                className="group inline-flex items-center gap-3 border border-line px-7 py-4 text-[11px] uppercase tracking-[0.28em] text-cream transition-colors duration-500 hover:border-gold/60 hover:text-gold"
              >
                <Phone className="h-4 w-4" />
                Call the front desk
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-8 inline-flex items-center gap-2 hairline px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-fog">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Egbeda neighbourhood · rated 3.8 — great for visitors
            </p>
          </Reveal>

          {/* Nearby */}
          <div className="mt-10 border-t border-line">
            {NEARBY.map((n, i) => (
              <Reveal key={n.name} delay={0.06 * i} className="border-b border-line">
                <div className="group flex items-center justify-between gap-4 py-5 transition-colors duration-500 hover:bg-cream/[0.02]">
                  <div className="flex items-center gap-4">
                    <span className="font-editorial text-sm italic text-gold/60">
                      0{i + 1}
                    </span>
                    <p className="text-sm text-cream md:text-base">{n.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-gold-2">{n.dist}</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-fog">
                      {n.note}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15} className="lg:col-span-6">
          <SketchMap />
        </Reveal>
      </div>
    </section>
  );
}

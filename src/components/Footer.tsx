import { ArrowUp, ArrowUpRight, Globe, MapPin, Phone, Star } from "lucide-react";
import { naira } from "../lib/format";
import { scrollTop } from "../lib/scroll";
import Reveal from "./Reveal";
import { HOTEL } from "../lib/site";

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const SOCIALS = [
  {
    label: "Instagram",
    path: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" />
      </>
    ),
  },
  {
    label: "Facebook",
    path: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "X",
    path: (
      <>
        <path d="M4 4l16 16" />
        <path d="M20 4L4 20" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="hairline-t relative overflow-hidden bg-coal">
      {/* CTA */}
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-24 md:px-10 md:pt-36">
        <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-gold">
              Rooms from {naira(HOTEL.fromPrice)} — pay at the property
            </p>
            <h2 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.95] text-cream">
              Ready when{" "}
              <span className="font-editorial lowercase italic text-gold-2">
                you are.
              </span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <a
              href={`tel:${HOTEL.phoneIntl}`}
              className="group inline-flex items-center gap-3 bg-gold px-8 py-5 text-[12px] font-medium uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:bg-gold-2"
            >
              <Phone className="h-4 w-4" />
              Reserve by phone
            </a>
            <a
              href={`https://${HOTEL.site}`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-fog transition-colors hover:text-gold"
            >
              or book online at {HOTEL.site}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Giant wordmark */}
      <Reveal y={60} className="select-none px-2">
        <p className="text-outline whitespace-nowrap text-center font-display text-[clamp(4rem,15vw,15rem)] uppercase leading-[0.8] tracking-[0.06em]">
          {HOTEL.wordmark}
        </p>
      </Reveal>

      {/* Info grid */}
      <div className="mx-auto mt-16 grid max-w-[1440px] grid-cols-1 gap-10 border-t border-line px-5 py-14 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
        <Reveal>
          <p className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
            <MapPin className="h-3.5 w-3.5" /> Visit
          </p>
          <p className="text-sm leading-relaxed text-cream/80">
            {HOTEL.address}
            <br />
            {HOTEL.city}
            <br />
            {HOTEL.country}
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-fog">
            {HOTEL.plusCode}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
            <Phone className="h-3.5 w-3.5" /> Talk to us
          </p>
          <a
            href={`tel:${HOTEL.phoneIntl}`}
            className="block text-sm text-cream/80 transition-colors hover:text-gold"
          >
            {HOTEL.phoneDisplay}
          </a>
          <a
            href={`https://${HOTEL.site}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 flex items-center gap-1.5 text-sm text-cream/80 transition-colors hover:text-gold"
          >
            <Globe className="h-3.5 w-3.5 text-fog" /> {HOTEL.site}
          </a>
          <div className="mt-5 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={`https://${HOTEL.site}`}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center hairline text-fog transition-all duration-300 hover:border-gold/60 hover:text-gold"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" {...strokeProps}>
                  {s.path}
                </svg>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-gold">
            Hours
          </p>
          <div className="space-y-2 text-sm text-cream/80">
            <p className="flex justify-between gap-6">
              <span className="text-fog">Check-in</span> from{" "}
              {HOTEL.checkInTime}
            </p>
            <p className="flex justify-between gap-6">
              <span className="text-fog">Check-out</span> until{" "}
              {HOTEL.checkOutTime}
            </p>
            <p className="flex justify-between gap-6">
              <span className="text-fog">Front desk</span> 24 hours
            </p>
            <p className="flex justify-between gap-6">
              <span className="text-fog">The bar</span> 6 pm — 2 am
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gold">
            <Star className="h-3.5 w-3.5" /> Guest score
          </p>
          <div className="flex items-end gap-3">
            <span className="font-display text-6xl leading-none text-cream">
              4.0
            </span>
            <p className="mb-1 text-[11px] leading-relaxed text-fog">
              / 5 — {HOTEL.reviewCount} verified reviews
              <br />
              "Great value, honest stay."
            </p>
          </div>
        </Reveal>
      </div>

      {/* Bottom bar */}
      <div className="hairline-t">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-5 py-6 text-[10px] uppercase tracking-[0.25em] text-fog sm:flex-row md:px-10">
          <p>
            © 2026 {HOTEL.name} — Isheri Olofin, Lagos
          </p>
          <p className="flex items-center gap-2">
            <Star className="h-3 w-3 fill-gold text-gold" />
            4.0 on Google · Free cancellation
          </p>
          <button
            onClick={scrollTop}
            className="group flex items-center gap-2 transition-colors hover:text-gold"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

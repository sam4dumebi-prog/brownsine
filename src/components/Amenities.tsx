import {
  Bell,
  Car,
  Coffee,
  Lock,
  Martini,
  ShieldCheck,
  ShowerHead,
  Snowflake,
  Sparkles,
  Tv,
  Wifi,
  Zap,
} from "lucide-react";
import Reveal from "./Reveal";

const ITEMS = [
  { icon: Wifi, name: "Free high-speed Wi-Fi", desc: "Fast enough for work calls and football streams." },
  { icon: Zap, name: "24-hour power", desc: "Generator-backed supply — the lights simply stay on." },
  { icon: Snowflake, name: "Cold, quiet AC", desc: "Every room serviced, every night cool." },
  { icon: Tv, name: "Flat-screen + DSTV", desc: "Local and international channels in every room." },
  { icon: Sparkles, name: "Daily housekeeping", desc: "Fresh towels and linen every single morning." },
  { icon: Bell, name: "24/7 front desk", desc: "Check in at 2 am if you need to. We're awake." },
  { icon: Car, name: "Airport pickup", desc: "Arranged on request — about 25 minutes from MMIA." },
  { icon: ShieldCheck, name: "Secure parking", desc: "Gated, well-lit compound with night security." },
  { icon: ShowerHead, name: "Hot rain showers", desc: "Strong pressure, real hot water, every time." },
  { icon: Martini, name: "Bar & lounge", desc: "Open late, downstairs, 6 pm until 2 am." },
  { icon: Coffee, name: "Breakfast & tea", desc: "Morning tea, bread, eggs and local plates." },
  { icon: Lock, name: "In-room safe", desc: "Plus luggage storage after check-out." },
];

export default function Amenities() {
  return (
    <section id="amenities" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <Reveal className="mb-10 flex items-center gap-4 md:mb-16">
        <span className="font-editorial text-lg italic text-gold">( 04 )</span>
        <span className="h-px w-12 bg-gold/60" />
        <span className="text-[11px] uppercase tracking-[0.4em] text-fog">
          Included
        </span>
      </Reveal>

      <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 lg:flex-row lg:items-end">
        <Reveal>
          <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[1] text-cream">
            Everything,{" "}
            <span className="font-editorial lowercase italic text-gold-2">
              already handled
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="max-w-sm text-sm font-light leading-relaxed text-cream/70 lg:text-right">
            No fine print, no surprises — the essentials of a good Lagos stay
            are simply part of the room.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal
            key={item.name}
            delay={0.04 * (i % 4)}
            className="group relative border-b border-r border-line px-7 py-9 transition-colors duration-500 hover:bg-cream/[0.025]"
          >
            <span className="absolute right-5 top-5 font-editorial text-sm italic text-fog/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <item.icon className="h-6 w-6 text-gold transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />
            <h3 className="mt-6 font-display text-lg leading-snug text-cream">
              {item.name}
            </h3>
            <p className="mt-2 text-[13px] font-light leading-relaxed text-fog">
              {item.desc}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

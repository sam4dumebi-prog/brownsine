import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BedDouble,
  Clock,
  LogIn,
  LogOut,
  Ruler,
  ShieldCheck,
  Users,
} from "lucide-react";
import { addDays, humanDate, naira } from "../lib/format";
import { EASE } from "../lib/motion";
import Reveal from "./Reveal";
import { HOTEL, ROOMS } from "../lib/site";

export default function Rooms({
  nights,
  checkIn,
  checkOut,
  guests,
}: {
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: number;
}) {
  const cancelUntil = humanDate(addDays(checkIn, -1));

  return (
    <section id="rooms" className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      {/* Header */}
      <Reveal className="mb-6 flex items-center gap-4">
        <span className="font-editorial text-lg italic text-gold">( 02 )</span>
        <span className="h-px w-12 bg-gold/60" />
        <span className="text-[11px] uppercase tracking-[0.4em] text-fog">
          Sleep well
        </span>
      </Reveal>

      <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 lg:flex-row lg:items-end">
        <Reveal>
          <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.95] text-cream">
            Rooms &amp;{" "}
            <span className="font-editorial lowercase italic text-gold-2">
              suites
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.15} className="lg:text-right">
          <p className="text-[11px] uppercase tracking-[0.25em] text-fog">
            Your search
          </p>
          <p className="mt-2 text-sm text-cream md:text-base">
            {humanDate(checkIn)} <span className="text-gold">→</span>{" "}
            {humanDate(checkOut)} · {nights}{" "}
            {nights === 1 ? "night" : "nights"} · {guests}{" "}
            {guests === 1 ? "guest" : "guests"}
          </p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-gold-2/90">
            <ShieldCheck className="h-3.5 w-3.5" />
            Free cancellation until {cancelUntil}
          </p>
        </Reveal>
      </div>

      {/* Room rows */}
      <div>
        {ROOMS.map((room, i) => {
          const total = room.price * nights;
          const otaprice = Math.round(room.price * 1.55);
          const flip = i % 2 === 1;
          return (
            <Reveal key={room.id} className="border-t border-line">
              <article className="group grid grid-cols-1 gap-8 py-10 md:grid-cols-12 md:gap-10 md:py-14 lg:items-center">
                {/* Image */}
                <div
                  className={`relative overflow-hidden md:col-span-5 ${
                    flip ? "md:order-2" : ""
                  }`}
                >
                  <motion.img
                    src={room.image}
                    alt={`${room.name} at Mayoral Hotel & Suites`}
                    initial={{ scale: 1.12 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: EASE }}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute left-0 top-0 bg-ink/85 px-4 py-2 font-editorial text-xl italic text-gold backdrop-blur-sm">
                    {room.index}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-cream backdrop-blur">
                    Official rate
                  </span>
                </div>

                {/* Info */}
                <div
                  className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="font-display text-3xl text-cream transition-colors duration-500 group-hover:text-gold-2 md:text-4xl">
                      {room.name}
                    </h3>
                    <span className="font-editorial text-lg italic text-fog">
                      — {room.italic}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-fog">
                    <span className="flex items-center gap-2">
                      <Ruler className="h-3.5 w-3.5 text-gold/80" /> {room.size}
                    </span>
                    <span className="flex items-center gap-2">
                      <BedDouble className="h-3.5 w-3.5 text-gold/80" />{" "}
                      {room.bed}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-gold/80" />{" "}
                      {room.guests}
                    </span>
                  </div>

                  <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-cream/70 md:text-[15px]">
                    {room.blurb}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {room.perks.map((p) => (
                      <span
                        key={p}
                        className="hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-fog transition-colors duration-300 group-hover:border-gold/40"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
                    <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
                      <div>
                        <p className="font-display text-3xl text-cream md:text-4xl">
                          {naira(room.price)}
                          <span className="ml-1 font-body text-xs uppercase tracking-[0.2em] text-fog">
                            / night
                          </span>
                        </p>
                        <p className="mt-1 text-[11px] text-fog">
                          <span className="line-through decoration-gold/60">
                            {naira(otaprice)}
                          </span>{" "}
                          on Agoda — book direct, pay less
                        </p>
                      </div>
                      <div className="hairline px-4 py-2.5">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-fog">
                          {nights} {nights === 1 ? "night" : "nights"} total
                        </p>
                        <p className="font-display text-xl text-gold-2">
                          {naira(total)}
                        </p>
                      </div>
                    </div>

                    <a
                      href={`tel:${HOTEL.phoneIntl}`}
                      className="group/link inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-gold transition-colors hover:text-gold-2"
                    >
                      Reserve this room
                      <span className="grid h-9 w-9 place-items-center hairline transition-all duration-500 group-hover/link:border-gold group-hover/link:bg-gold group-hover/link:text-ink">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
        <div className="border-t border-line" />
      </div>

      {/* Policies */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: LogIn, t: "Check-in", v: `from ${HOTEL.checkInTime}` },
          { icon: LogOut, t: "Check-out", v: `until ${HOTEL.checkOutTime}` },
          { icon: Clock, t: "Front desk", v: "Open 24 hours, every day" },
        ].map(({ icon: Icon, t, v }, i) => (
          <Reveal
            key={t}
            delay={0.08 * i}
            className="hairline flex items-center gap-4 bg-panel/40 px-6 py-5"
          >
            <Icon className="h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-fog">
                {t}
              </p>
              <p className="mt-1 text-sm text-cream">{v}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

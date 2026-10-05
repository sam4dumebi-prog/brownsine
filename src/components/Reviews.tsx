import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { EASE } from "../lib/motion";
import Reveal from "./Reveal";
import { HOTEL, REVIEW_BARS, TESTIMONIALS } from "../lib/site";

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= n ? "fill-gold text-gold" : "fill-gold/20 text-gold/20"
          }`}
        />
      ))}
    </span>
  );
}

export default function Reviews() {
  return (
    <section
      id="reviews"
      className="hairline-t hairline-b bg-coal/60 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal className="mb-10 flex items-center gap-4 md:mb-16">
          <span className="font-editorial text-lg italic text-gold">( 05 )</span>
          <span className="h-px w-12 bg-gold/60" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-fog">
            Word of mouth
          </span>
        </Reveal>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Score summary */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <div className="flex items-end gap-4">
                  <span className="font-display text-[clamp(5rem,10vw,8.5rem)] leading-none text-cream">
                    4.0
                  </span>
                  <div className="mb-4">
                    <Stars n={4} />
                    <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-fog">
                      {HOTEL.reviewCount} verified
                      <br />
                      guest reviews
                    </p>
                  </div>
                </div>
              </Reveal>

              <div className="mt-10 space-y-3.5">
                {REVIEW_BARS.map((b, i) => (
                  <Reveal key={b.stars} delay={0.05 * i}>
                    <div className="flex items-center gap-4">
                      <span className="flex w-8 items-center gap-1 text-xs text-fog">
                        {b.stars}
                        <Star className="h-3 w-3 fill-gold/70 text-gold/70" />
                      </span>
                      <div className="relative h-[3px] flex-1 overflow-hidden bg-line">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: b.pct / 100 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.3, delay: 0.2, ease: EASE }}
                          style={{ transformOrigin: "left" }}
                          className="absolute inset-0 bg-gold"
                        />
                      </div>
                      <span className="w-9 text-right text-[11px] text-fog">
                        {b.pct}%
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.3}>
                <p className="mt-8 text-[11px] uppercase tracking-[0.2em] text-fog/70">
                  Collected across Google Maps &amp; booking partners
                </p>
              </Reveal>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-8">
            {TESTIMONIALS.map((t, i) => (
              <Reveal
                key={t.name}
                delay={0.08 * i}
                className={`group relative flex flex-col hairline bg-panel/50 p-7 transition-colors duration-500 hover:bg-panel ${
                  i % 2 === 1 ? "sm:translate-y-8" : ""
                }`}
              >
                <Quote className="absolute right-6 top-6 h-5 w-5 text-gold/30 transition-colors duration-500 group-hover:text-gold/60" />
                <div className="flex items-center justify-between gap-4">
                  <Stars n={t.stars} />
                  <span className="hairline px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-gold-2/90">
                    {t.tag}
                  </span>
                </div>
                <p className="mt-5 flex-1 font-editorial text-lg leading-relaxed text-cream/85">
                  “{t.text}”
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full hairline font-display text-sm text-gold">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm text-cream">{t.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-fog">
                      {t.origin} · {t.date}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

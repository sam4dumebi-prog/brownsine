import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { useRef } from "react";
import { EASE } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { HOTEL } from "../lib/site";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const rise = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
    >
      {/* Parallax image */}
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <motion.img
          initial={{ scale: 1.12, filter: "brightness(0.6)" }}
          animate={{ scale: 1, filter: "brightness(1)" }}
          transition={{ duration: 2.2, ease: EASE }}
          src="images/hero.jpg"
          alt="Executive suite at Mayoral Hotel & Suites at night"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
      </motion.div>

      {/* Vertical side label */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 items-center gap-4 lg:flex"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="text-[10px] uppercase tracking-[0.5em] text-cream/60 [writing-mode:vertical-rl]"
        >
          {HOTEL.address} — Isheri Olofin
        </motion.span>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity: fade, y: rise }}
        className="absolute inset-0 flex flex-col justify-end"
      >
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-24 md:px-10 md:pb-28">
          {/* Rating pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="mb-6 flex flex-wrap items-center gap-4 text-cream"
          >
            <span className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < 4 ? "fill-gold text-gold" : "fill-gold/25 text-gold/25"
                  }`}
                />
              ))}
            </span>
            <span className="text-xs uppercase tracking-[0.3em]">
              <strong className="font-medium text-gold-2">4.0</strong>
              <span className="text-cream/70">
                {" "}
                · {HOTEL.reviewCount} guest reviews
              </span>
            </span>
            <span className="hidden h-px w-16 bg-cream/30 sm:block" />
            <span className="hidden text-xs uppercase tracking-[0.3em] text-cream/70 sm:block">
              Egbeda · Lagos
            </span>
          </motion.div>

          {/* Wordmark */}
          <div className="relative">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.35 }}
              className="mb-4 text-[11px] uppercase tracking-[0.45em] text-gold-2/90"
            >
              A warm, straightforward stay
            </motion.p>
            <h1 className="font-display leading-[0.85]">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.55, ease: EASE }}
                  className="block text-[clamp(3.8rem,13.5vw,12rem)] uppercase tracking-[0.02em] text-cream"
                >
                  Mayoral
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
                  className="block font-editorial text-[clamp(2rem,5.5vw,4.5rem)] lowercase italic text-gold-2"
                >
                  hotel &amp; suites
                </motion.span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
              className="mt-6 max-w-md text-sm font-light leading-relaxed text-cream/75"
            >
              Set among the shops and eateries of Egbeda, West Lagos — simple
              rooms, honest prices, and hospitality that remembers your name.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-8 right-10 z-10 hidden lg:block"
      >
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.9, ease: EASE }}
          onClick={() => scrollToId("about")}
          className="group flex flex-col items-center gap-3"
          aria-label="Scroll down"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-cream/60 transition-colors group-hover:text-cream [writing-mode:vertical-rl]">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-gold" />
          </motion.span>
        </motion.button>
      </motion.div>
    </section>
  );
}

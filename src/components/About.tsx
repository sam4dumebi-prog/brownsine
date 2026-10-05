import { motion } from "framer-motion";
import { EASE } from "../lib/motion";
import Reveal from "./Reveal";
import { HOTEL } from "../lib/site";

const STATEMENT =
  "Set among the shops and eateries of Egbeda, Mayoral is a straightforward stay done with uncommon warmth — honest rooms, quiet nights, and a modest price that lets the city be your luxury.";

const STATS = [
  { value: "42", label: "Rooms & suites" },
  { value: `${HOTEL.reviewCount}`, label: "Verified guest reviews" },
  { value: "4.0", label: "Average guest rating" },
  { value: "3 min", label: "Walk to the bus stop" },
];

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      {/* Kicker */}
      <Reveal className="mb-10 flex items-center gap-4 md:mb-16">
        <span className="font-editorial text-lg italic text-gold">( 01 )</span>
        <span className="h-px w-12 bg-gold/60" />
        <span className="text-[11px] uppercase tracking-[0.4em] text-fog">
          The address
        </span>
      </Reveal>

      {/* Statement — word by word */}
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-15%" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.03 } },
        }}
        className="max-w-5xl font-editorial text-[clamp(1.7rem,4.2vw,3.4rem)] leading-[1.18] text-cream"
      >
        {STATEMENT.split(" ").map((w, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: "0.55em", filter: "blur(6px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.7, ease: EASE },
              },
            }}
            className={`mr-[0.24em] inline-block ${
              ["warmth", "honest", "quiet"].includes(w.replace(/[^a-z]/gi, ""))
                ? "italic text-gold-2"
                : ""
            }`}
          >
            {w}
          </motion.span>
        ))}
      </motion.p>

      {/* Images */}
      <div className="mt-16 grid grid-cols-12 gap-4 md:mt-24 md:gap-8">
        <Reveal className="col-span-12 md:col-span-7">
          <div className="group relative overflow-hidden">
            <motion.img
              src="images/exterior.jpg"
              alt="Mayoral Hotel & Suites exterior at dusk"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.6, ease: EASE }}
              className="aspect-[16/10] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-60" />
            <span className="absolute bottom-4 left-4 bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-cream backdrop-blur">
              Isheri Olofin at dusk
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="col-span-12 md:col-span-5">
          <div className="group relative overflow-hidden md:-mt-10">
            <motion.img
              src="images/lobby.jpg"
              alt="Warm lobby and reception of Mayoral Hotel"
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.6, ease: EASE }}
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-60" />
            <span className="absolute bottom-4 left-4 bg-ink/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-cream backdrop-blur">
              The front desk, always awake
            </span>
          </div>
        </Reveal>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 border-l border-t border-line md:mt-24 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={0.08 * i}
            className="border-b border-r border-line px-6 py-8 md:px-10 md:py-12"
          >
            <p className="font-display text-4xl text-cream md:text-6xl">
              {s.value}
            </p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-fog">
              {s.label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

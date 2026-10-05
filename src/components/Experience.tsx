import { motion } from "framer-motion";
import { EASE } from "../lib/motion";
import Reveal from "./Reveal";

const OFFERS = [
  {
    n: "01",
    name: "The Bar",
    desc: "Amber shelves, low music, a cold one after Lagos traffic.",
    time: "6:00 pm — 2:00 am",
  },
  {
    n: "02",
    name: "Kitchen & Grill",
    desc: "Jollof, peppered chicken and grills, cooked the way home would.",
    time: "7:00 am — 10:00 pm",
  },
  {
    n: "03",
    name: "In-Room Dining",
    desc: "Late arrival? You'll still be fed. Press 200 from your room.",
    time: "until 11:30 pm",
  },
];

function Seal() {
  return (
    <div className="absolute -left-8 -top-8 z-10 hidden lg:block">
      <div className="relative grid h-32 w-32 place-items-center">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow">
          <defs>
            <path
              id="seal-circle"
              d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
            />
          </defs>
          <text className="fill-gold/90 text-[13.5px] uppercase" style={{ letterSpacing: "3.5px" }}>
            <textPath href="#seal-circle">
              Mayoral · Hotel &amp; Suites · Lagos ·
            </textPath>
          </text>
        </svg>
        <span className="font-display text-gold">M</span>
      </div>
    </div>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="hairline-t hairline-b bg-coal/60 py-24 md:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal className="mb-10 flex items-center gap-4 md:mb-16">
          <span className="font-editorial text-lg italic text-gold">( 03 )</span>
          <span className="h-px w-12 bg-gold/60" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-fog">
            After hours
          </span>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Collage */}
          <div className="relative lg:col-span-7">
            <Seal />
            <div className="relative ml-auto w-full md:w-10/12">
              <div className="group overflow-hidden">
                <motion.img
                  src="images/dining.jpg"
                  alt="The after-hours bar at Mayoral Hotel"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1.7, ease: EASE }}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-fog">
                The lounge — where neighbours become regulars
              </p>
            </div>
            <Reveal
              delay={0.2}
              className="relative -mt-24 w-2/3 md:-mt-40 md:w-1/2"
            >
              <div className="group overflow-hidden hairline">
                <motion.img
                  src="images/detail.jpg"
                  alt="Rain shower and marble bathroom detail"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 1.7, ease: EASE }}
                  className="aspect-square w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-fog">
                Hot rain showers, steam and quiet
              </p>
            </Reveal>
          </div>

          {/* Text */}
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.02] text-cream">
                The lounge{" "}
                <span className="font-editorial lowercase italic text-gold-2">
                  stays open
                </span>{" "}
                late
              </h2>
              <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-cream/70">
                Lagos evenings deserve somewhere to land. Downstairs, our bar
                pours until two, the kitchen grills until ten, and the night
                porter knows the regulars by name and by order.
              </p>
            </Reveal>

            <div className="mt-10 border-t border-line">
              {OFFERS.map((o, i) => (
                <Reveal key={o.n} delay={0.08 * i} className="border-b border-line">
                  <div className="group flex items-start justify-between gap-6 py-6 transition-colors duration-500 hover:bg-cream/[0.02]">
                    <div className="flex items-start gap-5">
                      <span className="pt-1 font-editorial text-lg italic text-gold/70">
                        {o.n}
                      </span>
                      <div>
                        <h3 className="font-display text-xl text-cream transition-colors duration-500 group-hover:text-gold-2">
                          {o.name}
                        </h3>
                        <p className="mt-1.5 max-w-xs text-sm font-light text-fog">
                          {o.desc}
                        </p>
                      </div>
                    </div>
                    <span className="whitespace-nowrap pt-1 text-[10px] uppercase tracking-[0.2em] text-gold/80">
                      {o.time}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

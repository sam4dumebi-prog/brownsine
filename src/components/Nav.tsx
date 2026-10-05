import { AnimatePresence, motion } from "framer-motion";
import { Menu, MoveUpRight, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { EASE } from "../lib/motion";
import { lockScroll, scrollToId, scrollTop, unlockScroll } from "../lib/scroll";
import { HOTEL } from "../lib/site";

const LINKS = [
  { label: "About", id: "about" },
  { label: "Rooms", id: "rooms" },
  { label: "Experience", id: "experience" },
  { label: "Amenities", id: "amenities" },
  { label: "Reviews", id: "reviews" },
  { label: "Location", id: "location" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lockScroll();
    else unlockScroll();
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 60);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-ink/80 backdrop-blur-md hairline-b"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
          <button
            onClick={scrollTop}
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="grid h-9 w-9 place-items-center hairline font-display text-[15px] text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink">
              M
            </span>
            <span className="hidden font-display text-sm tracking-[0.35em] text-cream sm:block">
              {HOTEL.wordmark}
            </span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="group relative text-[11px] uppercase tracking-[0.28em] text-fog transition-colors duration-300 hover:text-cream"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${HOTEL.phoneIntl}`}
              className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-fog transition-colors hover:text-cream md:flex"
            >
              <Phone className="h-3.5 w-3.5 text-gold" />
              {HOTEL.phoneDisplay}
            </a>
            <button
              onClick={() => go("rooms")}
              className="group hidden items-center gap-2 border border-gold/50 px-5 py-2.5 text-[11px] uppercase tracking-[0.28em] text-gold transition-all duration-500 hover:bg-gold hover:text-ink md:flex"
            >
              Reserve
              <MoveUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center hairline text-cream lg:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/97 backdrop-blur-xl"
          >
            <div className="flex flex-1 flex-col justify-center gap-1 px-8 pt-20">
              {LINKS.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.6, delay: 0.06 * i, ease: EASE }}
                  onClick={() => go(l.id)}
                  className="group flex items-baseline gap-4 py-3 text-left"
                >
                  <span className="font-editorial text-sm italic text-gold">
                    0{i + 1}
                  </span>
                  <span className="font-display text-4xl text-cream transition-colors duration-300 group-hover:text-gold sm:text-5xl">
                    {l.label}
                  </span>
                </motion.button>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35 }}
              className="hairline-t px-8 py-6 text-xs uppercase tracking-[0.25em] text-fog"
            >
              <p>{HOTEL.address}</p>
              <p className="mt-1">{HOTEL.city}</p>
              <a
                href={`tel:${HOTEL.phoneIntl}`}
                className="mt-3 block text-gold"
              >
                {HOTEL.phoneDisplay}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

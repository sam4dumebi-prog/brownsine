import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CalendarCheck2,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { addDays, humanDate, naira, todayISO } from "../lib/format";
import { EASE } from "../lib/motion";
import { scrollToId } from "../lib/scroll";
import { HOTEL } from "../lib/site";

export type BookingState = {
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
};

export default function BookingBar({
  state,
  onChange,
}: {
  state: BookingState;
  onChange: (s: BookingState) => void;
}) {
  const { checkIn, checkOut, guests, nights } = state;
  const [checking, setChecking] = useState(false);
  const minIn = todayISO();

  const setDates = (ci: string, co: string) => {
    const inD = new Date(ci + "T12:00:00");
    const outD = new Date(co + "T12:00:00");
    if (outD <= inD) co = addDays(ci, 1);
    const nights = Math.max(
      1,
      Math.round((
        new Date(co + "T12:00:00").getTime() - inD.getTime()
      ) / 86400000)
    );
    onChange({ checkIn: ci, checkOut: co, guests, nights });
  };

  const submit = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      scrollToId("rooms");
    }, 650);
  };

  const cancelUntil = humanDate(addDays(checkIn, -1));

  const field =
    "w-full bg-transparent text-sm text-cream outline-none sm:text-base";
  const label =
    "mb-1 block text-[10px] uppercase tracking-[0.3em] text-gold/80";

  return (
    <div id="booking" className="relative z-20 mx-auto -mt-[4.5rem] w-full max-w-6xl px-4 sm:px-6 md:-mt-[5.5rem]">
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, ease: EASE }}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="hairline grid grid-cols-2 bg-panel/95 backdrop-blur-md lg:grid-cols-[1fr_1fr_1fr_auto]"
      >
        <label className="group block border-line border-b px-5 py-4 transition-colors focus-within:bg-cream/[0.03] lg:border-b-0 lg:border-r">
          <span className={label}>Check-in</span>
          <input
            type="date"
            required
            min={minIn}
            value={checkIn}
            onChange={(e) => setDates(e.currentTarget.value, checkOut)}
            className={field}
            aria-label="Check-in date"
          />
          <span className="mt-1 block text-[11px] text-fog">
            {humanDate(checkIn)} · from {HOTEL.checkInTime}
          </span>
        </label>

        <label className="group block border-b border-l border-line px-5 py-4 transition-colors focus-within:bg-cream/[0.03] lg:border-b-0 lg:border-l-0 lg:border-r">
          <span className={label}>Check-out</span>
          <input
            type="date"
            required
            min={addDays(checkIn, 1)}
            value={checkOut}
            onChange={(e) => setDates(checkIn, e.currentTarget.value)}
            className={field}
            aria-label="Check-out date"
          />
          <span className="mt-1 block text-[11px] text-fog">
            {humanDate(checkOut)} · until {HOTEL.checkOutTime}
          </span>
        </label>

        <div className="col-span-2 flex items-center justify-between gap-3 px-5 py-4 lg:col-span-1 lg:border-r lg:border-line">
          <div>
            <span className={label}>Guests</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onChange({ ...state, guests: Math.max(1, guests - 1) })
                }
                className="grid h-7 w-7 place-items-center hairline text-fog transition-colors hover:border-gold/60 hover:text-gold"
                aria-label="Fewer guests"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="flex items-center gap-1.5 text-sm text-cream sm:text-base">
                <Users className="h-3.5 w-3.5 text-gold/70" />
                {guests}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChange({ ...state, guests: Math.min(8, guests + 1) })
                }
                className="grid h-7 w-7 place-items-center hairline text-fog transition-colors hover:border-gold/60 hover:text-gold"
                aria-label="More guests"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="mt-1 block text-[11px] text-fog">
              {nights} {nights === 1 ? "night" : "nights"}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="group relative col-span-2 flex items-center justify-center gap-3 overflow-hidden bg-gold px-8 py-5 text-[12px] font-medium uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:bg-gold-2 lg:col-span-1 lg:min-w-[220px]"
        >
          {checking ? (
            <span className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
              Searching
            </span>
          ) : (
            <>
              Check availability
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-fog"
      >
        <span className="flex items-center gap-2">
          <BadgeCheck className="h-3.5 w-3.5 text-gold" />
          Best rate here — from {naira(HOTEL.fromPrice)} · Agoda {naira(31_566)}
        </span>
        <span className="flex items-center gap-2">
          <CalendarCheck2 className="h-3.5 w-3.5 text-gold" />
          Free cancellation until {cancelUntil}
        </span>
        <span className="flex items-center gap-2">
          <Banknote className="h-3.5 w-3.5 text-gold" />
          Pay at the property
        </span>
      </motion.div>
    </div>
  );
}

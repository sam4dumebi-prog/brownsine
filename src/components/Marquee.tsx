import { HOTEL } from "../lib/site";
import { naira } from "../lib/format";

const ITEMS = [
  { t: `Suites from ${naira(HOTEL.fromPrice)}`, solid: true },
  { t: "24-hour power", solid: false },
  { t: "Isheri Olofin · Lagos", solid: true },
  { t: "After-hours lounge", solid: false },
  { t: "Free cancellation", solid: true },
  { t: `Rated 4.0 by ${HOTEL.reviewCount} guests`, solid: false },
];

function Row() {
  return (
    <div className="flex w-max shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`whitespace-nowrap px-8 font-display text-[clamp(1.3rem,2.6vw,2.2rem)] uppercase tracking-[0.08em] ${
              item.solid ? "text-cream/90" : "text-outline"
            }`}
          >
            {item.t}
          </span>
          <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" />
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="hairline-b mt-16 overflow-hidden py-5 md:mt-20">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}

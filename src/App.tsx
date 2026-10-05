import { useEffect, useState } from "react";
import About from "./components/About";
import Amenities from "./components/Amenities";
import BookingBar, { type BookingState } from "./components/BookingBar";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Location from "./components/Location";
import Marquee from "./components/Marquee";
import Nav from "./components/Nav";
import Reviews from "./components/Reviews";
import Rooms from "./components/Rooms";
import { addDays, diffDays, todayISO } from "./lib/format";
import { initLenis } from "./lib/scroll";

export default function App() {
  const [booking, setBooking] = useState<BookingState>(() => {
    const checkIn = addDays(todayISO(), 7);
    const checkOut = addDays(todayISO(), 9);
    return {
      checkIn,
      checkOut,
      guests: 2,
      nights: diffDays(checkIn, checkOut),
    };
  });

  useEffect(() => {
    initLenis();
  }, []);

  return (
    <div className="grain relative">
      <Nav />
      <main>
        <Hero />
        <BookingBar state={booking} onChange={setBooking} />
        <Marquee />
        <About />
        <Rooms
          nights={booking.nights}
          checkIn={booking.checkIn}
          checkOut={booking.checkOut}
          guests={booking.guests}
        />
        <Experience />
        <Amenities />
        <Reviews />
        <Location />
      </main>
      <Footer />
    </div>
  );
}

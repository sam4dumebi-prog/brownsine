export const HOTEL = {
  name: "Mayoral Hotel & Suites",
  wordmark: "MAYORAL",
  tagline: "hotel & suites",
  address: "14 Aminu Ajibode Ave",
  city: "Isheri Olofin, Lagos 102213",
  country: "Nigeria",
  neighborhood: "Egbeda",
  neighborhoodScore: 3.8,
  phoneDisplay: "0806 486 7157",
  phoneIntl: "+2348064867157",
  site: "mayoralhotel.com",
  plusCode: "H7PP+2W Lagos",
  rating: 4.0,
  reviewCount: 772,
  checkInTime: "11:00",
  checkOutTime: "12:00",
  fromPrice: 20_350,
} as const;

export type Room = {
  id: string;
  index: string;
  name: string;
  italic: string;
  price: number;
  size: string;
  bed: string;
  guests: string;
  image: string;
  blurb: string;
  perks: string[];
};

export const ROOMS: Room[] = [
  {
    id: "standard",
    index: "01",
    name: "Standard Double",
    italic: "the easy night",
    price: 20_350,
    size: "18 m²",
    bed: "Queen bed",
    guests: "2 guests",
    image: "images/room-standard.jpg",
    blurb:
      "Everything you need, nothing you don't — a cool, quiet queen room with blackout drapes and a warm reading lamp.",
    perks: ["Free Wi-Fi", "Cold AC", "Flat-screen TV", "Hot shower"],
  },
  {
    id: "deluxe",
    index: "02",
    name: "Deluxe King",
    italic: "room to breathe",
    price: 28_900,
    size: "24 m²",
    bed: "King bed",
    guests: "2 guests",
    image: "images/room-deluxe.jpg",
    blurb:
      "A wider, moodier king room with a lounging chair, a work desk and a softer pool of evening light.",
    perks: ["Free Wi-Fi", "Work desk", "Mini fridge", "Breakfast option"],
  },
  {
    id: "executive",
    index: "03",
    name: "Executive Suite",
    italic: "sleep & sit",
    price: 39_500,
    size: "34 m²",
    bed: "King + lounge",
    guests: "3 guests",
    image: "images/room-executive.jpg",
    blurb:
      "A separate sitting room, velvet chairs and a proper dressing mirror — the favourite of long-stay guests.",
    perks: ["Free Wi-Fi", "Sitting room", "DSTV channels", "Late checkout*"],
  },
  {
    id: "royal",
    index: "04",
    name: "Mayoral Royal Suite",
    italic: "the signature",
    price: 58_000,
    size: "48 m²",
    bed: "Super king + bar",
    guests: "4 guests",
    image: "images/hero.jpg",
    blurb:
      "Our top-floor signature: a private bar, city-view windows and the deepest sleep in Isheri Olofin.",
    perks: ["Airport pickup*", "Private bar", "City view", "Room service"],
  },
];

export type Testimonial = {
  name: string;
  origin: string;
  stars: number;
  date: string;
  text: string;
  tag: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Chinedu O.",
    origin: "Enugu",
    stars: 5,
    date: "2 weeks ago",
    text: "Very decent for the price. Staff were polite, the AC was ice cold, and the generator kept everything running through the night. I'll return.",
    tag: "Great value",
  },
  {
    name: "Adaeze N.",
    origin: "Festac Town",
    stars: 4,
    date: "a month ago",
    text: "Clean room, fresh towels every morning and the lounge downstairs is a nice touch. Breakfast was simple but good. Would stay again.",
    tag: "Clean & tidy",
  },
  {
    name: "Ibrahim S.",
    origin: "Kano",
    stars: 4,
    date: "2 months ago",
    text: "Good location in Isheri — the bus stop is a three-minute walk. Quiet at night, secure parking. Straightforward hotel, exactly as described.",
    tag: "Quiet location",
  },
  {
    name: "Funke A.",
    origin: "Egbeda",
    stars: 5,
    date: "3 months ago",
    text: "Booked the executive suite for a family visit. Spacious and well kept. The front desk helped us arrange airport pickup without stress.",
    tag: "Helpful staff",
  },
] as any;

export const REVIEW_BARS = [
  { stars: 5, pct: 46 },
  { stars: 4, pct: 26 },
  { stars: 3, pct: 14 },
  { stars: 2, pct: 6 },
  { stars: 1, pct: 8 },
];

export const NEARBY = [
  { name: "Synagogue Church of all Nations", dist: "5 km", note: "11 min drive" },
  { name: "Ajao Estate", dist: "6 km", note: "13 min drive" },
  { name: "Nearest bus stop", dist: "250 m", note: "3 min walk" },
  { name: "Murtala Muhammed Int'l Airport", dist: "≈ 9 km", note: "25 min drive" },
];

export const siteConfig = {
  name: "Vizit Africa",
  description: "Experience the heart of Africa with our comprehensive travel services.", // added description
  url: "https://vizit.africa", // assumed url
  ogImage: "https://vizit.africa/og.jpg",
  links: {
    twitter: "https://twitter.com/vizitafrica",
    github: "https://github.com/vizitafrica", // probably not needed but good for structure
  },
  contact: {
    email: "info@vizitafrica.com",
    phone: "+250788888888",
    address: "Kigali, Rwanda",
  },
  socials: {
    facebook: "https://www.facebook.com/vizitafrica",
    twitter: "https://twitter.com/vizitafrica",
    instagram: "https://www.instagram.com/vizitafrica",
    linkedin: "https://www.linkedin.com/company/vizitafrica",
  },
  multiLanguage: true,
  defaultLanguage: "en",
  supportedLanguages: ["en", "fr", "es"],
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export const HERO_SLIDES = [
  {
    id: 1,
    image: "/images/gradivis.jpg",
    key: "1",
  },
  {
    id: 2,
    image: "/images/hotel.jpg",
    key: "2",
  },
  {
    id: 3,
    image: "/images/tourism-guide-vehicle-car.jpg",
    key: "3",
  },
  {
    id: 4,
    image: "/images/guide.jpg",
    key: "4",
  },
  {
    id: 5,
    image: "/images/kigali-convention-center.jpg",
    key: "5",
  },
] as const;

export const PARTNER_LOGOS = [
  { name: "RwandAir", logo: "/images/partners/rwandair.svg" },
  { name: "Kenya Airways", logo: "/images/partners/kenya-airways.svg" },
  { name: "Ethiopian Airlines", logo: "/images/partners/ethiopian.svg" },
  { name: "Qatar Airways", logo: "/images/partners/qatar.svg" },
  { name: "Serena Hotels", logo: "/images/partners/serena.svg" },
  { name: "Marriott", logo: "/images/partners/marriott.svg" },
  { name: "Radisson", logo: "/images/partners/radisson.svg" },
];

export const STATS = [
  { value: "200+", label: "Happy Travelers" },
  { value: "15+", label: "Countries Served" },
  { value: "4.9", label: "Average Rating" },
];

export const BENEFITS = [
  "Real-time pricing from verified partners",
  "Local experts with deep Rwanda knowledge",
  "24/7 support during your trip",
  "Flexible booking and cancellation",
  "Transparent costs with no hidden fees",
];

export const SERVICES_OVERVIEW = [
  {
    icon: "plane",
    title: "Flights",
    description:
      "We source the most convenient and cost-effective flight options based on your trip details.",
  },
  {
    icon: "building",
    title: "Hotels",
    description:
      "Handpicked partner stays across Kigali, Musanze, and Lake Kivu regions at estimated rates.",
  },
  {
    icon: "car",
    title: "Car Rental",
    description:
      "A flexible fleet from compact sedans to safari-ready Land Cruisers with optional drivers.",
  },
  {
    icon: "user",
    title: "Guides",
    description:
      "Local experts for wildlife, history, culture, and adventure experiences at daily rates.",
  },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    title: "Share Your Plan",
    description:
      "Tell us your travel dates, group size, and what you'd like to experience using our planner.",
  },
  {
    step: 2,
    title: "We Source Options",
    description:
      "Our team manually finds the best real-time availability and prices from our trusted partners.",
  },
  {
    step: 3,
    title: "Receive Your Quote",
    description:
      "Within 48 hours, you'll receive a detailed itinerary with final prices for your approval.",
  },
  {
    step: 4,
    title: "Confirm & Enjoy",
    description:
      "Once you approve and pay, we handle all the logistics so you can focus on your journey.",
  },
];

export const GALLERY_IMAGES = [
  {
    id: "g-1",
    src: "/images/gallery/gorilla.jpg",
    alt: "Mountain Gorilla",
    category: "experiences",
    caption: "Gorilla Trekking in Volcanoes National Park",
  },
  {
    id: "g-2",
    src: "/images/gallery/kigali-night.jpg",
    alt: "Kigali Skyline",
    category: "experiences",
    caption: "Kigali City Convention Center at Night",
  },
  {
    id: "g-3",
    src: "/images/gallery/akagera-safari.jpg",
    alt: "Safari Game Drive",
    category: "experiences",
    caption: "Game Drive in Akagera National Park",
  },
  {
    id: "g-4",
    src: "/images/gallery/hotel-pool.jpg",
    alt: "Hotel Pool",
    category: "hotels",
    caption: "Infinity Pool at Lake Kivu",
  },
  {
    id: "g-5",
    src: "/images/gallery/land-cruiser.jpg",
    alt: "Safari Vehicle",
    category: "transport",
    caption: "Our Fleet of 4x4 Safari Vehicles",
  },
  {
    id: "g-6",
    src: "/images/gallery/coffee-tour.jpg",
    alt: "Coffee Plantation",
    category: "experiences",
    caption: "Rwandan Coffee Experience Tour",
  },
];

// Re-export specific values for backward compatibility if needed, 
export const { socials, contact: contacts } = siteConfig;

export const DRIVER_SURCHARGE = 35;
export const SERVICE_FEE_RATE = 0.05;
export const ITEMS_PER_PAGE = 4;
export const siteConfig = {
  name: "Vizit Africa",
  description:
    "Your premium gateway to Rwanda and Africa. We provide manual sourcing for the best flight fares, handpicked hotels, rugged car rentals, and expert local guides for an authentic African narrative.",
  url: "https://vizit.africa",
  ogImage: "https://vizit.africa/images/rwanda-landscape.jpg",
  keywords: [
    "Visit Rwanda",
    "Africa Travel",
    "Book Flights to Rwanda",
    "Kigali Hotels",
    "Rwanda Car Rental",
    "Gorilla Trekking",
    "African Safari",
    "Travel Agency Rwanda",
  ],
  links: {
    twitter: "https://twitter.com/vizitafrica",
  },
  twitterHandle: "@vizitafrica",
  contact: {
    email: "kesly@vizit.africa",
    phone: "+250780486847",
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
    title: "Akagera",
    code: "AKG",
    status: "boarding",
  },
  {
    id: 2,
    image: "/images/hotel.jpg",
    key: "2",
    title: "Kivu",
    code: "KVU",
    status: "available",
  },
  {
    id: 3,
    image: "/images/tourism-guide-vehicle-car.jpg",
    key: "3",
    title: "Kigali",
    code: "KGL",
    status: "available",
  },
  {
    id: 4,
    image: "/images/guide.jpg",
    key: "4",
    title: "Nyungwe",
    code: "NYU",
    status: "available",
  },
  {
    id: 5,
    image: "/images/kigali-convention-center.jpg",
    key: "5",
    title: "Volcanoes",
    code: "VNP",
    status: "available",
  },
] as const;

export const PARTNER_LOGOS = [
  { name: "RwandAir", logo: "/logo.svg" },
  { name: "Kenya Airways", logo: "/logo.svg" },
  { name: "Ethiopian Airlines", logo: "/logo.svg" },
  { name: "Qatar Airways", logo: "/logo.svg" },
  { name: "Serena Hotels", logo: "/logo.svg" },
  { name: "Marriott", logo: "/logo.svg" },
  { name: "Radisson", logo: "/logo.svg" },
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
    src: "/images/wildlife-silverback-gorilla.jpg",
    alt: "Mountain Gorilla",
    category: "experiences",
    caption: "Gorilla Trekking in Volcanoes National Park",
  },
  {
    id: "g-2",
    src: "/images/kigali-convention-center.jpg",
    alt: "Kigali Skyline",
    category: "experiences",
    caption: "Kigali City Convention Center at Night",
  },
  {
    id: "g-3",
    src: "/images/buffaloes.jpg",
    alt: "Safari Game Drive",
    category: "experiences",
    caption: "Game Drive in Akagera National Park",
  },
  {
    id: "g-4",
    src: "/images/hotel.jpg",
    alt: "Hotel Pool",
    category: "hotels",
    caption: "Infinity Pool at Lake Kivu",
  },
  {
    id: "g-5",
    src: "/images/tourism-guide-vehicle-car.jpg",
    alt: "Safari Vehicle",
    category: "transport",
    caption: "Our Fleet of 4x4 Safari Vehicles",
  },
  {
    id: "g-6",
    src: "/images/coffee.jpg",
    alt: "Coffee Plantation",
    category: "experiences",
    caption: "Rwandan Coffee Experience Tour",
  },
];

// Re-export specific values for backward compatibility if needed,
export const { socials, contact: contacts } = siteConfig;

export const TESTIMONIAL_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
];

export const CONTACT_BACKGROUND =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=90&w=2600&auto=format&fit=crop";

export const DRIVER_SURCHARGE = 35;
export const SERVICE_FEE_RATE = 0.05;
export const ITEMS_PER_PAGE = 4;

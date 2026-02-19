import type {
  Flight,
  Hotel,
  Car,
  Guide,
  Request,
  Package,
  Testimonial,
  GalleryImage,
  TeamMember,
  User,
  Booking,
} from "./schemas";

export const flights: Flight[] = [
  {
    id: "fl-1",
    airline: "RwandAir",
    airlineLogo: "/images/airlines/rwandair.svg",
    flightNumber: "WB 500",
    departureCity: "Nairobi",
    departureAirport: "NBO",
    departureTime: "2025-03-15T08:30:00",
    arrivalCity: "Kigali",
    arrivalAirport: "KGL",
    arrivalTime: "2025-03-15T09:45:00",
    duration: "1h 15m",
    stops: 0,
    cabinClass: "economy",
    price: 285,
    currency: "USD",
    seatsAvailable: 12,
  },
  {
    id: "fl-2",
    airline: "RwandAir",
    airlineLogo: "/images/airlines/rwandair.svg",
    flightNumber: "WB 501",
    departureCity: "Nairobi",
    departureAirport: "NBO",
    departureTime: "2025-03-15T14:00:00",
    arrivalCity: "Kigali",
    arrivalAirport: "KGL",
    arrivalTime: "2025-03-15T15:15:00",
    duration: "1h 15m",
    stops: 0,
    cabinClass: "business",
    price: 520,
    currency: "USD",
    seatsAvailable: 6,
  },
  {
    id: "fl-3",
    airline: "Kenya Airways",
    airlineLogo: "/images/airlines/kenya-airways.svg",
    flightNumber: "KQ 456",
    departureCity: "Nairobi",
    departureAirport: "NBO",
    departureTime: "2025-03-15T11:00:00",
    arrivalCity: "Kigali",
    arrivalAirport: "KGL",
    arrivalTime: "2025-03-15T12:20:00",
    duration: "1h 20m",
    stops: 0,
    cabinClass: "economy",
    price: 310,
    currency: "USD",
    seatsAvailable: 8,
  },
  {
    id: "fl-4",
    airline: "Ethiopian Airlines",
    airlineLogo: "/images/airlines/ethiopian.svg",
    flightNumber: "ET 807",
    departureCity: "Addis Ababa",
    departureAirport: "ADD",
    departureTime: "2025-03-15T06:00:00",
    arrivalCity: "Kigali",
    arrivalAirport: "KGL",
    arrivalTime: "2025-03-15T08:30:00",
    duration: "2h 30m",
    stops: 0,
    cabinClass: "economy",
    price: 245,
    currency: "USD",
    seatsAvailable: 15,
  },
];

export const hotels: Hotel[] = [
  {
    id: "ht-1",
    name: "Kigali Marriott Hotel",
    location: "KN 3 Ave, Kigali",
    area: "Kigali City Center",
    rating: 4.8,
    stars: 5,
    reviewCount: 342,
    description:
      "Luxury hotel in the heart of Kigali with stunning city views, rooftop pool, and world-class dining.",
    amenities: [
      "Free WiFi",
      "Pool",
      "Spa",
      "Restaurant",
      "Fitness Center",
      "Airport Shuttle",
      "Business Center",
    ],
    images: [
      "/images/hotels/marriott-1.jpg",
      "/images/hotels/marriott-2.jpg",
      "/images/hotels/marriott-3.jpg",
    ],
    pricePerNight: 220,
    currency: "USD",
    roomTypes: [
      { id: "rm-1", name: "Deluxe Room", capacity: 2, price: 220 },
      { id: "rm-2", name: "Executive Suite", capacity: 3, price: 380 },
      { id: "rm-3", name: "Presidential Suite", capacity: 4, price: 650 },
    ],
    available: true,
  },
  {
    id: "ht-2",
    name: "Radisson Blu Hotel & Convention Centre",
    location: "KG 2 Roundabout, Kigali",
    area: "Kigali City Center",
    rating: 4.6,
    stars: 5,
    reviewCount: 289,
    description:
      "Modern hotel featuring spacious rooms, multiple restaurants, and excellent conference facilities.",
    amenities: [
      "Free WiFi",
      "Pool",
      "Gym",
      "Restaurant",
      "Bar",
      "Parking",
      "24h Room Service",
    ],
    images: ["/images/hotels/radisson-1.jpg", "/images/hotels/radisson-2.jpg"],
    pricePerNight: 185,
    currency: "USD",
    roomTypes: [
      { id: "rm-4", name: "Standard Room", capacity: 2, price: 185 },
      { id: "rm-5", name: "Business Class Room", capacity: 2, price: 250 },
      { id: "rm-6", name: "Junior Suite", capacity: 3, price: 320 },
    ],
    available: true,
  },
  {
    id: "ht-3",
    name: "Five Volcanoes Boutique Hotel",
    location: "Musanze, Northern Province",
    area: "Musanze (Gorilla Trekking)",
    rating: 4.9,
    stars: 4,
    reviewCount: 156,
    description:
      "Charming boutique hotel near Volcanoes National Park, perfect base for gorilla trekking adventures.",
    amenities: [
      "Free WiFi",
      "Restaurant",
      "Garden",
      "Tour Desk",
      "Fireplace",
      "Mountain Views",
    ],
    images: [
      "/images/hotels/five-volcanoes-1.jpg",
      "/images/hotels/five-volcanoes-2.jpg",
    ],
    pricePerNight: 165,
    currency: "USD",
    roomTypes: [
      { id: "rm-7", name: "Garden View Room", capacity: 2, price: 165 },
      { id: "rm-8", name: "Volcano View Room", capacity: 2, price: 195 },
      { id: "rm-9", name: "Family Suite", capacity: 4, price: 280 },
    ],
    available: true,
  },
  {
    id: "ht-4",
    name: "Lake Kivu Serena Hotel",
    location: "Rubavu, Western Province",
    area: "Lake Kivu",
    rating: 4.7,
    stars: 5,
    reviewCount: 198,
    description:
      "Lakeside resort with private beach, water sports, and breathtaking views of Lake Kivu.",
    amenities: [
      "Private Beach",
      "Pool",
      "Water Sports",
      "Spa",
      "Restaurant",
      "Garden",
      "Boat Trips",
    ],
    images: [
      "/images/hotels/serena-kivu-1.jpg",
      "/images/hotels/serena-kivu-2.jpg",
    ],
    pricePerNight: 245,
    currency: "USD",
    roomTypes: [
      { id: "rm-10", name: "Garden Room", capacity: 2, price: 245 },
      { id: "rm-11", name: "Lake View Room", capacity: 2, price: 295 },
      { id: "rm-12", name: "Lakefront Suite", capacity: 3, price: 420 },
    ],
    available: true,
  },
];

export const cars: Car[] = [
  {
    id: "car-1",
    type: "sedan",
    name: "Toyota Corolla",
    brand: "Toyota",
    image: "/images/cars/corolla.jpg",
    capacity: 4,
    luggage: 3,
    transmission: "automatic",
    fuelType: "petrol",
    features: ["AC", "Bluetooth", "USB Charging", "GPS"],
    pricePerDay: 55,
    withDriver: false,
    currency: "USD",
    available: true,
  },
  {
    id: "car-2",
    type: "suv",
    name: "Toyota RAV4",
    brand: "Toyota",
    image: "/images/cars/rav4.jpg",
    capacity: 5,
    luggage: 4,
    transmission: "automatic",
    fuelType: "petrol",
    features: ["AC", "4WD", "Bluetooth", "USB Charging", "GPS", "Roof Rails"],
    pricePerDay: 85,
    withDriver: false,
    currency: "USD",
    available: true,
  },
  {
    id: "car-3",
    type: "suv",
    name: "Toyota Land Cruiser Prado",
    brand: "Toyota",
    image: "/images/cars/prado.jpg",
    capacity: 7,
    luggage: 5,
    transmission: "automatic",
    fuelType: "diesel",
    features: [
      "AC",
      "4WD",
      "Leather Seats",
      "Bluetooth",
      "GPS",
      "Third Row",
      "Off-road Capable",
    ],
    pricePerDay: 120,
    withDriver: false,
    currency: "USD",
    available: true,
  },
  {
    id: "car-4",
    type: "van",
    name: "Toyota Hiace",
    brand: "Toyota",
    image: "/images/cars/hiace.jpg",
    capacity: 14,
    luggage: 8,
    transmission: "manual",
    fuelType: "diesel",
    features: ["AC", "Large Luggage Space", "Group Travel"],
    pricePerDay: 150,
    withDriver: false,
    currency: "USD",
    available: true,
  },
  {
    id: "car-5",
    type: "luxury",
    name: "Mercedes-Benz E-Class",
    brand: "Mercedes-Benz",
    image: "/images/cars/mercedes-e.jpg",
    capacity: 4,
    luggage: 3,
    transmission: "automatic",
    fuelType: "petrol",
    features: [
      "AC",
      "Leather Seats",
      "Premium Sound",
      "GPS",
      "WiFi Hotspot",
      "Executive Interior",
    ],
    pricePerDay: 200,
    withDriver: false,
    currency: "USD",
    available: true,
  },
];

export const guides: Guide[] = [
  {
    id: "gd-1",
    name: "Jean-Pierre Uwimana",
    photo: "/images/guides/jean-pierre.jpg",
    type: "full-day",
    languages: ["English", "French", "Kinyarwanda", "Swahili"],
    specialties: ["Gorilla Trekking", "Wildlife Safari", "Cultural Tours"],
    experience: 12,
    rating: 4.9,
    reviewCount: 87,
    bio: "Born and raised near Volcanoes National Park, Jean-Pierre has been guiding visitors through Rwanda's natural wonders for over a decade. His deep knowledge of gorilla behavior and conservation makes every trek unforgettable.",
    pricePerDay: 80,
    currency: "USD",
    available: true,
  },
  {
    id: "gd-2",
    name: "Marie-Claire Ingabire",
    photo: "/images/guides/marie-claire.jpg",
    type: "full-day",
    languages: ["English", "French", "Kinyarwanda"],
    specialties: [
      "History Tours",
      "Genocide Memorials",
      "City Tours",
      "Cultural Experiences",
    ],
    experience: 8,
    rating: 4.8,
    reviewCount: 64,
    bio: "Marie-Claire is passionate about sharing Rwanda's history of resilience and transformation. Her thoughtful approach to memorial visits and cultural sites provides deep understanding of Rwanda's journey.",
    pricePerDay: 65,
    currency: "USD",
    available: true,
  },
  {
    id: "gd-3",
    name: "Emmanuel Nshimiyimana",
    photo: "/images/guides/emmanuel.jpg",
    type: "full-day",
    languages: ["English", "French", "Kinyarwanda", "German"],
    specialties: [
      "Bird Watching",
      "Nature Walks",
      "Photography Tours",
      "Lake Kivu",
    ],
    experience: 10,
    rating: 4.7,
    reviewCount: 52,
    bio: "A certified ornithologist with encyclopedic knowledge of Rwanda's 700+ bird species. Emmanuel leads specialized birding tours and nature photography expeditions across the country.",
    pricePerDay: 75,
    currency: "USD",
    available: true,
  },
];

export const sampleRequests: Request[] = [
  {
    id: "req-1",
    userId: "user-1",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1-555-0123",
    arrivalDate: "2025-03-15",
    departureDate: "2025-03-22",
    travelers: 2,
    needsFlights: true,
    needsHotel: true,
    needsCar: true,
    needsGuide: true,
    notes: "Interested in gorilla trekking. First time visiting Africa.",
    status: "pending",
    createdAt: "2025-02-01T10:30:00Z",
  },
  {
    id: "req-2",
    userId: "user-2",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "+1-555-0456",
    arrivalDate: "2025-04-10",
    departureDate: "2025-04-15",
    travelers: 4,
    purpose: "business",
    needsFlights: false,
    needsHotel: true,
    needsCar: true,
    needsGuide: false,
    notes: "Business trip with some leisure days. Need hotels in Kigali only.",
    status: "quoted",
    createdAt: "2025-02-02T15:45:00Z",
  },
];

export const samplePackage: Package = {
  id: "pkg-1",
  requestId: "req-1",
  flights: flights.slice(0, 2),
  hotels: hotels.slice(0, 2),
  cars: cars.slice(0, 3),
  guides: guides.slice(0, 2),
  expiresAt: "2025-02-15T23:59:59Z",
  status: "sent",
  createdAt: "2025-02-03T09:00:00Z",
};

export const faqData = [
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking at least 3-4 weeks in advance, especially if you're planning gorilla trekking permits which can sell out months ahead. For peak season (June-September, December-February), book 2-3 months early.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and mobile money (MTN MoMo, Airtel Money). Payment plans are available for larger bookings.",
  },
  {
    question: "Can I modify my booking after confirmation?",
    answer:
      "Yes! You can modify most bookings up to 48 hours before your arrival date. Changes to gorilla permits are subject to availability and Rwanda Development Board policies.",
  },
  {
    question: "Do you provide airport pickup?",
    answer:
      "Absolutely. All our packages include the option for airport pickup at Kigali International Airport. Our drivers will meet you at arrivals with a name board.",
  },
  {
    question: "What's included in the tour guide service?",
    answer:
      "Our guides provide full-day services including transportation, entrance fees to attractions, meals, and expert commentary. They handle all logistics so you can focus on the experience.",
  },
  {
    question: "Is Rwanda safe for tourists?",
    answer:
      "Rwanda is one of the safest countries in Africa for tourists. Kigali is consistently ranked as one of the cleanest and most secure capital cities on the continent.",
  },
  {
    question: "What should I pack for gorilla trekking?",
    answer:
      "Essential items include: waterproof hiking boots, long pants, long-sleeved shirt, rain jacket, gardening gloves, and a daypack. We provide a detailed packing list upon booking.",
  },
  {
    question: "Do I need a visa to visit Rwanda?",
    answer:
      "Most nationalities can obtain a visa on arrival or e-visa. African Union passport holders and citizens of some countries enter visa-free. We'll help you understand your specific requirements.",
  },
];

export const partnerLogos = [
  { name: "RwandAir", logo: "/images/partners/rwandair.svg" },
  { name: "Kenya Airways", logo: "/images/partners/kenya-airways.svg" },
  { name: "Ethiopian Airlines", logo: "/images/partners/ethiopian.svg" },
  { name: "Qatar Airways", logo: "/images/partners/qatar.svg" },
  { name: "Serena Hotels", logo: "/images/partners/serena.svg" },
  { name: "Marriott", logo: "/images/partners/marriott.svg" },
  { name: "Radisson", logo: "/images/partners/radisson.svg" },
];

export const stats = [
  { value: "200+", label: "Happy Travelers" },
  { value: "15+", label: "Countries Served" },
  { value: "4.9", label: "Average Rating" },
];

export const benefits = [
  "Real-time pricing from verified partners",
  "Local experts with deep Rwanda knowledge",
  "24/7 support during your trip",
  "Flexible booking and cancellation",
  "Transparent costs with no hidden fees",
];

export const services = [
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

export const processSteps = [
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

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Sarah M.",
    role: "Adventure Traveler",
    country: "United Kingdom",
    avatar: "/images/avatars/sarah.jpg",
    content:
      "Vizit Africa made our gorilla trekking dream come true. The logistics were flawless, and our guide Jean-Pierre was incredibly knowledgeable. Highly recommended!",
    rating: 5,
  },
  {
    id: "t-2",
    name: "John Davis",
    role: "Business Traveler",
    country: "USA",
    avatar: "/images/avatars/john.jpg",
    content:
      "I needed a quick car rental and hotel for a conference in Kigali. Their team arranged everything within hours. Professional, reliable, and excellent service.",
    rating: 5,
  },
  {
    id: "t-3",
    name: "Aisha Mohammed",
    role: "Family Vacation",
    country: "Kenya",
    avatar: "/images/avatars/aisha.jpg",
    content:
      "Traveling with kids can be stressful, but Vizit Africa handled everything. The Lake Kivu resort they suggested was perfect for our family. We'll be back!",
    rating: 5,
  },
];

export const galleryImages: GalleryImage[] = [
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

export const teamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Aline Uwase",
    role: "Founder & CEO",
    image: "/images/team/aline.jpg",
    bio: "With 15 years in Rwandan tourism, Aline founded Vizit Africa to share the beauty of her homeland with the world.",
  },
  {
    id: "tm-2",
    name: "David Mutesa",
    role: "Head of Operations",
    image: "/images/team/david.jpg",
    bio: "David ensures every trip runs smoothly, managing our network of partners and logistics with military precision.",
  },
  {
    id: "tm-3",
    name: "Grace Iribagiza",
    role: "Customer Experience Lead",
    image: "/images/team/grace.jpg",
    bio: "Grace leads our support team, ensuring every traveler feels safe, welcomed, and cared for 24/7.",
  },
];

export const users: User[] = [
  {
    id: "user-1",
    email: "sarah.j@example.com",
    name: "Sarah Johnson",
    phone: "+1-555-0123",
    role: "customer",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "user-2",
    email: "m.chen@example.com",
    name: "Michael Chen",
    phone: "+1-555-0456",
    role: "customer",
    createdAt: "2025-01-20T14:30:00Z",
  },
  {
    id: "admin-1",
    email: "admin@vizit.africa",
    name: "Admin User",
    role: "admin",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

export const sampleBookings: Booking[] = [
  {
    id: "bk-1",
    packageId: "pkg-1",
    userId: "user-1",
    selectedFlight: flights[0],
    selectedHotel: hotels[0],
    selectedCar: cars[1],
    selectedGuide: guides[0],
    subtotal: 2400,
    serviceFee: 120,
    total: 2520,
    currency: "USD",
    status: "draft",
    bookedAt: "2025-02-04T12:00:00Z",
  },
];

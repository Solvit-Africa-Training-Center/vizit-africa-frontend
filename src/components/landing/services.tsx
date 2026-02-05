import { RiArrowRightUpLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "Luxury Flights",
    description: "Private charters & premium class access.",
    className: "md:col-span-2 md:row-span-2",
    image:
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=2600&auto=format&fit=crop", // Plane wing view
  },
  {
    title: "Curated Hotels",
    description: "From boutique lodges to 5-star resorts.",
    className: "md:col-span-1 md:row-span-1",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2600&auto=format&fit=crop", // Luxury Hotel
  },
  {
    title: "Exclusive Experiences",
    description: "Gorilla trekking, tea plantations, and more.",
    className: "md:col-span-1 md:row-span-2",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2600&auto=format&fit=crop", // Safari/Nature
  },
  {
    title: "VIP Transfers",
    description: "Seamless ground transportation.",
    className: "md:col-span-1 md:row-span-1",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2600&auto=format&fit=crop", // Luxury Car
  },
];

export function Services() {
  return (
    <section className="container mx-auto px-5 py-24 mb-20">
      <div className="max-w-2xl mb-12">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
          World Class Services
        </h2>
        <p className="text-muted-foreground text-lg font-light">
          We handle everything from the moment you leave your doorstep until you
          return, changed forever.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[120vh] md:h-[80vh]">
        {services.map((service, i) => (
          <div
            key={i}
            className={cn(
              "group relative overflow-hidden bg-muted border border-border/10 rounded-2xl",
              service.className,
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors duration-500" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                    {service.title}
                  </h3>
                  <RiArrowRightUpLine className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-4 group-hover:translate-x-0" />
                </div>

                <p className="text-white/80 font-light text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Shine effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700 bg-linear-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transform"
              style={{ transitionDuration: "1s" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

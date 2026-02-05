import { stats, benefits } from "@/lib/dummy-data";

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="py-24 bg-background border-t border-border/40"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* left - Header & Stats */}
          <div>
            <div className="mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Why Choose Vizit Africa
              </h2>
              <p className="max-w-md text-lg text-muted-foreground font-light leading-relaxed">
                We believe in travel that transforms. Numbers that reflect our
                commitment to exceptional experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-10 gap-x-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-5xl md:text-6xl font-black text-primary mb-2 tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right - benefits list (Clean Editorial) */}
          <div className="pt-8 md:pt-20">
            <h3 className="font-display text-xl font-bold uppercase tracking-widest text-foreground mb-8 border-b border-border pb-4">
              The Standard
            </h3>

            <ul className="space-y-8">
              {benefits.map((benefit, i) => (
                <li key={i} className="group">
                  <div className="flex items-baseline gap-6">
                    <span className="font-mono text-primary/40 text-sm">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-xl md:text-2xl font-light text-foreground group-hover:text-primary transition-colors duration-300">
                      {benefit}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}


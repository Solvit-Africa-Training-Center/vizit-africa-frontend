import { processSteps } from "@/lib/dummy-data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-20 max-w-2xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple Process
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            From your first inquiry to landing in Kigali — we orchestrate every
            detail.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={step.step} className="group relative">
              <div className="pt-8 border-t border-border/40 group-hover:border-primary transition-colors duration-500">
                <div className="font-mono text-sm text-primary/50 mb-4 group-hover:text-primary transition-colors">
                  STEP {step.step}
                </div>

                <h3 className="text-2xl font-bold font-display text-foreground mb-3">
                  {step.title}
                </h3>

                <p className="text-muted-foreground font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

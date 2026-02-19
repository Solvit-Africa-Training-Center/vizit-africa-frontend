import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative bg-black">
        <Image
          src="/images/children-dancing-traditional-dances-black-white.jpg"
          alt="Vizit Africa Experience"
          fill
          className="object-cover opacity-60 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

        <div className="absolute bottom-12 left-12 right-12 text-primary-foreground">
          <blockquote className="font-display text-4xl font-medium leading-tight mb-4">
            "The journey of a thousand miles begins with a single step."
          </blockquote>
          <p className="text-primary-foreground/60 font-mono text-sm uppercase tracking-widest">
            Vizit Africa — Concierge Travel
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}

import { RiBookmarkLine, RiCompass3Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";

type Translator = (key: string) => string;

interface SavedItemsTabProps {
  t: Translator;
}

export function SavedItemsTab({ t }: SavedItemsTabProps) {
  return (
    <div className="py-24 px-6 text-center border border-border/50 rounded-3xl bg-muted/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-md mx-auto space-y-8 relative z-10">
        <div className="size-24 bg-card rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/5 border border-border/50">
          <RiBookmarkLine className="size-10 text-primary/40" />
        </div>
        
        <div className="space-y-3">
          <h3 className="font-display text-2xl font-medium text-foreground">
            Curate Your Adventure
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your personal collection of dream destinations and experiences. 
            Explore the landscape and bookmark what inspires you to start building your journey.
          </p>
        </div>

        <Button variant="outline" className="rounded-full gap-2 px-8">
          <RiCompass3Line className="size-4" />
          Explore Rwanda
        </Button>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -left-24 size-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

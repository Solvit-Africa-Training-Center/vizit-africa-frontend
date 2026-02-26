import { RiBookmarkLine, RiCompass3Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";

type Translator = (key: string) => string;

interface SavedItemsTabProps {
  t: Translator;
}

export function SavedItemsTab({ t }: SavedItemsTabProps) {
  return (
    <div className="py-24 px-6 text-center border border-primary/20 rounded-[2.5rem] bg-surface-ink text-white relative overflow-hidden isolate shadow-2xl">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,oklch(65%_0.06_245/0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary-light/40 to-transparent z-10" />

      <div className="max-w-md mx-auto space-y-8 relative z-20">
        <div className="size-24 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary-light/10 border border-white/10">
          <RiBookmarkLine className="size-10 text-primary-light" />
        </div>

        <div className="space-y-3">
          <h3 className="font-display text-2xl font-medium text-white">
            {t("saved.curateTitle")}
          </h3>
          <p className="text-white/70 text-sm leading-relaxed">
            {t("saved.curateDescription")}
          </p>
        </div>

        <Button
          variant="outline"
          className="rounded-full gap-2 px-8 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white transition-all"
        >
          <RiCompass3Line className="size-4" />
          {t("saved.explore")}
        </Button>
      </div>

      {/* Decorative background element */}
      <div className="absolute -bottom-24 -right-24 size-64 bg-primary-light/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute -top-24 -left-24 size-64 bg-primary-light/10 rounded-full blur-3xl pointer-events-none z-0" />
    </div>
  );
}

import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Orb } from "@/components/ui/orb";

export function AiLoading({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("PlanTrip");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const messages = (t.raw("loading.steps") as unknown as string[]) || [
    "Analyzing your preferences...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [messages.length]);

  if (compact) {
    return (
      <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 p-4 rounded-xl animate-in fade-in duration-500">
        <div className="relative size-12 flex-shrink-0">
          <Orb
            colors={["#10B981", "#059669"]}
            agentState="thinking"
            className="w-full h-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-primary font-medium animate-pulse">
            AI is thinking...
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessageIndex}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              className="text-xs text-muted-foreground truncate italic"
            >
              {messages[currentMessageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-16 min-h-[600px] w-full max-w-4xl mx-auto">
      {/* Orb Animation - Top Center */}
      {/* <div className="relative w-[320px] h-[320px] flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full opacity-40 animate-pulse" />
        <Orb
          colors={["#10B981", "#059669"]}
          agentState="thinking"
          className="w-full h-full scale-110"
        />
      </div> */}

      <div className="relative z-10 flex flex-col items-center space-y-6 w-full px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4 w-full"
          >
            <h3 className="text-3xl md:text-4xl font-display font-medium text-foreground tracking-tight uppercase">
              {t("loading.title")}
            </h3>
            <div className="h-6">
              <p className="text-lg text-muted-foreground/60 font-light tracking-wide max-w-md mx-auto italic">
                {messages[currentMessageIndex]}...
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

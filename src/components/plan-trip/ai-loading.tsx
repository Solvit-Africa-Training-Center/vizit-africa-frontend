import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Orb } from "@/components/ui/orb";

export function AiLoading() {
  const t = useTranslations("PlanTrip");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Get messages from translations
  // We need to cast to any or array because next-intl types might differ
  const messages = (t.raw("loading.steps") as unknown as string[]) || [
    "Analyzing your preferences...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-12 min-h-[500px] w-full max-w-2xl mx-auto">
      {/* Orb Animation - Top Center */}
      <div className="relative w-[280px] h-[280px] flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse" />
        <Orb
          colors={["#047857", "#10B981"]}
          agentState="thinking"
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-4 w-full px-4">
        <motion.div
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 w-full"
        >
          <h3 className="text-2xl md:text-3xl font-display font-medium text-foreground tracking-wide">
            {t("loading.title")}
          </h3>
          <p className="text-base text-muted-foreground font-light tracking-wide max-w-md mx-auto h-6">
            {messages[currentMessageIndex]}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

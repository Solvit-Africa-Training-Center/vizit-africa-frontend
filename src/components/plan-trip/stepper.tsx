import { RiCheckLine } from "@remixicon/react";

interface StepperProps {
  currentStep: number;
  steps: { num: number; label: string }[];
  onStepClick: (step: number) => void;
}

export function Stepper({ currentStep, steps, onStepClick }: StepperProps) {
  return (
    <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onStepClick(step.num)}
            className={`flex items-center gap-3 transition-colors group cursor-pointer ${
              currentStep === step.num ? "text-primary" : "text-foreground"
            }`}
          >
            <span
              className={`size-8 flex items-center justify-center text-sm font-medium border transition-all ${
                currentStep === step.num
                  ? "border-primary bg-primary text-white"
                  : currentStep > step.num
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-transparent"
              }`}
            >
              {currentStep > step.num ? (
                <RiCheckLine className="size-4" />
              ) : (
                step.num.toString().padStart(2, "0")
              )}
            </span>
            <span className="font-display font-medium uppercase tracking-wider text-sm">
              {step.label}
            </span>
          </button>
          {i < steps.length - 1 && (
            <div className="w-8 md:w-12 h-px bg-border mx-4" />
          )}
        </div>
      ))}
    </div>
  );
}

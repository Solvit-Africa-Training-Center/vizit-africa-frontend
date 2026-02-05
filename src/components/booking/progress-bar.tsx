interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const steps = ["Flights", "Hotels", "Transport", "Guides", "Payment"];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              {/* step indicator */}
              <div className="flex items-center gap-3">
                <div
                  className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted
                      ? "bg-accent-success text-white"
                      : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <span
                  className={`hidden md:block text-sm ${
                    isCurrent
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
              </div>

              {/* connector line */}
              {stepNumber < totalSteps && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? "bg-accent-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

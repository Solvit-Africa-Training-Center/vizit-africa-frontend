"use client";

import * as React from "react";
import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";
import { mergeProps, useRender } from "@base-ui/react";
import { RiCheckLine, RiLoader2Line } from "@remixicon/react";

type StepperContextValue = {
  activeStep: number;
  setActiveStep: (step: number) => void;
  orientation: "horizontal" | "vertical";
};

type StepItemContextValue = {
  step: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
};

type StepState = "active" | "completed" | "inactive" | "loading";

const StepperContext = createContext<StepperContextValue | undefined>(
  undefined,
);
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined,
);

const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a Stepper");
  }
  return context;
};

const useStepItem = () => {
  const context = useContext(StepItemContext);
  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem");
  }
  return context;
};

interface StepperProps extends useRender.ComponentProps<"div"> {
  defaultValue?: number;
  value?: number;
  onValueChange?: (value: number) => void;
  orientation?: "horizontal" | "vertical";
}

function Stepper({
  defaultValue = 0,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  render,
  ...props
}: StepperProps) {
  const [activeStep, setInternalStep] = React.useState(defaultValue);

  const setActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange],
  );

  const currentStep = value ?? activeStep;

  const defaultProps = {
    className: cn(
      "group/stepper inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
      className,
    ),
    "data-orientation": orientation,
    "data-slot": "stepper",
  };

  return (
    <StepperContext.Provider
      value={{
        activeStep: currentStep,
        orientation,
        setActiveStep,
      }}
    >
      {useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(defaultProps, props),
        render,
      })}
    </StepperContext.Provider>
  );
}

interface StepperItemProps extends useRender.ComponentProps<"div"> {
  step: number;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  render,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper();

  const state: StepState =
    completed || step < activeStep
      ? "completed"
      : activeStep === step
        ? "active"
        : "inactive";

  const isLoading = loading && step === activeStep;

  const defaultProps = {
    className: cn(
      "group/step flex items-center group-data-[orientation=horizontal]/stepper:flex-row group-data-[orientation=vertical]/stepper:flex-col",
      className,
    ),
    "data-slot": "stepper-item",
    "data-state": state,
    ...(isLoading ? { "data-loading": true } : {}),
    children,
  };

  return (
    <StepItemContext.Provider
      value={{ isDisabled: disabled, isLoading, state, step }}
    >
      {useRender({
        defaultTagName: "div",
        props: mergeProps<"div">(defaultProps, props),
        render,
      })}
    </StepItemContext.Provider>
  );
}

interface StepperTriggerProps extends useRender.ComponentProps<"button"> {}

function StepperTrigger({
  className,
  children,
  render,
  ...props
}: StepperTriggerProps) {
  const { setActiveStep } = useStepper();
  const { step, isDisabled } = useStepItem();

  const defaultProps = {
    className: cn(
      "inline-flex items-center gap-3 rounded-full outline-none focus-visible:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
      className,
    ),
    "data-slot": "stepper-trigger",
    disabled: isDisabled,
    onClick: () => setActiveStep(step),
    type: "button" as const,
    children,
  };

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, props),
    render,
  });
}

interface StepperIndicatorProps extends useRender.ComponentProps<"span"> {}

function StepperIndicator({
  className,
  children,
  render,
  ...props
}: StepperIndicatorProps) {
  const { state, step, isLoading } = useStepItem();

  const defaultProps = {
    className: cn(
      "relative flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:text-primary-foreground",
      className,
    ),
    "data-slot": "stepper-indicator",
    "data-state": state,
    children: children ?? (
      <>
        <span className="transition-all group-data-[state=completed]/step:scale-0 group-data-loading/step:scale-0 group-data-[state=completed]/step:opacity-0 group-data-loading/step:opacity-0 group-data-loading/step:transition-none">
          {step}
        </span>
        <RiCheckLine
          aria-hidden="true"
          className="absolute scale-0 opacity-0 transition-all group-data-[state=completed]/step:scale-100 group-data-[state=completed]/step:opacity-100"
          size={16}
        />
        {isLoading && (
          <span className="absolute transition-all">
            <RiLoader2Line
              aria-hidden="true"
              className="animate-spin"
              size={14}
            />
          </span>
        )}
      </>
    ),
  };

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(defaultProps, props),
    render,
  });
}

function StepperTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"h3">) {
  const defaultProps = {
    className: cn("font-medium text-sm", className),
    "data-slot": "stepper-title",
  };

  return useRender({
    defaultTagName: "h3",
    props: mergeProps<"h3">(defaultProps, props),
    render,
  });
}

function StepperDescription({
  className,
  render,
  ...props
}: useRender.ComponentProps<"p">) {
  const defaultProps = {
    className: cn("text-muted-foreground text-sm", className),
    "data-slot": "stepper-description",
  };

  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(defaultProps, props),
    render,
  });
}

function StepperSeparator({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(
      "m-0.5 bg-muted group-data-[orientation=horizontal]/stepper:h-0.5 group-data-[orientation=vertical]/stepper:h-12 group-data-[orientation=horizontal]/stepper:w-full group-data-[orientation=vertical]/stepper:w-0.5 group-data-[orientation=horizontal]/stepper:flex-1 group-data-[state=completed]/step:bg-primary",
      className,
    ),
    "data-slot": "stepper-separator",
  };

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(defaultProps, props),
    render,
  });
}

export {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
};

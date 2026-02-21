"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

const NumberField = NumberFieldPrimitive.Root;

function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      className={cn(
        "flex w-full items-center overflow-hidden rounded-md border border-input bg-background shadow-xs transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        className,
      )}
      {...props}
    />
  );
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      className={cn(
        "h-9 w-full min-w-0 bg-transparent px-3 py-1 text-center text-sm tabular-nums outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed text-foreground opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function NumberFieldDecrement({
  className,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center border-r border-input bg-muted/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RiSubtractLine className="size-4" />
    </NumberFieldPrimitive.Decrement>
  );
}

function NumberFieldIncrement({
  className,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center border-l border-input bg-muted/50 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RiAddLine className="size-4" />
    </NumberFieldPrimitive.Increment>
  );
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
};

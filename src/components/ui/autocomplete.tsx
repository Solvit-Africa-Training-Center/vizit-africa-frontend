"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"
import { RiCloseLine, RiCheckLine } from "@remixicon/react"
import { cn } from "@/lib/utils"

const Autocomplete = AutocompletePrimitive.Root

function AutocompleteTrigger({
  className,
  children,
  ...props
}: AutocompletePrimitive.Trigger.Props) {
  return (
    <AutocompletePrimitive.Trigger
      data-slot="autocomplete-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </AutocompletePrimitive.Trigger>
  )
}

function AutocompleteInput({
  className,
  ...props
}: React.ComponentProps<typeof AutocompletePrimitive.Input>) {
  return (
    <AutocompletePrimitive.Input
      data-slot="autocomplete-input"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

function AutocompleteIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="autocomplete-icon"
      className={cn("flex items-center justify-center", className)}
      {...props}
    />
  )
}

function AutocompleteClear({
  className,
  ...props
}: AutocompletePrimitive.Clear.Props) {
  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      className={cn("flex items-center justify-center opacity-50 hover:opacity-100", className)}
      {...props}
    >
      <RiCloseLine className="h-4 w-4" />
    </AutocompletePrimitive.Clear>
  )
}

function AutocompleteValue({
  className,
  ...props
}: AutocompletePrimitive.Value.Props & { className?: string }) {
  return (
    <span className={cn("truncate", className)} data-slot="autocomplete-value">
      <AutocompletePrimitive.Value {...props} />
    </span>
  )
}

const AutocompletePortal = AutocompletePrimitive.Portal

const AutocompleteBackdrop = AutocompletePrimitive.Backdrop

function AutocompletePositioner({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset = 0,
  ...props
}: AutocompletePrimitive.Positioner.Props) {
  return (
    <AutocompletePrimitive.Positioner
      data-slot="autocomplete-positioner"
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      className={cn("z-50", className)}
      {...props}
    />
  )
}


function AutocompletePopup({
  className,
  ...props
}: AutocompletePrimitive.Popup.Props) {
  return (
    <AutocompletePrimitive.Popup
      data-slot="autocomplete-popup"
      className={cn(
        "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
}

const AutocompleteArrow = AutocompletePrimitive.Arrow

function AutocompleteStatus({
  className,
  ...props
}: AutocompletePrimitive.Status.Props) {
  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn("py-2 px-2 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function AutocompleteEmpty({
  className,
  ...props
}: AutocompletePrimitive.Empty.Props) {
  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
}

function AutocompleteList({
  className,
  ...props
}: AutocompletePrimitive.List.Props) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      className={cn("p-1", className)}
      {...props}
    />
  )
}

function AutocompleteRow({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="autocomplete-row"
      className={cn("flex w-full", className)}
      {...props}
    />
  )
}

function AutocompleteItem({
  className,
  children,
  ...props
}: AutocompletePrimitive.Item.Props) {
  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span className="flex-1 truncate">{children}</span>
      <ComboboxPrimitive.ItemIndicator className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <RiCheckLine className="h-4 w-4" />
      </ComboboxPrimitive.ItemIndicator>
    </AutocompletePrimitive.Item>
  )
}

function AutocompleteSeparator({
  className,
  ...props
}: AutocompletePrimitive.Separator.Props) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
}

function AutocompleteGroup({
  className,
  ...props
}: AutocompletePrimitive.Group.Props) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn("py-1", className)}
      {...props}
    />
  )
}

function AutocompleteGroupLabel({
  className,
  ...props
}: AutocompletePrimitive.GroupLabel.Props) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-group-label"
      className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

function AutocompleteCollection({
  ...props
}: AutocompletePrimitive.Collection.Props) {
  return <AutocompletePrimitive.Collection {...props} />
}

export {
  Autocomplete,
  AutocompleteTrigger,
  AutocompleteInput,
  AutocompleteIcon,
  AutocompleteClear,
  AutocompleteValue,
  AutocompletePortal,
  AutocompleteBackdrop,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteArrow,
  AutocompleteStatus,
  AutocompleteEmpty,
  AutocompleteList,
  AutocompleteRow,
  AutocompleteItem,
  AutocompleteSeparator,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteCollection,
}

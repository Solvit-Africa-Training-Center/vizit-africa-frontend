"use client";

import { RiAddCircleLine, RiCheckLine } from "@remixicon/react";
import type { Column } from "@tanstack/react-table";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = React.useMemo(() => {
    const filterValue = column?.getFilterValue();
    return Array.isArray(filterValue) ? filterValue : [];
  }, [column]);

  const renderValue = React.useCallback(
    (values: string[]) => {
      if (values.length === 0) {
        return (
          <div className="flex items-center">
            <RiAddCircleLine className="mr-2 h-4 w-4 opacity-60" />
            {title}
          </div>
        );
      }

      return (
        <div className="flex items-center">
          <RiAddCircleLine className="mr-2 h-4 w-4 opacity-60" />
          {title}
          <Separator orientation="vertical" className="mx-2 h-4" />
          <Badge
            variant="secondary"
            className="rounded-sm px-1 font-normal lg:hidden"
          >
            {values.length}
          </Badge>
          <div className="hidden space-x-1 lg:flex">
            {values.length > 2 ? (
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {values.length} selected
              </Badge>
            ) : (
              options
                .filter((option) => values.includes(option.value))
                .map((option) => (
                  <Badge
                    variant="secondary"
                    key={option.value}
                    className="rounded-sm px-1 font-normal"
                  >
                    {option.label}
                  </Badge>
                ))
            )}
          </div>
        </div>
      );
    },
    [title, options],
  );

  return (
    <Select
      multiple
      value={selectedValues}
      onValueChange={(values: string[]) => {
        if (values.includes("clear")) {
          column?.setFilterValue(undefined);
          return;
        }
        column?.setFilterValue(values.length ? values : undefined);
      }}
    >
      <SelectTrigger className="h-8 border-dashed border-input bg-transparent hover:bg-accent hover:text-accent-foreground min-w-0 w-auto px-2">
        <SelectValue>{renderValue}</SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[200px]" align="start">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <SelectItem key={option.value} value={option.value}>
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible",
                )}
              >
                <RiCheckLine className="h-4 w-4" />
              </div>
              {option.icon && (
                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{option.label}</span>
              {facets?.get(option.value) && (
                <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                  {facets.get(option.value)}
                </span>
              )}
            </SelectItem>
          );
        })}
        {selectedValues.length > 0 && (
          <>
            <SelectSeparator />
            <SelectItem
              value="clear"
              className="justify-center text-center font-medium"
            >
              Clear filters
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
}

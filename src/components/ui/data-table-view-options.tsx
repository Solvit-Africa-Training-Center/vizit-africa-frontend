"use client";

import { RiEqualizerLine } from "@remixicon/react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const { columnVisibility } = table.getState();
  const allHideableColumns = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          />
        }
      >
        <RiEqualizerLine className="mr-2 h-4 w-4 opacity-60" />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allHideableColumns.map((column) => {
            const header = column.columnDef.header;
            const title = typeof header === "string" ? header : column.id;
            const label = title || column.id;

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={columnVisibility[column.id] !== false}
                onCheckedChange={(checked: boolean) => {
                  column.toggleVisibility(!!checked);
                }}
              >
                {label.replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

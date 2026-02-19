"use client";

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
  type PaginationState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiCloseLine,
} from "@remixicon/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DataTableFacetedFilter } from "@/components/ui/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";

export type DataTableState = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
};

export type DataTableCallbacks = {
  onStateChange: (state: Partial<DataTableState>) => void;
};

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableFilterField {
  label: string;
  value: string;
  options: FilterOption[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterFields?: DataTableFilterField[];
  searchPlaceholder?: string;
  searchColumn?: string;
  state: DataTableState;
  callbacks: DataTableCallbacks;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterFields = [],
  searchPlaceholder = "Filter...",
  searchColumn,
  state,
  callbacks,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
      pagination: state.pagination,
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(state.sorting) : updater;
      callbacks.onStateChange({ sorting: next });
    },
    onColumnFiltersChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(state.columnFilters)
          : updater;
      callbacks.onStateChange({ columnFilters: next });
    },
    onColumnVisibilityChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(state.columnVisibility)
          : updater;
      callbacks.onStateChange({ columnVisibility: next });
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(state.rowSelection)
          : updater;
      callbacks.onStateChange({ rowSelection: next });
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(state.pagination) : updater;
      callbacks.onStateChange({ pagination: next });
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // Keep manual processing false so tanstack-table handles it locally
    manualPagination: false,
    manualSorting: false,
    manualFiltering: false,
  });

  const isFiltered = state.columnFilters.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          {searchColumn && (
            <div className="relative">
              <Input
                placeholder={searchPlaceholder}
                value={
                  (table.getColumn(searchColumn)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(searchColumn)
                    ?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
                disabled={isLoading}
              />
            </div>
          )}
          {filterFields.map((field) => {
            const column = table.getColumn(field.value);
            return (
              column && (
                <DataTableFacetedFilter
                  key={field.value}
                  column={column}
                  title={field.label}
                  options={field.options}
                />
              )
            );
          })}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
              disabled={isLoading}
            >
              Reset
              <RiCloseLine className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {isLoading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Rows per page</Label>
            <Select
              value={`${state.pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={state.pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {state.pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <span className="sr-only">Go to first page</span>
              <RiArrowLeftDoubleLine className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <span className="sr-only">Go to previous page</span>
              <RiArrowLeftSLine className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <span className="sr-only">Go to next page</span>
              <RiArrowRightSLine className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <span className="sr-only">Go to last page</span>
              <RiArrowRightDoubleLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

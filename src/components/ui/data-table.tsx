"use client";

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Search,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface FilterConfig {
  columnId: string;
  title: string;
  options: FilterOption[];
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultPageSize?: number;
  filters?: FilterConfig[];
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultPageSize = 10,
  filters = [],
  searchPlaceholder = "Search all columns...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // memoize data to prevent infinite re-renders (per skill guidance)
  const memoizedData = useMemo(() => data, [data]);
  const memoizedColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    },
  });

  const isFiltered =
    table.getState().columnFilters.length > 0 || globalFilter.length > 0;

  const activeFilterCount = table.getState().columnFilters.length;

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {/* search input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) =>
                table.setGlobalFilter(String(event.target.value))
              }
              className="pl-9 pr-4 h-10 bg-background"
            />
            {globalFilter && (
              <button
                type="button"
                onClick={() => setGlobalFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* filters */}
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId);
            if (!column) return null;

            const selectedValue = column.getFilterValue() as string;
            const selectedOption = filter.options.find(
              (o) => o.value === selectedValue,
            );

            return (
              <Select
                key={filter.columnId}
                value={selectedValue ?? "all"}
                onValueChange={(value) => {
                  column.setFilterValue(value === "all" ? undefined : value);
                }}
              >
                <SelectTrigger className="w-auto min-w-[140px] h-10 gap-2 bg-background">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {filter.title}:
                    </span>
                    <span className="font-medium">
                      {selectedOption?.label ?? "All"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="all">
                    <span className="font-medium">All {filter.title}</span>
                  </SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          })}
        </div>

        {/* active filters + reset */}
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-6 gap-1">
              <Filter className="h-3 w-3" />
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </Badge>
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              size={"sm"}
              onClick={() => {
                table.resetColumnFilters();
                setGlobalFilter("");
              }}
              className="text-muted-foreground"
            >
              Reset
              <X />
            </Button>
          )}
        </div>
      </div>

      {/* table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/40 hover:bg-muted/40 border-b border-border"
              >
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      style={
                        header.column.getSize() !== 150
                          ? { width: header.column.getSize() }
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : isSortable ? (
                        <button
                          type="button"
                          className="flex items-center gap-1.5 hover:text-foreground transition-colors -ml-1 px-1 py-0.5 rounded"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sortDirection === "asc" ? (
                            <ChevronUpIcon className="h-4 w-4" />
                          ) : sortDirection === "desc" ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
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
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 opacity-40" />
                    <p>No results found.</p>
                    {isFiltered && (
                      <Button
                        variant="link"
                        size={"sm"}
                        onClick={() => {
                          table.resetColumnFilters();
                          setGlobalFilter("");
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination footer */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>
          {" - "}
          <span className="font-medium text-foreground">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getRowCount(),
            )}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {table.getRowCount()}
          </span>{" "}
          results
        </p>

        <div className="flex items-center gap-2">
          {/* rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* page navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

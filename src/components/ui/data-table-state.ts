import type { DataTableState } from "@/components/ui/data-table";

export function createDefaultDataTableState(pageSize = 10): DataTableState {
  return {
    sorting: [],
    columnFilters: [],
    columnVisibility: {},
    rowSelection: {},
    pagination: { pageIndex: 0, pageSize },
  };
}

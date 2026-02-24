export type BaseItem = Record<string, unknown> & {
  id?: string | number;
  title?: string;
  type?: string;
  itemType?: string;
  quantity?: number;
  unitPrice?: number | string;
  price?: number | string;
  startDate?: string | null;
  endDate?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  returnDate?: string | null;
  returnTime?: string | null;
  isRoundTrip?: boolean;
  withDriver?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
};

export interface ItineraryItemProps {
  item: BaseItem;
  mode?: "view" | "edit" | "admin" | "vendor";
  onRemove?: () => void;
  onUpdate?: (updates: Partial<BaseItem>) => void;
  onAction?: () => void;
  actionLabel?: string;
  isActionLoading?: boolean;
  defaultValues?: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    returnDate?: string;
    returnTime?: string;
  };
}

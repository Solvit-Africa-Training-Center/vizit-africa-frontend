import { type PackageItem } from "@/lib/store/package-store";

export interface QuoteBreakdown {
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
  itemsByType: Record<string, { count: number; subtotal: number }>;
}

const toNumber = (v: any) => Number(v) || 0;

export function calculateQuoteTotal(items: PackageItem[]): number {
  return items.reduce((sum, item) => {
    const qty = toNumber(item.quantity || 1);
    const price = toNumber(
      item.quotePrice ?? item.unitPrice ?? item.price ?? 0,
    );
    return sum + qty * price;
  }, 0);
}

export function calculateQuoteBreakdown(
  items: PackageItem[],
  taxRate: number = 0.18,
  serviceFeePercent: number = 0.05,
): QuoteBreakdown {
  const itemsByType: Record<string, { count: number; subtotal: number }> = {};

  items.forEach((item) => {
    const type = item.type as string;
    const qty = toNumber(item.quantity || 1);
    const price = toNumber(
      item.quotePrice ?? item.unitPrice ?? item.price ?? 0,
    );
    const itemTotal = qty * price;

    if (!itemsByType[type]) {
      itemsByType[type] = { count: 0, subtotal: 0 };
    }
    itemsByType[type].count += 1;
    itemsByType[type].subtotal += itemTotal;
  });

  const subtotal = Object.values(itemsByType).reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );
  const tax = subtotal * taxRate;
  const serviceFee = subtotal * serviceFeePercent;
  const total = subtotal + tax + serviceFee;

  return {
    subtotal,
    tax,
    serviceFee,
    total,
    itemsByType,
  };
}

export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getQuoteSummaryText(breakdown: QuoteBreakdown): string {
  return `Subtotal: ${formatCurrency(breakdown.subtotal)} + Tax: ${formatCurrency(breakdown.tax)} + Fee: ${formatCurrency(breakdown.serviceFee)} = ${formatCurrency(breakdown.total)}`;
}

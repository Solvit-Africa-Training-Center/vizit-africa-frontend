import { describe, it, expect } from 'vitest';
import { calculateQuoteBreakdown, formatCurrency } from '../utils/quote-calculator';
import { type PackageItem } from '../store/package-store';

describe('Quote Calculations', () => {
  const mockItems: PackageItem[] = [
    { id: 1, type: 'flight', quotePrice: 1000, quantity: 1 },
    { id: 2, type: 'hotel', quotePrice: 500, quantity: 1 },
  ];

  it('should calculate correct breakdown totals', () => {
    const breakdown = calculateQuoteBreakdown(mockItems, 0.18, 0.05);
    
    expect(breakdown.subtotal).toBe(1500);
    expect(breakdown.tax).toBe(1500 * 0.18);
    expect(breakdown.serviceFee).toBe(1500 * 0.05);
    expect(breakdown.total).toBe(1500 + (1500 * 0.18) + (1500 * 0.05));
    
    expect(breakdown.itemsByType['flight'].subtotal).toBe(1000);
    expect(breakdown.itemsByType['hotel'].subtotal).toBe(500);
  });

  it('should format currency correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    // Note: Vitest environment might vary locale, but USD usually matches $1,234.56
  });
});

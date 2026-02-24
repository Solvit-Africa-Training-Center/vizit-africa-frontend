import { describe, it, expect } from 'vitest';
import { 
  bookingSchema, 
  serviceSchema, 
  quoteSchema, 
  bookingItemSchema 
} from '../unified-types';

describe('Schema Validation', () => {
  it('should validate a complete booking item with all fields', () => {
    const validItem = {
      id: "item-123",
      item_type: "flight",
      title: "Flight to Kigali",
      quantity: 1,
      unit_price: 500,
      subtotal: 500,
      start_date: "2026-03-01",
      end_date: "2026-03-01",
      with_driver: false,
      is_round_trip: true,
      metadata: { airline: "RwandAir" }
    };

    const result = bookingItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it('should validate a service with nested vendor', () => {
    const validService = {
      id: 1,
      title: "Luxury Safari",
      service_type: "tour",
      description: "A great safari experience",
      base_price: 1500,
      currency: "USD",
      capacity: 4,
      status: "active",
      vendor: {
        id: 10,
        business_name: "Safari Pros",
        is_approved: true
      }
    };

    const result = serviceSchema.safeParse(validService);
    expect(result.success).toBe(true);
  });

  it('should validate a quote within a booking', () => {
    const validQuote = {
      status: "quoted",
      currency: "USD",
      totalAmount: 2000,
      items: [
        {
          id: 1,
          item_type: "hotel",
          quantity: 2,
          unit_price: 1000,
          subtotal: 2000
        }
      ]
    };

    const result = quoteSchema.safeParse(validQuote);
    expect(result.success).toBe(true);
  });

  it('should validate a full booking object', () => {
    const fullBooking = {
      id: "booking-789",
      name: "John Doe",
      email: "john@example.com",
      phone: "+123456789",
      travelers: 2,
      adults: 2,
      children: 0,
      infants: 0,
      status: "pending",
      currency: "USD",
      total_amount: 0,
      items: [],
      createdAt: "2026-02-24T10:00:00Z"
    };

    const result = bookingSchema.safeParse(fullBooking);
    expect(result.success).toBe(true);
  });
});

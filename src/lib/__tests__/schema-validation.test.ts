import { describe, it, expect } from 'vitest';
import { 
  bookingSchema, 
  serviceSchema, 
  bookingItemSchema 
} from '../unified-types';

describe('Schema Validation', () => {
  it('should validate a complete booking item with all fields', () => {
    const validItem = {
      id: "item-123",
      itemType: "flight",
      title: "Flight to Kigali",
      quantity: 1,
      unitPrice: 500,
      subtotal: 500,
      startDate: "2026-03-01",
      endDate: "2026-03-01",
      withDriver: false,
      isRoundTrip: true,
      metadata: { airline: "RwandAir" }
    };

    const result = bookingItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it('should validate a service with nested vendor', () => {
    const validService = {
      id: 1,
      title: "Luxury Safari",
      serviceType: "tour",
      description: "A great safari experience",
      basePrice: 1500,
      currency: "USD",
      capacity: 4,
      status: "active",
      vendor: {
        id: 10,
        businessName: "Safari Pros",
        isApproved: true
      }
    };

    const result = serviceSchema.safeParse(validService);
    expect(result.success).toBe(true);
  });

  it('should validate a full booking object', () => {
    const fullBooking = {
      id: "booking-789",
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "+123456789",
      travelers: 2,
      adults: 2,
      children: 0,
      infants: 0,
      status: "pending",
      currency: "USD",
      totalAmount: 0,
      items: [],
      createdAt: "2026-02-24T10:00:00Z"
    };

    const result = bookingSchema.safeParse(fullBooking);
    expect(result.success).toBe(true);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPaymentIntent, confirmStripePayment } from '../payments';
import { api } from '@/lib/api/simple-client';

// Mock the API client
vi.mock('@/lib/api/simple-client', () => ({
  api: {
    post: vi.fn(),
  },
  ApiError: class extends Error {
    constructor(message: string, public status: number) {
      super(message);
    }
  }
}));

describe('Payment Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call create-intent endpoint with booking_id', async () => {
    const mockResponse = { 
      client_secret: 'secret_123', 
      payment_intent_id: 'pi_123' 
    };
    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const result = await createPaymentIntent('booking-456');

    expect(api.post).toHaveBeenCalledWith(
      '/payments/stripe/create-intent/',
      { booking_id: 'booking-456' }
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.client_secret).toBe('secret_123');
    }
  });

  it('should call confirm endpoint with intent and method IDs', async () => {
    const mockResponse = { status: 'succeeded' };
    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const result = await confirmStripePayment('pi_123', 'pm_123');

    expect(api.post).toHaveBeenCalledWith(
      '/payments/stripe/confirm/',
      {
        payment_intent_id: 'pi_123',
        payment_method_id: 'pm_123'
      }
    );
    expect(result.success).toBe(true);
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('Network error'));

    const result = await createPaymentIntent('booking-456');

    expect(result.success).toBe(false);
    expect(result.error).toBe('Failed to create payment intent');
  });
});

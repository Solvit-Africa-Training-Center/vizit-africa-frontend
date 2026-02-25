import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendQuoteForBooking, notifyVendor } from '../bookings';
import { api } from '@/lib/api/simple-client';

// Mock the API client
vi.mock('@/lib/api/simple-client', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
  ApiError: class extends Error {
    constructor(message: string, public status: number) {
      super(message);
    }
  }
}));

describe('Booking Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the correct endpoint when sending a quote', async () => {
    const mockResponse = { success: true, message: 'Quote sent' };
    vi.mocked(api.post).mockResolvedValue(mockResponse);

    const result = await sendQuoteForBooking('booking-123', 1500, [{ id: 1, title: 'Test' }]);

    expect(api.post).toHaveBeenCalledWith(
      '/bookings/booking-123/quote/',
      expect.objectContaining({
        booking_id: 'booking-123',
        amount: 1500,
        items: expect.arrayContaining([expect.objectContaining({ title: 'Test' })])
      })
    );
    expect(result.success).toBe(true);
  });

  it('should return error if API call fails', async () => {
    vi.mocked(api.post).mockRejectedValue(new Error('API failure'));

    const result = await sendQuoteForBooking('booking-123', 1500, []);

    expect(result.success).toBe(false);
    expect((result as any).error).toBe('Failed to send quote');
  });

  it('should call notifyVendor with correct payload', async () => {
    vi.mocked(api.post).mockResolvedValue({ success: true, message: 'Vendor notified' });

    const result = await notifyVendor('booking-1', 'item-1', 'service-1', { note: 'test' });

    expect(api.post).toHaveBeenCalledWith(
      expect.stringContaining('notify-vendor'),
      expect.objectContaining({
        booking_id: 'booking-1',
        item_id: 'item-1',
        service_id: 'service-1',
        note: 'test'
      })
    );
    expect(result.success).toBe(true);
  });
});

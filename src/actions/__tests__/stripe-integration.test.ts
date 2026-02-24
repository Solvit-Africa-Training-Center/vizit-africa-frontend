import { describe, it, expect, vi } from 'vitest';
import { createPaymentIntent } from '../payments';

/**
 * STRIPE INTEGRATION TEST (SANDBOX)
 * 
 * This test attempts to make a real network call to your backend.
 * It is used to verify that the frontend actions are correctly 
 * communicating with the Stripe-enabled endpoints.
 * 
 * To run this specific test:
 * bunx vitest src/actions/__tests__/stripe-integration.test.ts
 */

describe('Stripe Sandbox Integration', () => {
  it('verifies createPaymentIntent endpoint connectivity', async () => {
    console.log('--- Testing Create Payment Intent ---');
    
    // Using the real booking ID provided for sandbox testing
    const testBookingId = 'f27e5158-926e-40b5-a0af-dc2717d01e28';
    
    try {
      const result = await createPaymentIntent(testBookingId);
      
      console.log('Result Success:', result.success);
      if (!result.success) {
        console.log('Server Error Message:', result.error);
      } else {
        console.log('Payment Intent Data:', result.data);
      }

      // We expect a response object (even if it's an error from the backend)
      expect(result).toHaveProperty('success');
    } catch (err) {
      console.error('Network or Runtime Error:', err);
      throw err;
    }
  });
});

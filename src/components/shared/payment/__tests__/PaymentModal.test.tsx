import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentModal } from '../PaymentModal';
import { createPaymentIntent } from '@/actions/payments';

// Mock dependencies
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn().mockResolvedValue({}),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: any) => <div>{children}</div>,
  useStripe: () => ({}),
  useElements: () => ({}),
  PaymentElement: () => <div data-testid="payment-element" />,
}));

vi.mock('@/actions/payments', () => ({
  createPaymentIntent: vi.fn(),
}));

describe('PaymentModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    amount: 1000,
    currency: 'USD',
    clientEmail: 'test@example.com',
    travelerName: 'John Doe',
    bookingId: 'booking-123',
    onPaymentSuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders payment details initially', () => {
    render(<PaymentModal {...defaultProps} />);
    
    expect(screen.getByText('Complete Payment')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Payment')).toBeInTheDocument();
  });

  it('calls createPaymentIntent and switches to card step when "Proceed" is clicked', async () => {
    vi.mocked(createPaymentIntent).mockResolvedValue({
      success: true,
      data: { client_secret: 'secret_123', payment_intent_id: 'pi_123' }
    });

    render(<PaymentModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Proceed to Payment'));

    await waitFor(() => {
      expect(createPaymentIntent).toHaveBeenCalledWith('booking-123');
    });

    expect(screen.getByText('Enter your payment information')).toBeInTheDocument();
  });

  it('handles initialization failure', async () => {
    vi.mocked(createPaymentIntent).mockResolvedValue({
      success: false,
      error: 'Failed to initialize'
    });

    render(<PaymentModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Proceed to Payment'));

    await waitFor(() => {
      expect(screen.getByText('Payment Initialization Failed')).toBeInTheDocument();
    });
    expect(screen.getByText('Failed to initialize')).toBeInTheDocument();
  });
});

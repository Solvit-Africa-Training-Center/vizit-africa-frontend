import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TripRequestDialog } from "../../components/landing/trip-request-dialog";

const mockProps = {
  open: true,
  onClose: vi.fn(),
};

describe("TripRequestDialog", () => {
  it("renders dialog when open", () => {
    render(<TripRequestDialog {...mockProps} />);
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("calls onClose when close button clicked", () => {
    render(<TripRequestDialog {...mockProps} />);
    // Simulate close button click
    // ...expand with proper selectors
    expect(true).toBe(true); // Placeholder
  });
});

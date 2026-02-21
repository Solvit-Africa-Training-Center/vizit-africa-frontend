/**
 * FRONTEND USAGE EXAMPLES
 * 
 * Shows how to use the new simplified API client and data fetching
 */

// ============================================================================
// EXAMPLE 1: Using the API Client Directly
// ============================================================================

import { api } from "@/lib/api/simple-client";
import { userSchema, serviceSchema } from "@/lib/unified-types";

// GET request
async function getUserProfile() {
  try {
    const user = await api.get("/accounts/users/profile/", userSchema);
    console.log("User:", user);
    return user;
  } catch (error) {
    console.error("Failed to fetch profile:", error.message);
    return null;
  }
}

// POST request
async function createService(data: any) {
  try {
    const result = await api.post(
      "/services/",
      data,
      serviceSchema,
      { requiresAuth: true }
    );
    return result;
  } catch (error) {
    console.error("Failed to create service:", error.details);
    return null;
  }
}

// PATCH request
async function updateUser(userId: string, updates: any) {
  try {
    const result = await api.patch(
      `/accounts/users/${userId}/`,
      updates,
      userSchema
    );
    return result;
  } catch (error) {
    console.error("Update failed:", error.message);
    throw error;
  }
}

// DELETE request
async function deleteBooking(bookingId: string) {
  try {
    await api.delete(`/bookings/${bookingId}/`);
    console.log("Booking deleted");
  } catch (error) {
    console.error("Delete failed:", error.message);
  }
}

// ============================================================================
// EXAMPLE 2: Using Pre-built Data Fetching Functions
// ============================================================================

import {
  getBookings,
  getBookingById,
  getServices,
  getServiceById,
  getVendors,
  getUserProfile,
} from "@/lib/simple-data-fetching";

// Server component
export default async function BookingsPage() {
  // Automatically handles errors, caching, revalidation
  const bookings = await getBookings();
  const services = await getServices();

  return (
    <div>
      <h1>Bookings ({bookings.length})</h1>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>{booking.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: In a React Hook (Client Component)
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/simple-client";
import type { Service } from "@/lib/unified-types";
import { serviceSchema } from "@/lib/unified-types";

export function ServiceDetail({ serviceId }: { serviceId: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadService() {
      try {
        setLoading(true);
        const data = await api.get(
          `/services/${serviceId}/`,
          serviceSchema,
          { requiresAuth: false }
        );
        setService(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load service");
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [serviceId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!service) return <div>Not found</div>;

  return (
    <div>
      <h1>{service.title}</h1>
      <p>{service.description}</p>
      <p>Price: {service.base_price} {service.currency}</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Form Submission
// ============================================================================

"use client";

import { useState } from "react";
import { api } from "@/lib/api/simple-client";
import type { ApiError } from "@/lib/api/simple-client";

export function CreateServiceForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    base_price: 0,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      await api.post("/services/", formData);
      setMessage("Service created successfully!");
      setFormData({ title: "", description: "", base_price: 0 });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.details) {
          // Validation errors
          setErrors(error.details as Record<string, string[]>);
        } else {
          // Generic error
          setMessage(`Error: ${error.message}`);
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && <div className="alert">{message}</div>}

      <div>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />
        {errors.title && <span className="error">{errors.title[0]}</span>}
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        {errors.description && (
          <span className="error">{errors.description[0]}</span>
        )}
      </div>

      <div>
        <label>Price</label>
        <input
          type="number"
          value={formData.base_price}
          onChange={(e) =>
            setFormData({ ...formData, base_price: Number(e.target.value) })
          }
        />
        {errors.base_price && (
          <span className="error">{errors.base_price[0]}</span>
        )}
      </div>

      <button type="submit">Create Service</button>
    </form>
  );
}

// ============================================================================
// EXAMPLE 5: Using Types for Type Safety
// ============================================================================

import type {
  User,
  Service,
  Booking,
  ApiResponse,
} from "@/lib/unified-types";

// Type-safe function
async function processBooking(
  booking: Booking
): Promise<{ success: boolean; message: string }> {
  try {
    // API response is typed as ApiResponse<Booking>
    const result: ApiResponse<Booking> = await api.post(
      "/bookings/confirm/",
      {
        id: booking.id,
        status: "confirmed",
      }
    );

    return {
      success: result.success,
      message: result.message || "Booking processed",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// EXAMPLE 6: File Upload (FormData)
// ============================================================================

"use client";

import { api } from "@/lib/api/simple-client";

export function FileUploadForm() {
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media_url", file);
    formData.append("media_type", "image");
    formData.append("service", "123");

    try {
      await api.postFormData("/services/media/", formData);
      alert("File uploaded successfully!");
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    }
  }

  return (
    <input
      type="file"
      accept="image/*,video/*"
      onChange={handleFileUpload}
    />
  );
}

// ============================================================================
// KEY PATTERNS
// ============================================================================

/**
 * 1. API CLIENT - Direct HTTP calls
 *    - Use when you need full control
 *    - Handles auth, errors, validation
 *    - api.get(), api.post(), api.patch(), etc.
 *
 * 2. DATA FETCHING - Pre-built functions
 *    - Use for common operations
 *    - Includes caching and revalidation
 *    - getBookings(), getServices(), etc.
 *
 * 3. TYPES - Type safety
 *    - Import from unified-types.ts
 *    - Single source of truth
 *    - No manual schema duplication
 *
 * 4. ERROR HANDLING - Consistent
 *    - ApiError class with details
 *    - Validation errors in details field
 *    - Always has message and code
 *
 * 5. ASYNC/AWAIT - Clean syntax
 *    - Use try/catch for error handling
 *    - No callback hell
 *    - Easy to debug
 */

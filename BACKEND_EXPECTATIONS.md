# Technical Specification & API Reference (Finalized)

This document serves as the **single source of truth** for the synchronized Vizit Africa Backend. It outlines the architectural flow, data models, and detailed request/response structures required for the "concierge-level" trip planning experience.

## 1. Architectural Overview
The system handles a "Lead-to-Booking" lifecycle:
*   **Flexibility**: Guest requests are stored in a `guest_info` JSON blob on the Booking model to capture varying preferences.
*   **Persistence**: Once a quote is accepted, preferences are "hardened" into `BookingItem` records with specific timing and metadata.
*   **Vendor Intelligence**: Vendors are categorized as **Active** (login access) or **Passive** (admin-managed), with automated filtering by service type.

---

## 2. Core API Endpoints

### A. Trip Submission (Guest Flow)
**Endpoint:** `POST /api/bookings/submit-trip/`  
**Access:** `AllowAny`

**Request Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+123456789",
  "departureCity": "New York",
  "destination": "Kigali, Rwanda",
  "departureDate": "2025-06-01",
  "arrivalTime": "14:30",
  "departureTime": "09:00",
  "returnDate": "2025-06-10",
  "returnTime": "18:00",
  "roundTrip": true,
  "adults": 2,
  "children": 1,
  "infants": 1,
  "tripPurpose": "Leisure / Safari",
  "specialRequests": "Vegetarian, high floor.",
  "needsFlights": true,
  "needsHotel": true,
  "needsCar": false,
  "needsGuide": true,
  "preferredCabinClass": "business",
  "hotelStarRating": "5",
  "carTypePreference": "4x4",
  "budgetBracket": "luxury",
  "guideLanguages": ["English", "French"],
  "items": [
    {
      "service": "uuid-of-service",
      "type": "hotel",
      "title": "Kigali Luxury Retreat",
      "quantity": 1,
      "start_date": "2025-06-01",
      "end_date": "2025-06-05",
      "start_time": "14:00",
      "end_time": "11:00",
      "metadata": { "room_type": "King Suite" }
    }
  ]
}
```

### B. Admin Quoting Flow
**Endpoint:** `POST /api/bookings/:id/quote/`  
**Access:** `IsAdmin`

**Request Payload:**
```json
{
  "items": [
    {
      "service_id": "uuid",
      "title": "Gorilla Trekking Permit",
      "unit_price": 1500.00,
      "quantity": 2,
      "type": "experience",
      "start_date": "2025-06-06",
      "start_time": "08:00"
    }
  ]
}
```

### C. Vendor Management
1.  **Registration**: `POST /api/vendors/register/`
2.  **Dashboard Stats**: `GET /api/vendors/dashboard/`
3.  **Specific Requests**: `GET /api/vendors/requests/`
    *   *Note: Filters automatically by the vendor's assigned service types.*

### D. Availability Check
**Endpoint:** `POST /api/services/check-availability/`  
**Access:** `AllowAny` or `IsAuthenticated`

---

## 3. Data Model Enhancements

| Model | New/Updated Fields | Purpose |
| :--- | :--- | :--- |
| **Vendor** | `status`, `is_system_user` | Manages active vs. passive dashboard access. |
| **Booking** | `guest_info` (JSON) | Persists all frontend preferences and demographics. |
| **BookingItem** | `start_time`, `end_time`, `return_time`, `is_round_trip` | Full itinerary detail for every item. |

---

## 4. Access & Credentials
*   **Superuser Email**: `admin@vizit.africa`
*   **Password**: `password123`
*   **Database Reset**: `python3 manage.py reset_db`

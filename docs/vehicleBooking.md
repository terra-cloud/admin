# Vehicle Bookings Management

## Overview

The Vehicle Bookings Management pages at `/vehicle-bookings` provide a full admin dashboard for managing all vehicle rental booking transactions on the platform. It reads from the `vehicle-bookings` Firestore collection using real-time subscriptions and can optionally merge related `vehicle-listings` data.

Routes (`src/router/vehicleBookings.js`):

| Path | Component | Name |
|------|-----------|------|
| `/vehicle-bookings` | `@/pages/vehicle-bookings/index.vue` | `vehicleBookings` |
| `/vehicle-bookings/:id` | `@/pages/vehicle-bookings/_id.vue` | `vehicleBookingDetails` |

All routes require auth and use `LayoutDefault`.

---

## Firestore Collections

### `vehicle-bookings`

Primary collection. Each document represents a booking for a vehicle rental between a lessee and the platform.

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID |
| `vehicleRentalId` | string | References a document in `vehicle-listings` |
| `status` | string | One of: `pending`, `active`, `completed`, `cancelled` |
| `driveType` | string | `selfDrive` or `withDriver` |
| `deposit_amount` | number | Security deposit amount |
| `extension_per_hour` | number | Extension fee per hour |
| `penalty_per_hour` | number | Penalty fee per hour |
| `completionCode` | string/null | Code generated on completion |
| `qr_hash` | string | Unique hash for QR code generation |
| `pricing` | map | Contains `price` (number) and `timeRate` (string: `eightHours`, `twelveHours`, `twentyFourHours`) |
| `lessee` | map | Lessee user data (see below) |
| `rental_details` | map | Vehicle info + location data at time of booking (see below) |
| `checkInData` | map/null | Check-in inspection data (see below) |
| `checkOutData` | map/null | Check-out inspection data (see below) |
| `createdAt` | timestamp | When the booking was created |
| `updatedAt` | timestamp | When the booking was last updated |

#### `lessee` sub-fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | User ID |
| `name` | string | Lessee first name |
| `lastName` | string | Lessee last name |
| `phoneNumber` | string | Contact number |
| `address` | string | Full address |
| `emergencyName` | string | Emergency contact first name |
| `emergencyLastName` | string | Emergency contact last name |
| `emergencyContact` | string | Emergency contact number |

#### `rental_details` sub-fields

| Field | Type | Description |
|-------|------|-------------|
| `info` | map | Vehicle snapshot: `brand`, `model`, `year`, `plateNumber`, `type`, `transmission`, `fuelType`, `engineCapacity`, `seatingCapacity`, `odoMeter`, `images[]` |
| `location` | map | Contains `coordinates` (string: `lat,lng`) and `details` (address breakdown: `address`, `barangay`, `province`, `region`, `country`) |

#### `checkInData` sub-fields

| Field | Type | Description |
|-------|------|-------------|
| `fuelLevel` | string | Fuel level at check-in |
| `odometer` | number | Odometer reading at check-in |
| `photos` | array<string> | Array of photo URLs |
| `timestamp` | string | ISO timestamp of check-in |
| `lesseeSignedAt` | string | ISO timestamp of lessee signature |

#### `checkOutData` sub-fields

| Field | Type | Description |
|-------|------|-------------|
| `fuelLevel` | string | Fuel level at return |
| `odometer` | number | Odometer reading at return |
| `returnCondition` | string | Condition description |
| `photos` | array<string> | Array of return photo URLs |
| `timestamp` | string | ISO timestamp of check-out |

### `vehicle-listings` (referenced via `vehicleRentalId`)

Related collection optionally fetched for each booking. Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID (matches `vehicleRentalId`) |
| `brand` | string | Vehicle brand |
| `model` | string | Vehicle model |
| `year` | number | Vehicle year |
| `type` | string | Vehicle type (motorcycle, car, etc.) |
| `status` | string | Listing status |
| `images` | array<string> | Array of image URLs |

---

## Implementation Details

### Data Service

**File:** `src/services/VehicleBookingsDataService.js`

Singleton service following the same pattern as `VehicleListingsDataService` and `ServiceBookingsDataService`.

| Method | Type | Description |
|--------|------|-------------|
| `getAll(callback, errorCallback)` | Real-time (`onSnapshot`) | Returns all bookings ordered by `createdAt` desc. Auto-fallbacks to unordered query if composite index doesn't exist. |
| `getById(id)` | Async | Fetches single booking by Firestore document ID |
| `getVehicleListing(rentalId)` | Async | Fetches related vehicle listing by `vehicleRentalId` |
| `updateStatus(id, data)` | Async | Updates booking fields + sets `updatedAt` timestamp |
| `approveBooking(id)` | Async | Sets status to `active` |
| `cancelBooking(id)` | Async | Sets status to `cancelled` |
| `completeBooking(id)` | Async | Sets status to `completed` |
| `delete(id)` | Async | Deletes a booking document |
| `getStats()` | Async | Returns counts by status (total, active, pending, completed, cancelled) |
| `getFilteredCount(filters)` | Async | Count documents matching status filter |
| `getPaginated(itemsPerPage, lastDoc, sortField, sortDir)` | Query builder | Returns paginated query reference for cursor-based pagination |
| `getRealtime(q, callback, errorCallback)` | Real-time (`onSnapshot`) | Attaches real-time listener to a pre-built query |

### Reusable Components

**Folder:** `src/components/vehicle-bookings/`

All components use Vue Options API.

| Component | File | Description |
|-----------|------|-------------|
| `BookingStatusBadge` | `BookingStatusBadge.vue` | Colored status badge with dot — active (blue), pending (amber), completed (green), cancelled (red) |
| `BookingTable` | `BookingTable.vue` | Desktop table with sticky header, 9 columns, hover effects, action dropdown menu (View, Approve, Cancel, Complete, Print) |
| `BookingCard` | `BookingCard.vue` | Mobile card layout with vehicle thumbnail, status badge, metadata grid, "View Details" link |
| `BookingFilters` | `BookingFilters.vue` | Search input (booking ID, plate, lessee name, phone) + 3 filter dropdowns (status, drive type, vehicle type) |
| `BookingInfoCard` | `BookingInfoCard.vue` | Generic labeled info card with optional icon and title |
| `VehicleGallery` | `VehicleGallery.vue` | Responsive image grid (hero + thumbnails) with fullscreen lightbox, prev/next navigation |
| `LesseeCard` | `LesseeCard.vue` | Lessee profile card with avatar initials, name, phone, address, emergency contact |
| `BookingTimeline` | `BookingTimeline.vue` | Activity timeline with icon circles, connecting lines, active/inactive states |
| `BookingActions` | `BookingActions.vue` | Contextual action buttons — Approve (pending), Complete (active), Cancel (pending/active), Print (always) |
| `BookingSkeleton` | `BookingSkeleton.vue` | Animated pulse loading skeleton with configurable row count |
| `EmptyBookings` | `EmptyBookings.vue` | Empty state with icon, title, message, optional action button |

### List Page (`index.vue`)

**File:** `src/pages/vehicle-bookings/index.vue`

Features:
- 4 clickable stat cards (Total, Active, Pending, Completed) that double as status filters
- Search input (searches booking ID, plate number, lessee name, phone number)
- Filter dropdowns: status, drive type (self drive / with driver), vehicle type (motorcycle, car, etc.)
- Export CSV button (generates and downloads CSV of filtered bookings)
- Refresh button
- Desktop table view (`BookingTable`) / mobile card view (`BookingCard`) — auto-switches at 768px via `window.resize` listener
- Pagination via shared `Pagination` component
- Row action menu with: View Details, Approve Booking, Cancel Booking, Complete Booking, Print Booking
- Toast notifications with confirmation dialogs for status changes
- Loading skeletons, error state with retry, empty state
- Real-time Firestore listener with automatic cleanup on `beforeUnmount`

### Detail Page (`_id.vue`)

**File:** `src/pages/vehicle-bookings/_id.vue`

Sections:

- **Header** — Booking ID (last 8 chars), copy ID button with clipboard feedback, status badge, back link
- **Vehicle Overview** — Full image gallery (`VehicleGallery`) with lightbox, 10-spec grid (brand, model, year, type, transmission, fuel, seats, engine, odometer, plate #)
- **Booking Information** — Key-value card: status, drive type, rental price, time rate, deposit, extension/hr, penalty/hr, QR hash, completion code, created/updated dates
- **Lessee Information** — Avatar initials, full name, phone, address, emergency contact person + number
- **Location Details** — OpenStreetMap iframe embed (from coordinates), full address, barangay/province/region/country grid, coordinates display
- **Check-In Details** — (if `checkInData` exists) Fuel level, odometer, timestamp, lessee signed at, photo gallery
- **Check-Out Details** — (if `checkOutData` exists) Return condition, fuel level, odometer, timestamp, photos; otherwise shows dashed-border placeholder card
- **Activity Timeline** — 4 events (Created, Approved, Completed, Cancelled) with active/inactive states based on booking status
- **Sidebar** — Manage Booking actions (contextual), QR code preview (via `qrserver.com` API), analytics metrics grid (price, deposit, extension/hr, penalty/hr), Print/PDF buttons

Actions:
- Approve Booking (pending → active)
- Cancel Booking (pending/active → cancelled)
- Complete Booking (active → completed)
- Print Booking (opens print-friendly receipt in new tab)
- Download PDF (triggers print dialog for save-as-PDF)

---

## Database Relationships

```
vehicle-bookings
  ├── vehicleRentalId ──→ vehicle-listings (1:1, optional fetch)
  │                         └── brand, model, images, etc.
  ├── lessee ───────────→ lessee user data (embedded)
  └── rental_details
       ├── info ────────→ vehicle snapshot (embedded)
       └── location ────→ address/coordinates (embedded)
```

---

## Status Flow

```
           ┌──────────┐
           │ Pending  │
           └────┬─────┘
                │
           ┌────▼─────┐
           │ Active   │
           └────┬─────┘
                │
           ┌────▼─────────┐
           │ Completed    │
           └──────────────┘

Cancelled can occur at Pending or Active stage.
```

---

## Status Colors

| Status | Badge Background | Dot Color |
|--------|-----------------|-----------|
| `active` | Blue (`bg-blue-50 text-blue-700`) | Blue (`bg-blue-400`) |
| `pending` | Amber (`bg-amber-50 text-amber-700`) | Amber (`bg-amber-400`) |
| `completed` | Green (`bg-green-50 text-green-700`) | Green (`bg-green-400`) |
| `cancelled` | Red (`bg-red-50 text-red-700`) | Red (`bg-red-400`) |

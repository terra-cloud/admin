# Service Bookings Management

## Overview

The Service Bookings Management pages at `/service-bookings` provide a full admin dashboard for managing all service booking transactions on the platform. It reads from the `service-bookings` Firestore collection using real-time subscriptions and merges related `service-listings` data.

Routes (`src/router/serviceBookings.js`):

| Path | Component | Name |
|------|-----------|------|
| `/service-bookings` | `@/pages/service-bookings/index.vue` | `serviceBookings` |
| `/service-bookings/:id` | `@/pages/service-bookings/_id.vue` | `serviceBookingDetails` |

All routes require auth and use `LayoutDefault`.

---

## Firestore Collections

### `service-bookings`

Primary collection. Each document represents a booking between an employer (service poster) and a terran (service provider).

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID |
| `job_id` | string | References a document in `service-listings` |
| `status` | string | One of: `pendingAcceptance`, `accepted`, `onGoing`, `delivered`, `completed`, `cancelled` |
| `terran` | map | Terran user data (includes `display_name`, `photo_url`, `kyc_validated`) |
| `escrowAmount` | number | Amount held in escrow |
| `acceptedPrice` | number | Accepted price for the booking |
| `paymentStatus` | string | Current payment status |
| `createdAt` | timestamp | When the booking was created |
| `updatedAt` | timestamp | When the booking was last updated |
| `acceptedAt` | timestamp | When the booking was accepted |
| `startedAt` | timestamp | When work started |
| `deliveredAt` | timestamp | When work was delivered |
| `completedAt` | timestamp | When work was completed |

### `service-listings` (referenced via `job_id`)

Related collection fetched for each booking. Key fields merged into the booking UI:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID (matches `job_id`) |
| `title` | string | Service listing title |
| `description` | string | Full service description |
| `category` | string | Service category |
| `images` | array<string> | Array of image URLs |
| `paymentType` | string | Payment type (fixed, hourly, etc.) |
| `location` | string | Service location |
| `author` | map | Employer user data (includes `display_name`, `photo_url`, `kyc_validated`, `account_type`) |

---

## Implementation Details

### Data Service

**File:** `src/services/ServiceBookingsDataService.js`

Class-based singleton service following the same pattern as `VehicleListingsDataService`.

| Method | Type | Description |
|--------|------|-------------|
| `getAll(callback, errorCallback)` | Real-time (`onSnapshot`) | Returns all bookings ordered by `createdAt` desc. Auto-fallbacks to unordered query if composite index doesn't exist. |
| `getById(id)` | Async | Fetches single booking by Firestore document ID |
| `getServiceListing(jobId)` | Async | Fetches related service listing by `job_id` |
| `updateStatus(id, data)` | Async | Updates booking fields + sets `updatedAt` timestamp |
| `delete(id)` | Async | Deletes a booking document |
| `getStats()` | Async | Returns counts by status (total, pendingAcceptance, accepted, onGoing, delivered, completed, cancelled) |
| `getFilteredCount(filters)` | Async | Count documents matching status filter |

### List Page (`index.vue`)

**File:** `src/pages/service-bookings/index.vue`

Features:
- 6 stat cards (Total, Pending, Accepted, On Going, Completed, Cancelled)
- Search input (searches booking ID, service title, employer name, terran name)
- Status filter dropdown
- Real-time table with columns: Booking ID, Service, Employer, Terran, Price, Status, Actions
- Fetches all `service-listings` docs on mount and merges into `serviceListings` map by doc ID
- Table links to detail page via `/service-bookings/:id`
- Loading skeletons, error state with retry, empty state
- Pagination via shared `Pagination` component

**Note:** `service-listings` is fetched as a one-time `getDocs` call (not real-time) since it's a reference collection.

### Detail Page (`_id.vue`)

**File:** `src/pages/service-bookings/_id.vue`

Sections:
- **Header** — Booking ID (last 8 chars of doc ID), status badge, share button
- **Service Hero** — Category label, title, description, workflow progress bar with 5 steps
- **Service Details** — Image, description, category/payment/location metadata grid
- **Parties** — Employer card (from listing.author) and Terran card (from booking.terran), with avatars, names, verification badges
- **Finance** — Escrow Amount, Accepted Price, Payment Status in bordered cards
- **Activity Timeline** — 5 timeline events (Created, Accepted, Started, Delivered, Completed) with completion state based on booking status
- **Sidebar Actions** — Message Employer, Message Terran, Release Escrow, Mark Completed (contextual based on status)
- **Map Placeholder** — Location display with map placeholder

Workflow states:
```
pendingAcceptance → accepted → onGoing → delivered → completed
```

The progress bar and timeline automatically reflect the current status.

### BookingStatusBadge Component

**File:** `src/pages/service-bookings/components/BookingStatusBadge.vue`

Reusable status badge with color-coded dot and label:

| Status | Dot Color | Badge Style |
|--------|-----------|-------------|
| `pendingAcceptance` | Amber | Amber background |
| `accepted` | Blue | Blue background |
| `onGoing` | Primary (blue) | Primary tint |
| `delivered` | Purple | Purple background |
| `completed` | Green | Green background |
| `cancelled` | Red | Red background |

---

## Database Relationships

```
service-bookings
  ├── job_id ──────────→ service-listings (1:1)
  │                        └── author ──→ employer user data (embedded)
  └── terran ──────────→ terran user data (embedded)
```

---

## Status Flow

```
                  ┌──────────────┐
                  │ Pending      │
                  │ Acceptance   │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ Accepted     │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ On Going     │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ Delivered    │
                  └──────┬───────┘
                         │
                  ┌──────▼───────┐
                  │ Completed    │
                  └──────────────┘

Cancelled can occur at any stage.
```

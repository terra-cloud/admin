# WorkBits Payments Management

## Overview

The WorkBits Payments Management pages at `/workbits-payments` provide a full admin dashboard for monitoring and managing all payment transactions on the WorkBits platform. It reads from the `workbits-payments` Firestore collection using real-time subscriptions and merges related `users` data.

Routes (`src/router/workbitsPayments.js`):

| Path | Component | Name |
|------|-----------|------|
| `/workbits-payments` | `@/pages/workbits-payments/index.vue` | `workbitsPayments` |
| `/workbits-payments/:id` | `@/pages/workbits-payments/_id.vue` | `workbitsPaymentDetails` |

All routes require auth and use `LayoutDefault`.

---

## Firestore Collections

### `workbits-payments`

Primary collection. Each document represents a payment transaction initiated through the platform.

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID |
| `invoiceID` | string | Unique invoice identifier (Xendit invoice ID) |
| `userID` | string | References a document in `users` |
| `paymentData` | map | Payment transaction data (see below) |
| `createdAt` | string (ISO) / Timestamp | When the payment record was created |

#### `paymentData` sub-fields

| Field | Type | Description |
|-------|------|-------------|
| `amount` | number | Transaction amount in PHP |
| `date` | string (ISO) | ISO timestamp of the payment |
| `id` | string | Payment provider transaction ID |
| `status` | string | One of: `PAID`, `PENDING`, `FAILED`, `EXPIRED` |
| `type` | string | One of: `add_fund`, `subscription`, `withdrawal` |
| `url` | string | Xendit checkout URL for the payment |

### `users` (referenced via `userID`)

Related collection fetched for each payment. Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID (matches `userID`) |
| `firstname` | string | User's first name |
| `lastname` | string | User's last name |
| `email` | string | User's email address |
| `profileImage` | string | URL to user's profile image |
| `phoneNumber` | string | User's phone number |

---

## Implementation Details

### Data Service

**File:** `src/services/WorkbitsPaymentsDataService.js`

Singleton service following the same pattern as `VehicleListingsDataService` and `ServiceBookingsDataService`.

| Method | Type | Description |
|--------|------|-------------|
| `getAll(callback, errorCallback)` | Real-time (`onSnapshot`) | Returns all payments ordered by `createdAt` desc. Auto-fallbacks to unordered query if composite index doesn't exist. |
| `getById(id)` | Async | Fetches single payment by Firestore document ID |
| `getUserById(userId)` | Async | Fetches linked user document from `users/{userId}` |
| `getStats()` | Async | Returns counts by status (total, totalRevenue, paid, pending, failed, expired) |
| `getFilteredCount(filters)` | Async | Count documents matching status filter |

### Reusable Components

**Folder:** `src/components/workbits-payments/`

All components use Vue Options API.

| Component | File | Description |
|-----------|------|-------------|
| `PaymentStatusBadge` | `PaymentStatusBadge.vue` | Colored status badge — PAID (green), PENDING (amber), FAILED (red), EXPIRED (gray) |
| `PaymentTypeBadge` | `PaymentTypeBadge.vue` | Type badge — add_fund (blue), subscription (purple), withdrawal (orange) |
| `PaymentTable` | `PaymentTable.vue` | Desktop table with 8 columns (Invoice, User, Email, Amount, Type, Status, Date, Actions), sticky header, action dropdown with 5 options |
| `PaymentCard` | `PaymentCard.vue` | Mobile card layout with avatar, initials, name, invoice ID, amount, status badge, type badge |
| `PaymentFilters` | `PaymentFilters.vue` | Search input (invoice ID, payment ID, user name, email) + status dropdown + type dropdown |
| `PaymentOverviewCard` | `PaymentOverviewCard.vue` | Generic labeled info card with optional title and icon |
| `PaymentUserCard` | `PaymentUserCard.vue` | User profile card with profile image or avatar initials, full name, email, phone, user ID |
| `PaymentReceipt` | `PaymentReceipt.vue` | Printable receipt layout with company header, user info, payment info table, timestamps, generation date |
| `PaymentActions` | `PaymentActions.vue` | Action buttons — Open Checkout URL, Copy Invoice ID, Copy Payment ID, Print Receipt, Download PDF |
| `PaymentSkeleton` | `PaymentSkeleton.vue` | Animated pulse loading skeleton with configurable row count |
| `EmptyPayments` | `EmptyPayments.vue` | Empty state with icon, title, message, optional refresh action button |

### List Page (`index.vue`)

**File:** `src/pages/workbits-payments/index.vue`

Features:
- 4 analytics stat cards (Total Revenue, Total Payments, Paid, Pending) — clickable cards filter by status
- Status tabs (All, Paid, Pending, Failed, Expired) with live counts
- Search input (filters by invoice ID, payment ID, user name, email)
- Filter dropdowns: payment status, payment type (add_fund / subscription / withdrawal)
- Export CSV button (generates and downloads CSV of all payments)
- Refresh button
- Desktop table / mobile card responsive switch at 768px
- Real-time Firestore listener with per-payment user data fetching
- Pagination via shared `Pagination` component
- Row action dropdown: View Details, Open Checkout URL, Copy Invoice ID, Copy Payment ID, Print Receipt
- Toast notifications
- Loading skeletons, error state with retry, empty state

### Detail Page (`_id.vue`)

**File:** `src/pages/workbits-payments/_id.vue`

Sections:

- **Header** — Invoice ID (last 8 chars), copy invoice button with clipboard feedback, payment status badge, back link
- **Payment Overview** — 4 stat cards with colored borders: Amount (green), Status (blue), Type (purple), Payment Date (amber)
- **User Information** — Profile image or avatar initials, full name, email, phone number, user ID (via `PaymentUserCard`)
- **Payment Details** — Key-value card: amount, status, type, provider ID, invoice ID, checkout URL, created date, payment date (via `PaymentOverviewCard`)
- **Payment Receipt** — Full printable receipt with user info, payment table, timestamps (via `PaymentReceipt`)
- **Sidebar** — Action buttons (Open Checkout URL, Copy IDs, Print, Download PDF), financial summary (Subtotal, Total), timeline (Created → Completed/Pending → Invoice Generated)

Actions:
- Open Checkout URL (opens Xendit checkout in new tab)
- Copy Invoice ID / Copy Payment ID (clipboard)
- Print Receipt (opens printable receipt in new tab)
- Download PDF (triggers print dialog for save-as-PDF)

---

## Database Relationships

```
workbits-payments
  ├── userID ──────────→ users (1:1, fetched on mount)
  │                      ├── firstname
  │                      ├── lastname
  │                      ├── email
  │                      ├── profileImage
  │                      └── phoneNumber
  └── paymentData ─────→ payment transaction data (embedded)
       ├── amount
       ├── status (PAID/PENDING/FAILED/EXPIRED)
       ├── type (add_fund/subscription/withdrawal)
       ├── id (provider transaction ID)
       └── url (Xendit checkout URL)
```

---

## Status Flow

```
           ┌──────────┐
           │ PENDING  │
           └────┬─────┘
                │
        ┌───────┼───────┐
        │       │       │
   ┌────▼───┐ ┌─▼──┐ ┌─▼────┐
   │ PAID   │ │FAIL│ │EXPIRED│
   └────────┘ └────┘ └───────┘
```

---

## Status Colors

| Status | Badge Background | Dot Color |
|--------|-----------------|-----------|
| `PAID` | Green (`bg-green-50 text-green-700`) | Green (`bg-green-400`) |
| `PENDING` | Amber (`bg-amber-50 text-amber-700`) | Amber (`bg-amber-400`) |
| `FAILED` | Red (`bg-red-50 text-red-700`) | Red (`bg-red-400`) |
| `EXPIRED` | Gray (`bg-gray-50 text-gray-500`) | Gray (`bg-gray-400`) |

---

## Type Badge Colors

| Type | Badge Background |
|------|-----------------|
| `add_fund` | Blue (`bg-blue-50 text-blue-700`) |
| `subscription` | Purple (`bg-purple-50 text-purple-700`) |
| `withdrawal` | Orange (`bg-orange-50 text-orange-700`) |

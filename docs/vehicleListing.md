# Vehicle Listings Management

## Overview

The Vehicle Listings Management page at `/vehicle-listings` provides a full admin dashboard for managing all vehicle rental listings on the platform. It reads from two Firestore collections (`vehicle-listings` and `vehicle-listing-details`) using real-time subscriptions.

Route (`src/router/vehicleListings.js`):

| Path | Component | Name |
|------|-----------|------|
| `/vehicle-listings` | `@/pages/vehicle-listings/index.vue` | `vehicleListings` |

Requires auth, uses `LayoutDefault`.

---

## Firestore Collections

### `vehicle-listings`

Primary collection. Each document is a rental listing.

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Document ID (same as `vehicle-listing-details`) |
| `title` | string | Listing title (e.g., "Ford Everest 2021 Automatic 2.2L") |
| `description` | string | Full listing description |
| `images` | string[] | Array of image URLs |
| `category` | string | Vehicle category (SUV, Sedan, Van, etc.) |
| `categoryType` | string | Subcategory type |
| `vehicleBrand` | string | Car brand (Toyota, Honda, etc.) |
| `vehicleType` | string | Specific model/trim |
| `price` | number | Daily rental rate |
| `pricing` | object | Pricing object (dailyRate, weeklyRate, monthlyRate) |
| `rating` | number | Average rating |
| `totalReviews` | number | Review count |
| `totalViews` | number | View count |
| `isAvailable` | boolean | Availability flag |
| `is_suspended` | boolean | Suspension flag |
| `status` | string | `Active`, `Pending`, `Suspended`, `Archived` |
| `createdAt` | Timestamp | Creation timestamp |
| `updatedAt` | Timestamp | Last update timestamp |
| `ownerId` | string | Owner user document ID |
| `author` | object | Owner details: `{ display_name, photo_url, email, account_type, kyc_validated }` |
| `location` | object | Location: `{ details, province, stringified_address }` |
| `keywords` | string \| string[] | Search keywords |

### `vehicle-listing-details`

Secondary collection with the same document ID as `vehicle-listings`. Contains extended specs.

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `plateNumber` | string | License plate |
| `transmission` | string | Automatic, Manual, CVT |
| `fuelType` | string | Gasoline, Diesel, Electric, Hybrid |
| `seatingCapacity` | number | Number of seats |
| `engineCapacity` | string | Engine displacement |
| `year` | number | Model year |
| `drive_types` | string | Drivetrain type |
| `pricing` | object | Rate details `{ dailyRate, weeklyRate, monthlyRate }` |
| `reservationFee` | number | Booking fee |
| `inclusions` | string | What's included |
| `info` | string | Additional information |

---

## Frontend Architecture

### File Structure

```
src/pages/vehicle-listings/
├── index.vue                      # Main page (header, stats, filters, table, modals)
└── components/
    ├── ListingActions.vue         # Per-row action dropdown menu
    └── ListingDetailsDrawer.vue   # Slide-over details panel

src/services/
└── VehicleListingsDataService.js  # Firestore service layer

src/router/
└── vehicleListings.js             # Route definition
```

### Component Breakdown

#### `index.vue` — Main Page

Orchestrates all features. Contains inline modals for suspend reason and delete confirmation. Delegates to child components for the action menu and details drawer.

| State | Condition | UI |
|-------|-----------|----|
| **Loading** | `loading === true` | Animated skeleton rows matching table structure |
| **Error** | `error` is set | Error icon + message + "Try Again" button |
| **Empty** | `listings.length === 0` | `directions_car_off` icon + "Create Listing" CTA |
| **No filters match** | `filteredListings.length === 0` | `search_off` icon + "Clear all filters" link |
| **Success** | Listings exist + filtered | Data table (desktop) or card grid (mobile) |

**Desktop** (`lg:` breakpoint and up): Full data table with all 11 columns.
**Tablet/Phone** (`<lg:`): 2-column card grid with thumbnail, status, owner, pricing, meta.

#### `ListingActions.vue` — Action Dropdown

Fixed-position dropdown menu attached to each table row. Auto-positions to stay within viewport.

| Action | Condition | Icon Color |
|--------|-----------|------------|
| View Listing | Always | Gray |
| Edit Listing | Always | Gray |
| Approve Listing | Status = `pending` | Emerald |
| Suspend Listing | Status = `active` or `pending` | Amber |
| Activate Listing | Status = `suspended` or `archived` | Blue |
| Archive Listing | Status = `active` or `pending` | Gray |
| Delete Listing | Always | Red |
| View Owner | Always | Gray |
| Copy Listing ID | Always | Gray |

#### `ListingDetailsDrawer.vue` — Details Panel

Slide-over panel from the right edge. Fetches secondary data from `vehicle-listing-details/{id}` on open.

Sections displayed:
- Image gallery (first image + dot indicators for more)
- Status badge overlay
- Title and daily rate
- Quick info (brand, category)
- Vehicle specs (transmission, fuel, seating, engine, year, plate)
- Description
- Owner details (avatar, name, type)
- Location
- Booking settings (pricing, reservation fee, inclusions)
- Metadata (ID, timestamps, views, reviews, availability)

#### `VehicleListingsDataService.js` — Service Layer

| Method | Description |
|--------|-------------|
| `getAll(callback, errorCallback)` | Real-time `onSnapshot` listener |
| `getById(id)` | Single doc fetch |
| `getDetails(id)` | Fetch from `vehicle-listing-details` |
| `updateStatus(id, data)` | Update listing fields + `updatedAt` |
| `bulkUpdateStatus(ids, data)` | Batch update for bulk actions |
| `delete(id)` | Delete single listing |
| `bulkDelete(ids)` | Delete multiple listings |
| `getStats()` | Aggregate counts (total, active, pending, suspended) |

---

## Features

### Header

- Title: "Vehicle Listings Management"
- Subtitle: "Manage and monitor all vehicle rental listings across the Philippines."
- **Export Data**: Generates a CSV file respecting current filter state
- **Create Listing**: Navigates to `/vehicle-listings/create` (route can be added later)

### Stats Cards

4 cards in a responsive grid with colored left borders:

| Card | Border | Icon |
|------|--------|------|
| Total Listings | Primary (blue) | `directions_car` |
| Active | Emerald | `check_circle` |
| Pending Review | Amber | `hourglass_empty` |
| Suspended | Red | `block` |

Stats are computed client-side from the real-time listings data.

### Filters

**Search**: Keyword search across title, keywords, owner name, vehicle brand, document ID, plate number, and location. Real-time with debounce via watcher that resets pagination.

**Advanced filters** (collapsible):

| Filter | Type | Source |
|--------|------|--------|
| Category | Select (dynamic) | `listing.category` |
| Status | Select | `active / pending / suspended / archived` |
| Province | Select (dynamic) | `location.details / location.province` |
| Vehicle Brand | Select (dynamic) | `listing.vehicleBrand` |
| Fuel Type | Select | Static options |
| Transmission | Select | Static options |
| Seating Capacity | Select | Static options |
| Availability | Select | `listing.isAvailable` |
| KYC Verified | Select | `author.kyc_validated` |
| Date Range | Date inputs | `listing.createdAt` |

**Active filter pills**: Shows active filters as removable badges with a "Clear all" link.

### Data Table

11 columns, responsive:

| Column | Content |
|--------|---------|
| Checkbox | Bulk selection |
| Vehicle | Thumbnail + title + plate number + brand |
| Category | `formatText(category)` |
| Owner | Avatar + display name + verified badge + account type |
| Daily Rate | `₱{price}/day` |
| Date Created | Formatted date |
| Status | Color-coded pill badge |
| Avail. | Check/cross icon in colored circle |
| Views | `totalViews` |
| Reviews | `totalReviews` |
| Actions | `ListingActions` dropdown |

### Status Badges

| Status | Class |
|--------|-------|
| Active | `bg-emerald-50 text-emerald-700 border-emerald-200/50` |
| Pending | `bg-amber-50 text-amber-700 border-amber-200/50` |
| Suspended | `bg-red-50 text-red-700 border-red-200/50` |
| Archived | `bg-gray-100 text-gray-600 border-gray-200/50` |

### Bulk Actions

Appears as a toolbar when one or more rows are selected:

- **Approve**: Bulk set status to Active
- **Suspend**: Bulk set status to Suspended
- **Archive**: Bulk set status to Archived
- **Delete**: Bulk delete with confirmation dialog
- **Clear**: Deselect all

### Pagination

Server-ready pagination with client-side slicing:

- Page number buttons with ellipsis for large page sets
- Previous / Next controls (disabled at boundaries)
- Rows per page selector: 10 / 20 / 50 / 100
- "Showing X to Y of Z listings" summary

### Modals

| Modal | Trigger | Content |
|-------|---------|---------|
| **Suspend Reason** | Action → Suspend | Reason dropdown (violation, inaccurate info, spam, verification, safety, complaint, Other) + custom textarea |
| **Delete Confirm** | Action → Delete or Bulk Delete | Uses shared `ConfirmDialog` component with customizable message |
| **Details Drawer** | Action → View Listing | Full slide-over panel with all listing + details fields |

### Export

CSV export with columns: ID, Title, Category, Brand, Plate Number, Owner, Owner Email, Daily Rate, Status, Available, Views, Reviews, Created At, Location. Respects current filter/search state.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/vehicle-listings/index.vue` | Main page UI and business logic |
| `src/pages/vehicle-listings/components/ListingActions.vue` | Row action dropdown menu |
| `src/pages/vehicle-listings/components/ListingDetailsDrawer.vue` | Details slide-over panel |
| `src/services/VehicleListingsDataService.js` | Firestore CRUD service |
| `src/router/vehicleListings.js` | Route definition |
| `src/router/index.js` | Route registration |
| `src/layouts/LeftSidebar.vue` | Sidebar navigation link |

---

## Adding Future Features

### Create/Edit Pages

The "Create Listing" button navigates to `/vehicle-listings/create`. To implement:

1. Create `src/pages/vehicle-listings/create.vue`
2. Create `src/pages/vehicle-listings/edit.vue`
3. Add routes in `src/router/vehicleListings.js`:
```js
{ path: '/vehicle-listings/create', component: () => import('@/pages/vehicle-listings/create.vue'), name: 'vehicleListingsCreate', meta: { layout: 'LayoutDefault', requiresAuth: true } },
{ path: '/vehicle-listings/:id/edit', component: () => import('@/pages/vehicle-listings/edit.vue'), name: 'vehicleListingsEdit', meta: { layout: 'LayoutDefault', requiresAuth: true } }
```

### Fuel Type / Transmission / Seating Filters from Data

To populate advanced filter dropdowns dynamically from the data (like category, brand, province), add computed properties similar to `uniqueCategories` and update the filter select options to use `v-for`.

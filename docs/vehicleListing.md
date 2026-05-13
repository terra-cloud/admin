# Vehicle Listings Management

## Overview

The Vehicle Listings Management page at `/vehicle-listings` provides a full admin dashboard for managing all vehicle rental listings on the platform. It reads from two Firestore collections (`vehicle-listings` and `vehicle-listing-details`) using real-time subscriptions.

Routes (`src/router/vehicleListings.js`):

| Path | Component | Name |
|------|-----------|------|
| `/vehicle-listings` | `@/pages/vehicle-listings/index.vue` | `vehicleListings` |
| `/vehicle-listings/:id` | `@/pages/vehicle-listings/_id.vue` | `vehicleListingDetails` |

All routes require auth and use `LayoutDefault`.

---

## Firestore Collections

### `vehicle-listings`

Primary collection. Each document is a rental listing.

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Document ID (same as `vehicle-listing-details`) |
| `title` | string | Listing title |
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
| `seatingCapacity` | number | Number of seats |
| `year` | number | Model year |
| `model` | string | Vehicle model (e.g. "Everest") |
| `type` | string | Vehicle body type (e.g. "carSedan") |
| `odoMeter` | number | Odometer reading in km |
| `isReservable` | boolean | Whether reservation is allowed |
| `drive_types` | string[] | Drivetrain types (e.g. `["selfDrive"]`) |
| `fuel_policy` | string | Fuel policy (e.g. "fullTankUponReturn") |
| `insurance` | string | Insurance info (e.g. "included") |
| `unlimited_mileage` | boolean | Whether mileage is unlimited |
| `reservationFee` | number | Booking fee |
| `info` | object | Nested map: `{ brand, engineCapacity, fuelType }` |
| `pricing` | object | Rate details: `{ dailyRate, weeklyRate, monthlyRate, rate8Hours, rate12Hours, extensionPerHour, penaltyPerHour, depositRequired }` |
| `inclusions` | string (JSON) \| object | Parsed as key-value pairs (insurance, unlimited_mileage, fuel_policy, drive_types) |
| `location` | object | Nested: `{ coordinates, type, details: { address, barangay, city, province, region, postalCode, country, latitude, longitude } }` |
| `images` | string[] | Additional detail images |

---

## Frontend Architecture

### File Structure

```
src/pages/vehicle-listings/
├── index.vue                      # Main page (header, stats, filters, table, modals)
├── _id.vue                        # Listing details page (full-page, no longer a drawer)
└── components/
    └── ListingActions.vue         # Per-row action dropdown menu

src/services/
└── VehicleListingsDataService.js  # Firestore service layer

src/router/
└── vehicleListings.js             # Route definitions
```

### Component Breakdown

#### `index.vue` — Main Page

Orchestrates all features. Contains inline modals for suspend reason and delete confirmation. Delegates to child components for the action menu.

| State | Condition | UI |
|-------|-----------|----|
| **Loading** | `loading === true` | Animated skeleton rows matching table structure |
| **Error** | `error` is set | Error icon + message + "Try Again" button |
| **Empty** | `listings.length === 0` | `directions_car_off` icon + "Create Listing" CTA |
| **No filters match** | `filteredListings.length === 0` | `search_off` icon + "Clear all filters" link |
| **Success** | Listings exist + filtered | Data table (desktop) or card grid (mobile) |

**Desktop** (`lg:` breakpoint and up): Full data table.
**Tablet/Phone** (`<lg:`): 2-column card grid with thumbnail, status, owner, pricing, meta.

#### `_id.vue` — Listing Details Page

Full-page view of a single listing, navigated via `/vehicle-listings/:id`. Fetches both the listing document and its details document on mount.

| Section | Content |
|---------|---------|
| **Image gallery** | Carousel with thumbnail strip, prev/next arrows, image counter |
| **Status badge** | Color-coded overlay on the hero image |
| **Title & price** | Listing title + daily rate |
| **Quick info** | Vehicle brand (from `details.info.brand`), category |
| **Vehicle specs** | Model, type, transmission, fuel type, seating, engine capacity, year, plate number, odometer, reservable flag, drive types as badges |
| **Description** | Full text description |
| **Booking settings** | Pricing tiers (daily, weekly, monthly), reservation fee, inclusions (parsed from JSON and displayed as readable key-value pairs with icons) |
| **Owner card** | Avatar, display name, account type (sidebar) |
| **Location card** | OpenStreetMap embed (when coordinates available), address, details grid (street, barangay, city, province, region, postal code, country), coordinates, type badge |
| **Listing info** | ID, timestamps, views, reviews, availability (sidebar) |

#### `ListingActions.vue` — Action Dropdown

Absolute-positioned dropdown menu attached to each table row, matching the header dropdown pattern.

| Action | Condition | Icon Color |
|--------|-----------|------------|
| View Listing | Always | Gray |
| Edit Listing | Always | Gray |
| Approve Listing | Status = `pending` | Emerald |
| Suspend Listing | Status = `active` or `pending` | Amber |
| Activate Listing | Status = `suspended` or `archived` | Blue |
| Archive Listing | Status = `active` or `pending` | Gray |
| Set None | Status is set | Gray |
| Delete Listing | Always | Red |
| View Owner | Always | Gray |

The menu renders with `absolute right-0 top-full mt-1` positioning. Click-outside detection via `document.addEventListener('click', ...)` closes the menu.

#### `VehicleListingsDataService.js` — Service Layer

| Method | Description |
|--------|-------------|
| `getAll(callback, errorCallback)` | Real-time `onSnapshot` listener |
| `getById(id)` | Single doc fetch from `vehicle-listings` |
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

Columns:

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
| Actions | `ListingActions` dropdown |

### Status Badges

| Status | Class |
|--------|-------|
| Active | `bg-emerald-50 text-emerald-700 border-emerald-200/50` |
| Pending | `bg-amber-50 text-amber-700 border-amber-200/50` |
| Suspended | `bg-red-50 text-red-700 border-red-200/50` |
| Archived | `bg-gray-100 text-gray-600 border-gray-200/50` |
| None/Empty | `Unknown` (falls through to `listing.status` or `'Unknown'`) |

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

### Export

CSV export with columns: ID, Title, Category, Brand, Plate Number, Owner, Owner Email, Daily Rate, Status, Available, Views, Reviews, Created At, Location. Respects current filter/search state.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/vehicle-listings/index.vue` | Main page UI and business logic |
| `src/pages/vehicle-listings/_id.vue` | Listing details page (full-page view) |
| `src/pages/vehicle-listings/components/ListingActions.vue` | Row action dropdown menu |
| `src/services/VehicleListingsDataService.js` | Firestore CRUD service |
| `src/router/vehicleListings.js` | Route definitions |
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

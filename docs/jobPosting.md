# Job Postings

## Overview

Two pages manage service/job listings: the list page (`JobPostings`) and the detail page (`JobDetails`). Both read from Firebase Firestore and require authentication.

Routes (`src/router/jobs.js`):

| Path | Component | Name |
|------|-----------|------|
| `/job-postings` | `@/pages/jobs/JobPostings.vue` | `jobPostings` |
| `/jobs/:jobId` | `@/pages/jobs/JobDetails.vue` | `jobDetails` |

---

## JobPostings (`src/pages/jobs/JobPostings.vue`)

### States

| State | Condition | UI |
|-------|-----------|----|
| **Loading** | `loading === true` | 6 skeleton cards with pulse animation |
| **Success** | `paginatedServices.length > 0` | Responsive grid of service cards |
| **Empty** | No matching services | Centered `search_off` icon + "No services found" |
| **Error** | Firestore listener error | Console-only log; loading stops |

### Features

- **Stats bar**: 4 cards — Total Services, Active Now, Pending Drafts, Closed/Flagged
- **Filter tabs**: All Services / Mine / Archived
- **Category & status dropdowns**: Client-side filtering
- **Search**: Matches title, category, author name, description, keywords
- **Favorites**: Client-side `Set`, stored in memory only (not persisted)
- **Pagination**: 20 items per page, resets to page 1 on filter change
- **Click card**: Navigates to `/jobs/:jobId`

### Data Source

Real-time Firestore listener (`onSnapshot`) on `service-listings` collection, ordered by `createdAt` desc. **No cleanup on unmount** — potential memory leak.

### Key Methods

| Method | Purpose |
|--------|---------|
| `fetchServices()` | Subscribes to Firestore `onSnapshot` |
| `toggleFavorite(id)` | Adds/removes ID from favorites Set |
| `favoriteStyle(id)` | Returns style object for filled heart icon |
| `setPage(page)` / `prevPage()` / `nextPage()` | Pagination controls |

---

## JobDetails (`src/pages/jobs/JobDetails.vue`)

### States

| State | Condition | UI |
|-------|-----------|----|
| **Loading** | `loading === true` | Skeleton/pulse placeholders for image, title, text, sidebar |
| **Error** | `error` is set | Error icon + message + "Try Again" button |
| **Success** | `service` is truthy | Full detail layout with gallery, info, sidebar |

### Features

- **Image gallery**: Primary image with prev/next navigation, counter, thumbnail strip
- **Meta row**: Category, type, availability badge, dates, offers count, keywords
- **Description card**
- **Booking Timeline**: Vertical timeline with 5 steps (Pending → Accepted → On Going → Delivered → Completed)
- **Activity Feed**: Lists booking activity items
- **Sidebar cards**:
  - **Price**: Price display, escrow badge, breakdown (base + fee = total), payment status
  - **Author/Employer**: Avatar, name, email, ID, phone
  - **Location**: Address, location type
  - **Booking Status**: Status badge, accepted price/date, escrow status, 5-step progress bar

### Data Source

Firestore `getDoc` on `service-listings/{jobId}` (fetched on mount). Then queries `service-bookings` for matching booking (client-side join matching `serviceId`, `service_id`, or `listingId`).

### Key Methods

| Method | Purpose |
|--------|---------|
| `fetchService()` | Fetches service doc from Firestore by route param `jobId` |
| `fetchBooking(serviceId)` | Queries bookings collection for matching service |
| `prevImage()` / `nextImage()` | Cycles gallery images |
| `displayStatus(status)` | Maps raw status to display label |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/jobs/JobPostings.vue` | Service listing page with filters, search, pagination |
| `src/pages/jobs/JobDetails.vue` | Service detail page with gallery, booking, sidebar |
| `src/router/jobs.js` | Route definitions for both pages |
| `src/components/Pagination.vue` | Shared pagination component |

### Backend (`terra-cloud`)

| File | Purpose |
|------|---------|
| Firestore `service-listings` collection | Service/job posting data |
| Firestore `service-bookings` collection | Booking data linked to listings |

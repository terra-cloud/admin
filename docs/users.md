# Users Management

## Overview

The Users Management module provides a full admin interface for viewing, editing, and managing all platform users. It is accessible via the main **User Management** page (with Users and Admins tabs) and includes a dedicated user editing flow with multiple sub-sections.

Routes:

| Path | Component | Name |
|------|-----------|------|
| `/user-management` | `@/pages/user-management/index.vue` | `userManagement` |
| `/users` | Redirects to `userManagement?tab=users` | — |
| `/admins` | Redirects to `userManagement?tab=admins` | — |
| `/users/:id/edit` | `@/pages/users/edit.vue` (with children) | `userEdit` |
| `/users/:id/edit/overview` | `@/pages/users/edit/overview.vue` | `userEditOverview` |
| `/users/:id/edit/account` | `@/pages/users/edit/account.vue` | `userEditAccount` |
| `/users/:id/edit/verification` | `@/pages/users/edit/verification.vue` | `userEditVerification` |
| `/users/:id/edit/employer` | `@/pages/users/edit/employer.vue` | `userEditEmployer` |
| `/users/:id/edit/terran` | `@/pages/users/edit/terran.vue` | `userEditTerran` |
| `/users/:id/edit/preferences` | `@/pages/users/edit/preferences.vue` | `userEditPreferences` |

All routes require auth and use `LayoutDefault`.

---

## Firestore Collection

### `users`

Primary collection. Each document represents a registered platform user.

Key fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firestore document ID (user UID) |
| `name` | string | First name |
| `last_name` | string | Last name |
| `display_name` | string | Public display name |
| `email` | string | Email address |
| `phone_number` | string | Phone number |
| `photo_url` | string | Profile image URL |
| `birthdate` | string (date) | Date of birth |
| `gender` | string | Gender (Male / Female / Other) |
| `account_type` | number | 1 = User (Terran), 2 = Employer |
| `account_state` | string | Account status (active, suspended, etc.) |
| `kyc_validated` | number | KYC status: 0 = Pending, 1 = Approved, -1 = Rejected |
| `kyc_rejection_reason` | string | Reason for KYC rejection |
| `email_verification_state` | string | Email verification status |
| `phone_verification_state` | string | Phone verification status |
| `id_verification_state` | string | ID verification status |
| `language_preference` | string | Preferred language |
| `preferred_payment_method` | string | Preferred payment method |
| `current_location` | string | Current location |
| `preferred_job_categories` | array<string> | Preferred job categories |
| `created_at` | Timestamp | Account creation date |

#### Employer-specific fields (account_type = 2)

| Field | Type | Description |
|-------|------|-------------|
| `employerType` | string | Type of employer |
| `businessCategory` | string | Business category |
| `employerBadge` | string | Employer badge |
| `averageRating` | number | Average rating |
| `completedJobs` | number | Completed job count |
| `reviewCount` | number | Review count |
| `paymentReliability` | string | Payment reliability rating |
| `preferredPaymentMethod` | string | Preferred payment method |

#### User/Terran-specific fields (account_type = 1)

| Field | Type | Description |
|-------|------|-------------|
| `badge` | string | Terran badge |
| `averageRating` | number | Average rating |
| `completedJobs` | number | Completed job count |
| `reviewCount` | number | Review count |
| `cancellationCount` | number | Cancellation count |
| `hourlyRate` | number | Hourly rate |
| `skills` | array<string> | Skill list |
| `certifications` | array<string> | Certification list |
| `employmentTypes` | array<string> | Employment type preferences |
| `paymentTypes` | array<string> | Payment type preferences |
| `timePreferences` | array<string> | Time preference list |
| `workingHours` | array<string> | Working hours |

---

## Implementation Details

### User Management Page (`/user-management`)

**File:** `src/pages/user-management/index.vue`

Tabbed wrapper page that imports and renders:

- `@/pages/users/index.vue` — Users table (default tab)
- `@/pages/admins/index.vue` — Admins table

Uses URL query param `?tab=` to persist active tab across navigation. Redirect routes at `/users` and `/admins` forward to the correct tab.

### Users List Page

**File:** `src/pages/users/index.vue`

Features:
- 6 metric cards (Total Users, Pending KYC, Approved KYC, Rejected KYC, Employers, Users)
- Search input (filters by name, last name, email, gender, birthdate, account type, KYC status, KYC rejection reason)
- MultiSelect filters: account type (User / Employer), KYC status (Pending / Approved / Rejected)
- Sortable columns (Name, Email, Type, KYC Status) with asc/desc toggle
- Real-time Firestore listener (`onSnapshot`) with server-side `getCountFromServer`
- Cursor-based pagination (20 per page)
- Row actions: Edit (navigates to `/users/:id/edit`), KYC (modal), Delete (confirm dialog)
- Pagination via shared `Pagination` component

### User Edit Page

**File:** `src/pages/users/edit.vue`

Layout:
- Back button
- User header card with photo, name, email, colored account state badge
- Tab navigation: Overview, Account, Verification, Employer (conditional), Terran (conditional), Preferences
- Conditional tabs: `employer` shown only for `account_type === 2`, `terran` shown only for `account_type === 1`
- Fetches user document via `getDoc` on mount
- Passes `user` prop to child `router-view` and listens for `saved` / `save-error` events
- Success/error toasts with auto-dismiss

#### Overview Tab (`edit/overview.vue`)

Editable form fields: First Name, Last Name, Display Name, Email, Birthdate, Gender, Account Type (User/Employer).

Saves via `setDoc` with `{ merge: true }` on `users/{id}`.

#### Account Tab (`edit/account.vue`)

Read-only display: Account State (colored badge), Account Type, Language Preference, Email, Phone Number, Created At.

#### Verification Tab (`edit/verification.vue`)

Read-only display of Email, Phone, and ID verification states + Current KYC Status with rejection reason.

Includes inline KYC update form with:
- Status select (Pending / Approved / Rejected)
- Conditional rejection reason textarea
- Saves via `setDoc` with `{ merge: true }`

#### Employer Tab (`edit/employer.vue`)

Read-only display (conditional, `account_type === 2`): Employer Type, Business Category, Badge, Average Rating, Completed Jobs, Review Count, Payment Reliability, Preferred Payment Method.

#### Terran Tab (`edit/terran.vue`)

Read-only display (conditional, `account_type === 1`): Badge, Average Rating, Completed Jobs, Review Count, Cancellation Count, Hourly Rate, Skills, Certifications.

#### Preferences Tab (`edit/preferences.vue`)

Read-only display: Preferred Payment Method, Current Location, Preferred Job Categories, Employment Types, Payment Types, Time Preferences, Working Hours.

### Components

**Folder:** `src/pages/users/components/`

| Component | File | Description |
|-----------|------|-------------|
| `KycStatusModal` | `KycStatusModal.vue` | Modal for updating KYC status with rejection reason |
| `UserModal` | `UserModal.vue` | Full edit modal with photo, name, email, phone, gender, account type, birthdate |

---

## KYC Status Values

| Value | Label |
|-------|-------|
| `0` | Pending |
| `1` | Approved |
| `-1` | Rejected |

## Account Types

| Value | Label |
|-------|-------|
| `1` | User (Terran) |
| `2` | Employer |

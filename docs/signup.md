# Signup Flow

## Overview

Registration happens at `POST /api/auth/register` on the Cloudflare Worker (`terra-cloud`). The signup page at `src/pages/auth/signup.vue` sends the payload. The `SearchableSelect` component (`src/components/forms/SearchableSelect.vue`) provides searchable dropdowns for partner, state, and city fields.

---

## Admin Types

| Type       | Description                     | Requires `employer_id` |
|------------|---------------------------------|------------------------|
| `partner`  | Default. Independent admin.     | No                     |
| `staff`    | Belongs to a partner.           | Yes (must be valid partner ID) |
| `superadmin`| Created manually (not in signup)| No                     |

- The signup page toggles between `partner` and `staff` via two styled buttons.
- When `staff` is selected, a `SearchableSelect` for partner/employer appears.

---

## Partner Selection

- Fetched from `GET /api/auth/partners` (public endpoint, no auth required).
- Returns all admins with `type = 'partner'`.
- The list is fetched on mount and cached in `partners` data property.
- Each option displays `"Firstname Lastname"` or falls back to `email`.

---

## GADM Geographic Selection

Two searchable selects for state/province and city/municipality:

### States
- **API:** `GET /api/gadm/states?keyword=<search>`
- **Endpoint:** `src/apis/gadm.js` → `apiGetStates()`
- Fetched on mount. Populates the `states` data array.

### Cities
- **API:** `GET /api/gadm/cities?map_state_id=<id>&keyword=<search>`
- **Endpoint:** `src/apis/gadm.js` → `apiGetCities(params)`
- **Dependency:** Requires a selected state. Disabled until a state is chosen.
- Re-fetches when the state changes or when the user types in the search field.

### Barangays (not yet used in signup)
- **API:** `GET /api/gadm/barangays?map_city_id=<id>&keyword=<search>`
- Available for future use; the GADM backend and API service already support it.

---

## Registration Payload

Sent to `POST /api/auth/register`:

```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "password": "string",
  "type": "partner | staff",
  "employer_id": "uuid | null",
  "state": "string | null",
  "city": "string | null"
}
```

### Backend validation (`RegisterAdminUseCase`):
- Email uniqueness check.
- If `type === 'staff'`: `employer_id` is required and must reference an existing admin with `type === 'partner'`.
- The `state` and `city` values are plain strings (the display name from the GADM select), not GADM IDs.

---

## Key Files

### Frontend (`terra-admin`)
| File | Purpose |
|------|---------|
| `src/pages/auth/signup.vue` | Signup page UI and logic |
| `src/components/forms/SearchableSelect.vue` | Reusable searchable dropdown |
| `src/apis/gadm.js` | GADM API service (states, cities, barangays) |
| `src/apis/auth.js` | Auth API service (register, login, partners, etc.) |
| `src/stores/auth.js` | Auth store (token management) |

### Backend (`terra-cloud`)
| File | Purpose |
|------|---------|
| `src/presentation/routes/auth.routes.ts` | Route definitions (register, partners, etc.) |
| `src/presentation/controllers/auth.controller.ts` | Auth controller (register, listPartners, checkUser) |
| `src/validators/auth.ts` | Zod schemas (registerSchema with type/employer_id) |
| `src/application/use-cases/auth/register-admin.usecase.ts` | Registration business logic |
| `src/db/schema.sql` | Admins table schema (type, employer_id columns) |
| `src/application/use-cases/gadm/fetch-geo.usecase.ts` | GADM query logic |
| `src/presentation/routes/gadm.routes.ts` | GADM route definitions |
| `src/presentation/controllers/gadm.controller.ts` | GADM controller |

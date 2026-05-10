# Admin Management

## Overview

The admin management page at `/admins` lets authorized admins view, update, and delete other admin accounts. Unlike the Users page (which reads from Firebase), the Admins page reads from the Cloudflare D1 database via the `terra-cloud` API.

---

## API Endpoints

All endpoints require authentication (Bearer token or `access_token` cookie).

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admins` | List all admins |
| `PUT` | `/api/admins/:id` | Update an admin |
| `DELETE` | `/api/admins/:id` | Delete an admin (cascades to sessions) |

### List Admins

```bash
curl -s -X GET https://terra-cloud.christian-igay.workers.dev/api/admins \
  -H 'Authorization: Bearer <token>'
```

**Response (200):**
```json
{
  "success": true,
  "admins": [
    {
      "id": "c04ccdfa-1636-473c-adb8-ca9b28c75ccd",
      "email": "admin@example.com",
      "firstname": "John",
      "middlename": null,
      "lastname": "Doe",
      "company": null,
      "city": null,
      "state": null,
      "address": null,
      "type": "partner",
      "status": "active",
      "employer_id": null,
      "refresh_token_version": 0,
      "created_at": "2026-05-10T04:49:53.039Z",
      "updated_at": "2026-05-10T04:49:53.039Z"
    }
  ]
}
```

### Update Admin

```bash
curl -s -X PUT https://terra-cloud.christian-igay.workers.dev/api/admins/<id> \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstname": "Jane",
    "status": "active"
  }'
```

Only provided fields are updated. Accepts: `firstname`, `middlename`, `lastname`, `email`, `company`, `city`, `state`, `address`, `type`, `status`, `employer_id`.

**Response (200):**
```json
{
  "success": true,
  "admin": { "...updated admin..." }
}
```

**Error — email already in use (400):**
```json
{
  "success": false,
  "error": "Email already in use"
}
```

### Delete Admin

```bash
curl -s -X DELETE https://terra-cloud.christian-igay.workers.dev/api/admins/<id> \
  -H 'Authorization: Bearer <token>'
```

**Response (200):**
```json
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

Deleting an admin also removes all their sessions from the `sessions` table.

---

## Frontend Pages

### List Page

**Route:** `/admins` (requires auth, `LayoutDefault`)

#### Features

- **Metrics bar**: Total admins, Active, Pending, Suspended, Partner count
- **Search**: Filter by name or email (client-side)
- **Status filter**: Multi-select dropdown for pending / active / suspended / cancelled
- **Sortable table**: Click column headers to sort by email, type, or status
- **Inline status badges**: Color-coded (green=active, yellow=pending, red=suspended, gray=cancelled)
- **Edit button**: Navigates to `/admins/:id/edit`
- **Delete confirmation**: `ConfirmDialog` with cascading session cleanup warning

### Edit Page

**Route:** `/admins/:id/edit` (requires auth, `LayoutDefault`)

Fetches the admin record on mount (from the list API) and populates a full form. On save, sends a `PUT /api/admins/:id` request. Shows success/error feedback inline.

| State | Behavior |
|-------|----------|
| Loading | "Loading admin..." centered message |
| Not found | "Admin not found." error message |
| Save success | Green success banner above form |
| Save error | Red error banner with API error message |

### Key Files (frontend)

| File | Purpose |
|------|---------|
| `src/pages/admins/index.vue` | Admin list page UI and logic |
| `src/pages/admins/edit.vue` | Admin edit page (form, save, feedback) |
| `src/apis/admin.js` | API service (list, update, delete) |
| `src/router/admins.js` | Route definitions (`/admins`, `/admins/:id/edit`) |

### Key Files (backend)

| File | Purpose |
|------|---------|
| `src/presentation/routes/admin.routes.ts` | Route definitions (list, update, delete) |
| `src/presentation/controllers/admin.controller.ts` | Request handling |
| `src/application/use-cases/admin/list-admins.usecase.ts` | List business logic |
| `src/application/use-cases/admin/update-admin.usecase.ts` | Update logic with email uniqueness check |
| `src/application/use-cases/admin/delete-admin.usecase.ts` | Delete logic |
| `src/infrastructure/repositories/admin.repository.ts` | D1 query implementation |
| `src/domain/interfaces/admin.repository.interface.ts` | Repository contract |

---

## Admin Statuses

| Status | Meaning | Can Login |
|--------|---------|-----------|
| `pending` | Awaiting activation | No |
| `active` | Approved and active | Yes |
| `suspended` | Temporarily disabled | No |
| `cancelled` | Permanently disabled | No |

New accounts are created with `status = 'pending'` by default. Only `active` admins can log in.

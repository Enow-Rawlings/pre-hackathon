# CampusFix – Backend API

Express + Supabase (PostgreSQL) + Cloudinary

---

## Setup

### 1. Database
Run `db/schema.sql` once in your **Supabase SQL Editor**.  
This creates the `users` and `reports` tables, indexes, triggers, and a default admin account.

**Default admin credentials**
| Field    | Value                  |
|----------|------------------------|
| email    | admin@campusfix.com    |
| password | Admin@1234             |

> Change the password immediately after first login.

### 2. Environment variables
Copy `.env` and fill in your real values:

```
PORT=5000

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...   ← Settings → API → service_role key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

JWT_SECRET=<any long random string>
JWT_EXPIRES_IN=7d
```

### 3. Install & run
```bash
npm install
npm run dev      # nodemon
# or
npm start        # plain node
```

---

## API Reference

All endpoints are prefixed with `/api`.

### Auth

| Method | Path                  | Auth     | Description           |
|--------|-----------------------|----------|-----------------------|
| POST   | `/auth/register`      | —        | Register a new user   |
| POST   | `/auth/login`         | —        | Login, receive JWT    |
| GET    | `/auth/me`            | Bearer   | Get current user info |

**Register / Login body**
```json
{ "name": "Alice", "email": "alice@uni.edu", "password": "secret123" }
```

**Response**
```json
{
  "token": "<jwt>",
  "user": { "id": "uuid", "name": "Alice", "email": "alice@uni.edu", "is_admin": false }
}
```

---

### Reports

| Method | Path                        | Auth           | Description                          |
|--------|-----------------------------|----------------|--------------------------------------|
| POST   | `/reports`                  | Bearer (user)  | Submit a new report (+ optional image) |
| GET    | `/reports/status/:ref`      | —              | Check status by reference number     |
| GET    | `/reports/my/reports`       | Bearer (user)  | List the caller's own reports        |
| GET    | `/reports`                  | Bearer (admin) | List all reports (filterable)        |
| GET    | `/reports/:id`              | Bearer (admin) | Get a single report by ID            |
| PATCH  | `/reports/:id/status`       | Bearer (admin) | Update report status                 |

#### POST `/reports`
Send as **multipart/form-data** when attaching an image, or `application/json` when not.

| Field         | Type   | Required | Notes                          |
|---------------|--------|----------|--------------------------------|
| `category`    | string | ✓        | See valid categories below     |
| `description` | string | ✓        | Free-text description          |
| `location`    | string | ✓        | Building / room / area         |
| `image`       | file   | —        | JPG / PNG / WEBP, max 5 MB     |

**Valid categories**
```
Laboratory Equipment | Sanitation | Classroom Furniture | Lighting
Water / Plumbing | Electrical | Network / IT | Security | Other
```

**Response 201**
```json
{
  "message": "Report submitted successfully",
  "report": {
    "id": "uuid",
    "ref_number": "CFX-20261108-A3F9",
    "category": "Lighting",
    "description": "Light bulb out in Lab B2",
    "location": "Science Block, Room B2",
    "image_url": "https://res.cloudinary.com/...",
    "status": "Pending",
    "created_at": "2026-11-08T10:00:00Z"
  }
}
```

#### GET `/reports/status/:ref`
No auth required. Anyone with the reference number can check their report.

```
GET /api/reports/status/CFX-20261108-A3F9
```

#### GET `/reports` (admin)
Optional query params: `status`, `category`, `page`, `limit`

```
GET /api/reports?status=Pending&page=1&limit=20
```

#### PATCH `/reports/:id/status` (admin)
```json
{ "status": "In Progress" }
```
Valid values: `Pending` | `In Progress` | `Resolved`

---

## Project structure

```
server/
├── db/
│   └── schema.sql          ← Run once in Supabase
├── lib/
│   ├── supabase.js          ← Supabase client
│   └── cloudinary.js        ← Cloudinary + Multer config
├── middleware/
│   └── auth.js              ← protect + adminOnly
├── routes/
│   ├── auth.js              ← register / login / me
│   └── reports.js           ← all report endpoints
├── .env
├── package.json
└── server.js
```

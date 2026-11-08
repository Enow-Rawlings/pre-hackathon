# CampusFix 🏫

A campus facility problem reporting platform. Students report maintenance issues, receive a reference number, and track progress in real time.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Cloudinary credentials (see below)

# 3. Run the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_CLOUDINARY_CLOUD_NAME` | For image upload | Your Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | For image upload | An **unsigned** upload preset name |

> If these vars are missing the app still works — images will use local object-URLs so you can develop without a Cloudinary account.

---

## Creating a Cloudinary Unsigned Upload Preset

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier is fine).
2. Go to **Settings → Upload → Upload presets → Add upload preset**.
3. Set **Signing mode** to **Unsigned**.
4. (Recommended) Under **Upload manipulations**, add a resize transformation:
   - Width: `1280`, Height: `1280`, Crop: `limit` — keeps files small server-side too.
5. (Recommended) Under **Access control**, restrict allowed formats to `jpg,png,webp`.
6. Save. Copy the preset name into `VITE_CLOUDINARY_UPLOAD_PRESET`.
7. Your cloud name is shown in the top-left of the Cloudinary dashboard.

---

## Project Structure

```
src/
├── assets/             Static images
├── components/         Reusable UI components
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Textarea.jsx
│   ├── StatusBadge.jsx
│   ├── ProgressTracker.jsx
│   ├── Modal.jsx
│   ├── Toast.jsx       (context provider + hook)
│   ├── Skeleton.jsx
│   ├── PhotoUpload.jsx
│   ├── Navbar.jsx
│   └── Footer.jsx
├── constants/
│   └── index.js        Categories, statuses, localStorage keys
├── hooks/              Custom React hooks (extend here)
├── pages/
│   ├── LandingPage.jsx       /
│   ├── ReportPage.jsx        /report
│   ├── ConfirmationPage.jsx  /report/success/:reference
│   ├── TrackPage.jsx         /track  and  /track/:reference
│   └── NotFoundPage.jsx      404
├── services/
│   ├── reportService.js      Data layer (swap for real API here)
│   └── cloudinaryService.js  Image upload abstraction
└── utils/
    ├── referenceNumber.js    CF-YEAR-XXXX generator
    └── formatDate.js         Human-readable date formatter
```

---

## Adding the Admin Module Later

The codebase is already wired for this:

1. Create `src/admin/` with its own router, pages, and API calls.
2. In `src/App.jsx`, uncomment the admin route:
   ```jsx
   <Route path="/admin/*" element={<AdminRoutes />} />
   ```
3. The `reportService.js` stubs `listReports()` and `updateReportStatus()` are ready — just replace the localStorage implementation with real API calls.
4. All constants (categories, statuses, status colours) live in `src/constants/index.js` and can be imported by the admin module directly.

---

## Tech Stack

- **React 19** + **Vite 8**
- **React Router v7** — client-side routing
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite`
- **browser-image-compression** — client-side resize before upload
- **Cloudinary** — image hosting (unsigned upload)
- **localStorage** — data persistence (replace with real API)

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow the deployed Vercel frontend + localhost dev server.
// Set CLIENT_ORIGIN in Render env vars to your Vercel URL, e.g.:
//   https://campusfix.vercel.app
const ALLOWED_ORIGINS = [
  process.env.CLIENT_ORIGIN,          // production Vercel URL
  "http://localhost:5173",            // Vite dev default
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Render health checks)
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth",    require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));

// ─── Global error handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  // Don't leak CORS errors as 500 — send 403 so the browser shows the real issue
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CampusFix API running on port ${PORT}`);
});

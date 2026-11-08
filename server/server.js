require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow all origins — fine for a hackathon demo.
// To lock down in production, replace with an origin allowlist using CLIENT_ORIGIN env var.
app.use(cors());

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
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CampusFix API running on port ${PORT}`);
});

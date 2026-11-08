const express = require("express");
const supabase = require("../lib/supabase");
const { upload } = require("../lib/cloudinary");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

// ─── helpers ──────────────────────────────────────────────────────────────────

const VALID_CATEGORIES = [
  "electrical",
  "plumbing",
  "internet",
  "security",
  "cleanliness",
  "furniture",
  "other",
];

const VALID_STATUSES = ["Pending", "In Progress", "Resolved"];

/** Generates a ref like CFX-20261108-A3F9 */
const generateRef = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CFX-${date}-${rand}`;
};

// ─── POST /api/reports/guest  (public: submit without auth) ──────────────────
// Frontend uploads image directly to Cloudinary, then sends the URL here.
router.post("/guest", async (req, res, next) => {
  try {
    const { category, description, location, contact, image_url } = req.body;

    if (!category || !description || !location) {
      return res
        .status(400)
        .json({ message: "category, description, and location are required" });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: "Invalid category",
        valid_categories: VALID_CATEGORIES,
      });
    }

    let report = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const ref_number = generateRef();
      const { data, error } = await supabase
        .from("reports")
        .insert({
          ref_number,
          user_id: null,   // guest — no account required
          category,
          description: description.trim(),
          location: location.trim(),
          contact: contact?.trim() || null,
          image_url: image_url || null,
          status: "Pending",
        })
        .select()
        .single();

      if (!error) { report = data; break; }
      if (error.code !== "23505") throw error;
    }

    if (!report) {
      return res.status(500).json({ message: "Could not generate a unique reference. Try again." });
    }

    res.status(201).json({
      message: "Report submitted successfully",
      report: sanitizeReport(report),
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/reports  (submit a new report — authenticated user) ────────────
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { category, description, location } = req.body;

      if (!category || !description || !location) {
        return res
          .status(400)
          .json({ message: "category, description, and location are required" });
      }

      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
          message: "Invalid category",
          valid_categories: VALID_CATEGORIES,
        });
      }

      const image_url = req.file?.path ?? null; // Cloudinary returns the URL in `path`
      const image_public_id = req.file?.filename ?? null; // useful for future deletions

      // Retry loop in the unlikely event of a ref collision
      let report = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const ref_number = generateRef();
        const { data, error } = await supabase
          .from("reports")
          .insert({
            ref_number,
            user_id: req.user.id,
            category,
            description: description.trim(),
            location: location.trim(),
            image_url,
            image_public_id,
            status: "Pending",
          })
          .select()
          .single();

        if (!error) {
          report = data;
          break;
        }
        // 23505 = unique_violation (duplicate ref)
        if (error.code !== "23505") throw error;
      }

      if (!report) {
        return res.status(500).json({ message: "Could not generate a unique reference. Try again." });
      }

      res.status(201).json({
        message: "Report submitted successfully",
        report: sanitizeReport(report),
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/reports/status/:ref  (anyone can look up their ref) ─────────────
router.get("/status/:ref", async (req, res, next) => {
  try {
    const { data: report, error } = await supabase
      .from("reports")
      .select("ref_number, category, description, location, status, image_url, created_at, updated_at")
      .eq("ref_number", req.params.ref.toUpperCase())
      .maybeSingle();

    if (error) throw error;
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({ report });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/reports  (admin: list all reports with optional filters) ─────────
router.get("/", protect, adminOnly, async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from("reports")
      .select(
        `id, ref_number, category, description, location,
         status, image_url, created_at, updated_at,
         users ( id, name, email )`,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to);

    if (status && VALID_STATUSES.includes(status)) {
      query = query.eq("status", status);
    }
    if (category && VALID_CATEGORIES.includes(category)) {
      query = query.eq("category", category);
    }

    const { data: reports, error, count } = await query;
    if (error) throw error;

    res.json({
      reports,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(count / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/reports/:id  (admin: single report detail) ─────────────────────
router.get("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const { data: report, error } = await supabase
      .from("reports")
      .select(
        `id, ref_number, category, description, location,
         status, image_url, created_at, updated_at,
         users ( id, name, email )`
      )
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json({ report });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/reports/:id/status  (admin: update status) ───────────────────
router.patch("/:id/status", protect, adminOnly, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        valid_statuses: VALID_STATUSES,
      });
    }

    const { data: report, error } = await supabase
      .from("reports")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!report) return res.status(404).json({ message: "Report not found" });

    res.json({
      message: `Status updated to "${status}"`,
      report: sanitizeReport(report),
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/reports/my/reports  (authenticated user: own reports) ───────────
router.get("/my/reports", protect, async (req, res, next) => {
  try {
    const { data: reports, error } = await supabase
      .from("reports")
      .select("ref_number, category, description, location, status, image_url, created_at, updated_at")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ reports });
  } catch (err) {
    next(err);
  }
});

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Strip internal fields before sending to clients */
function sanitizeReport(r) {
  const { image_public_id, user_id, ...safe } = r;
  return safe;
}

module.exports = router;

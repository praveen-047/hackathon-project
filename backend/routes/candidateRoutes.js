import express from "express";
import connectDB from "../mysql/db.js";
import auth from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const db = await connectDB();

// ✅ Get all job listings
router.get("/jobs",auth, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM jobs ORDER BY created_at asc");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});


// ✅ Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Candidate applies for a job
router.post("/apply", auth, upload.single("resume"), async (req, res) => {
  try {
    const { jobId } = req.body;
    const resumeFile = req.file ? req.file.filename : null;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const sql = `
      INSERT INTO userJobs (user_id, job_id, resume)
      VALUES (?, ?, ?)
    `;
    const params = [req.user.user_id, jobId, resumeFile];

    await db.execute(sql, params);
    return res.status(201).json({ message: "Applied successfully!" });
  } catch (err) {
    console.error("APPLY ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/blogs", async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, 
        title, 
        summary, 
        content, 
        image, 
        category, 
        publish_date, 
        created_at
      FROM blogs
      ORDER BY publish_date DESC
    `;
    const [rows] = await db.execute(sql);

    res.status(200).json(rows);
  } catch (err) {
    console.error("BLOG FETCH ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
import express from "express";
import connectDB from "../mysql/db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import auth from "../middleware/auth.js";

const router = express.Router();

const db = await connectDB();

router.post("/jobpost", auth, async (req, res) => {
  try {
    // only admins can create jobs
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create job posts" });
    }

    const {
      title,
      company,
      location,
      type,
      experience,
      salary,
      description,
      requirements,
      applyLink,
      deadline,        // "YYYY-MM-DD" from your form
    } = req.body;

    // minimal validation
    if (!title || !company || !type || !experience) {
      return res.status(400).json({ message: "title, company, type, and experience are required" });
    }

    // Insert
    const sql = `
      INSERT INTO jobs
      (admin_id, title, company, location, type, experience, salary, description, requirements, apply_link, deadline)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      req.user.user_id,
      title,
      company,
      location || null,
      type,
      experience,
      salary || null,
      description || null,
      requirements || null,
      applyLink || null,
      deadline || null,
    ];

    // mysql2 returns [result] where result.insertId exists
    const [result] = await db.execute(sql, params);

    return res.status(201).json({
      message: "Job post created successfully",
      jobId: result.insertId,
    });
  } catch (err) {
    console.error("JOBPOST ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/blogpost", auth, async (req, res) => {
  try {
    // allow only admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create blog posts" });
    }

    const { title, summary, content, image, category, publishDate } = req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({ message: "Title, summary, and content are required" });
    }

    const sql = `
      INSERT INTO blogs
      (admin_id, title, summary, content, image, category, publish_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const params = [
      req.user.user_id ,
      title,
      summary,
      content,
      image || null,
      category || "Company Update",
      publishDate || null,
    ];

    const [result] = await db.execute(sql, params);

    res.status(201).json({
      message: "Blog post created successfully",
      blogId: result.insertId,
    });
  } catch (err) {
    console.error("BLOGPOST ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});





router.get("/applications", auth, async (req, res) => {
  try {
    // Ensure only admins can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const sql = `
      SELECT 
        uj.id AS application_id,
        uj.applied_at,
        uj.resume,
        u.username,
        u.email,
        u.mobile,
        j.title AS job_title,
        j.company
      FROM userJobs uj
      JOIN user u ON uj.user_id = u.user_id
      JOIN jobs j ON uj.job_id = j.id
      ORDER BY uj.applied_at DESC
    `;

    const [applications] = await db.execute(sql);
    res.status(200).json(applications);
  } catch (err) {
    console.error("APPLICATIONS FETCH ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;



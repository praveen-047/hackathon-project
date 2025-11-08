import express from "express";
import connectDB from "../mysql/db.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const router = express.Router();

const db = await connectDB();

router.post("/register", async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    if (!username || !email || !mobile || !password) {
      return res.status(400).json({ msg: "all fields are required" });
    }

    const [existingUser] = await db.execute(
      `select * from user where email = ?`,
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ msg: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      `insert into user(username,email,mobile,password) values(?,?,?,?)`,
      [username, email, mobile, hashedPassword]
    );

    res.status(200).json({ msg: "user registred successfully" });
  } catch (error) {
    console.log("registration error", error);
    res.status(500).json({ msg: "server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log(email,password,role)

    if (!email || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ Correct MySQL2 syntax: first destructure rows, then get the first user
    const [rows] = await db.execute(`SELECT * FROM user WHERE email = ?`, [email]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    if (!user.password) {
      return res.status(500).json({ msg: "User password missing in database" });
    }


    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // ✅ Generate JWT token
    const jwtToken = jwt.sign(
      {
        user_id: user.user_id, // use actual user ID field
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ msg: "Login successful", token: jwtToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

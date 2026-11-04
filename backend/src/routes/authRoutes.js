const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

// STUDENT REGISTRATION
router.post("/register", async (req, res) => {
  const {
    name,
    email,
    phone,
    department,
    year,
    password,
    confirmPassword,
  } = req.body;

  if (
    !name?.trim() ||
    !email?.trim() ||
    !department ||
    !year ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required fields",
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 8 characters",
    });
  }

  const yearNumber = Number(year);

  if (!Number.isInteger(yearNumber) || yearNumber < 1 || yearNumber > 4) {
    return res.status(400).json({
      success: false,
      message: "Year must be between 1 and 4",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const [existingStudents] = await db.query(
      "SELECT student_id FROM STUDENT WHERE email = ?",
      [normalizedEmail]
    );

    if (existingStudents.length > 0) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.query(
      `INSERT INTO STUDENT
       (name, email, phone, password, department, year_of_study)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        normalizedEmail,
        phone?.trim() || null,
        hashedPassword,
        department,
        yearNumber,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Student account created successfully",
      student: {
        student_id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        department,
        year_of_study: yearNumber,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to create account",
    });
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    let user;

    if (role === "student") {
      const [students] = await db.query(
        `SELECT student_id, name, email, password, department,
                year_of_study
         FROM STUDENT
         WHERE email = ?`,
        [normalizedEmail]
      );
      user = students[0];
    } else if (role === "organizer") {
      const [organizers] = await db.query(
        `SELECT organizer_id, name, email, password, department
         FROM ORGANIZER
         WHERE email = ?`,
        [normalizedEmail]
      );
      user = organizers[0];
    }
    // Use the same response for an unknown account and wrong password.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Authentication service is not configured",
      });
    }

    const userId =
      role === "student" ? user.student_id : user.organizer_id;

    const token = jwt.sign(
      {
        userId,
        role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed due to a server error",
    });
  }
});
module.exports = router;

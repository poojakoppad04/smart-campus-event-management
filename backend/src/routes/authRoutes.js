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

    const existingStudent = await db.student.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const student = await db.student.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        password: hashedPassword,
        department,
        yearOfStudy: yearNumber,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Student account created successfully",
      student: {
        student_id: student.studentId,
        name: student.name,
        email: student.email,
        department: student.department,
        year_of_study: student.yearOfStudy,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
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
  const { email, password } = req.body;

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

    const student = await db.student.findUnique({
      where: { email: normalizedEmail },
    });

    let user = student;
    let role = "student";

    if (!user) {
      user = await db.organizer.findUnique({
        where: { email: normalizedEmail },
      });

      role = "organizer";
    }

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
      role === "student" ? user.studentId : user.organizerId;

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

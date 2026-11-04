const express = require("express");
const router = express.Router();
const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// GET all registrations
router.get("/", authenticateToken, authorizeRole("organizer"), async (req, res) => {
  try {
    const [registrations] = await db.query(`
      SELECT
        r.registration_id,
        r.student_id,
        s.name AS student_name,
        s.email AS student_email,
        s.department,
        s.year_of_study,
        r.event_id,
        e.title AS event_title,
        r.registration_date,
        r.status
      FROM REGISTRATION r
      JOIN STUDENT s ON r.student_id = s.student_id
      JOIN EVENT e ON r.event_id = e.event_id
      ORDER BY r.registration_date DESC
    `);

    res.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error("Error fetching registrations:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve registrations",
    });
  }
});

// POST a new registration - students only
router.post("/", authenticateToken, authorizeRole("student"), async (req, res) => {
  const event_id = Number(req.body.event_id);
  const student_id = req.user.userId;

  if (!Number.isInteger(event_id) || event_id <= 0) {
    return res.status(400).json({
      success: false,
      message: "A valid event_id is required",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [events] = await connection.query(
      `SELECT event_id, max_participants, status
       FROM EVENT
       WHERE event_id = ?
       FOR UPDATE`,
      [event_id]
    );

    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (events[0].status === "Cancelled") {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "This event has been cancelled",
      });
    }

    const [counts] = await connection.query(
      `SELECT COUNT(*) AS total
       FROM REGISTRATION
       WHERE event_id = ? AND status = 'Registered'`,
      [event_id]
    );

    if (counts[0].total >= events[0].max_participants) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "Sorry, this event is full",
      });
    }

    const [result] = await connection.query(
      `INSERT INTO REGISTRATION (student_id, event_id)
       VALUES (?, ?)`,
      [student_id, event_id]
    );

    await connection.commit();

    await logActivity({
      userId: student_id,
      userRole: req.user.role,
      action: "registration_created",
      details: {
        registration_id: result.insertId,
        event_id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      registration_id: result.insertId,
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError.message);
      }
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    console.error("Registration error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Registration failed due to a server error",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;




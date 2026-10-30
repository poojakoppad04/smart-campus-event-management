const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all registrations
router.get("/", async (req, res) => {
  try {
    const [registrations] = await db.query(`
      SELECT
        r.registration_id,
        r.student_id,
        s.name AS student_name,
        r.event_id,
        e.title AS event_title,
        r.registration_date,
        r.status
      FROM REGISTRATION r
      JOIN STUDENT s
        ON r.student_id = s.student_id
      JOIN EVENT e
        ON r.event_id = e.event_id
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

// POST a new registration
router.post("/", async (req, res) => {
  const { student_id, event_id } = req.body;

  if (
    !Number.isInteger(student_id) ||
    !Number.isInteger(event_id) ||
    student_id <= 0 ||
    event_id <= 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid student_id and event_id are required",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Lock the event row so simultaneous requests cannot overbook it.
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

    // Confirm the student exists.
    const [students] = await connection.query(
      `SELECT student_id
       FROM STUDENT
       WHERE student_id = ?`,
      [student_id]
    );

    if (students.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Count active registrations while the event row is locked.
    const [counts] = await connection.query(
      `SELECT COUNT(*) AS total
       FROM REGISTRATION
       WHERE event_id = ?
         AND status = 'Registered'`,
      [event_id]
    );

    if (counts[0].total >= events[0].max_participants) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Sorry, this event is full",
      });
    }

    // The UNIQUE constraint also prevents duplicate registrations.
    const [result] = await connection.query(
      `INSERT INTO REGISTRATION (student_id, event_id)
       VALUES (?, ?)`,
      [student_id, event_id]
    );

    await connection.commit();

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
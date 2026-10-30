const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all feedback
router.get("/", async (req, res) => {
  try {
    const [feedback] = await db.query(`
      SELECT
        f.feedback_id,
        f.student_id,
        s.name AS student_name,
        f.event_id,
        e.title AS event_title,
        f.rating,
        f.comments,
        f.feedback_date
      FROM FEEDBACK f
      JOIN STUDENT s
        ON f.student_id = s.student_id
      JOIN EVENT e
        ON f.event_id = e.event_id
      ORDER BY f.feedback_date DESC
    `);

    res.json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve feedback",
    });
  }
});

// POST new feedback
router.post("/", async (req, res) => {
  const { student_id, event_id, rating, comments } = req.body;

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

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be an integer between 1 and 5",
    });
  }

  if (
    comments !== undefined &&
    comments !== null &&
    typeof comments !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Comments must be text",
    });
  }

  try {
    // Confirm the student exists.
    const [students] = await db.query(
      "SELECT student_id FROM STUDENT WHERE student_id = ?",
      [student_id]
    );

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Confirm the event exists.
    const [events] = await db.query(
      "SELECT event_id FROM EVENT WHERE event_id = ?",
      [event_id]
    );

    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const [result] = await db.query(
      `INSERT INTO FEEDBACK
       (student_id, event_id, rating, comments)
       VALUES (?, ?, ?, ?)`,
      [student_id, event_id, rating, comments ?? null]
    );

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback_id: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "You have already submitted feedback for this event",
      });
    }

    console.error("Feedback submission error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
});

module.exports = router;
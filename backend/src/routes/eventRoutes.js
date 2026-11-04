const express = require("express");
const router = express.Router();
const db = require("../config/db");
const logActivity = require("../utils/activityLogger");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// GET all events - public access
router.get("/", async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT
        e.event_id,
        e.title,
        e.description,
        DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date,
        e.start_time,
        e.end_time,
        e.max_participants,
        e.status,
        o.name AS organizer_name,
        v.venue_name,
        v.location AS venue_location,
        v.capacity AS venue_capacity
      FROM EVENT e
      JOIN ORGANIZER o ON e.organizer_id = o.organizer_id
      JOIN VENUE v ON e.venue_id = v.venue_id
      ORDER BY e.event_date ASC, e.start_time ASC
    `);

    res.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve events",
    });
  }
});

// CREATE event - organizer only
router.post(
  "/",
  authenticateToken,
  authorizeRole("organizer"),
  async (req, res) => {
    const {
      title,
      description,
      event_date,
      start_time,
      end_time,
      venue_id,
      max_participants,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      !event_date ||
      !start_time ||
      !end_time ||
      !Number.isInteger(Number(venue_id)) ||
      Number(venue_id) <= 0 ||
      !Number.isInteger(Number(max_participants)) ||
      Number(max_participants) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event details",
      });
    }

    if (start_time >= end_time) {
      return res.status(400).json({
        success: false,
        message: "End time must be later than start time",
      });
    }

    try {
      const [venues] = await db.query(
        "SELECT venue_id, capacity FROM VENUE WHERE venue_id = ?",
        [Number(venue_id)]
      );

      if (venues.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      if (Number(max_participants) > venues[0].capacity) {
        return res.status(400).json({
          success: false,
          message: "Maximum participants cannot exceed venue capacity",
        });
      }

      const [result] = await db.query(
        `INSERT INTO EVENT
         (title, description, event_date, start_time, end_time,
          organizer_id, venue_id, max_participants, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming')`,
        [
          title.trim(),
          description || "",
          event_date,
          start_time,
          end_time,
          req.user.userId,
          Number(venue_id),
          Number(max_participants),
        ]
      );

      await logActivity({
        userId: req.user.userId,
        userRole: req.user.role,
        action: "event_created",
        details: {
          event_id: result.insertId,
          title: title.trim(),
          venue_id: Number(venue_id),
        },
      });
      return res.status(201).json({
        success: true,
        message: "Event created successfully",
        event_id: result.insertId,
      });
    } catch (error) {
      console.error("Event creation error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to create event",
      });
    }
  }
);

module.exports = router;



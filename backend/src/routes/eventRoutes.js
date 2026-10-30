const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all events with organizer and venue information
router.get("/", async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT
        e.event_id,
        e.title,
        e.description,
        e.event_date,
        e.start_time,
        e.end_time,
        e.max_participants,
        e.status,
        o.name AS organizer_name,
        v.venue_name,
        v.location AS venue_location,
        v.capacity AS venue_capacity
      FROM EVENT e
      JOIN ORGANIZER o
        ON e.organizer_id = o.organizer_id
      JOIN VENUE v
        ON e.venue_id = v.venue_id
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

module.exports = router;
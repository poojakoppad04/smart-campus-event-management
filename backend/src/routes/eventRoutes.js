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
        e.category,
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


// GET events and statistics for the logged-in organizer
router.get(
  "/organizer/my-events",
  authenticateToken,
  authorizeRole("organizer"),
  async (req, res) => {
    try {
      const organizerId = req.user.userId;

      const [events] = await db.query(
        `
        SELECT
          e.event_id,
          e.title,
          DATE_FORMAT(e.event_date, '%Y-%m-%d') AS event_date,
          TIME_FORMAT(e.start_time, '%h:%i %p') AS start_time,
          e.max_participants,
          e.status,
          v.venue_name,
          (
            SELECT COUNT(*)
            FROM REGISTRATION r
            WHERE r.event_id = e.event_id
              AND r.status = 'Registered'
          ) AS registrations
        FROM EVENT e
        JOIN VENUE v ON e.venue_id = v.venue_id
        WHERE e.organizer_id = ?
        ORDER BY e.event_date ASC, e.start_time ASC
        `,
        [organizerId]
      );

      const [feedbackRows] = await db.query(
        `
        SELECT COUNT(*) AS total_feedback
        FROM FEEDBACK f
        JOIN EVENT e ON f.event_id = e.event_id
        WHERE e.organizer_id = ?
        `,
        [organizerId]
      );

      const totalRegistrations = events.reduce(
        (sum, event) => sum + Number(event.registrations),
        0
      );

      res.json({
        success: true,
        events,
        stats: {
          totalEvents: events.length,
          upcomingEvents: events.filter(
            (event) => event.status === "Upcoming"
          ).length,
          totalRegistrations,
          totalFeedback: Number(feedbackRows[0].total_feedback),
        },
      });
    } catch (error) {
      console.error("Organizer dashboard error:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to load organizer dashboard",
      });
    }
  }
);
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
      category,
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
          organizer_id, venue_id, max_participants, status, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming', ?)`,
        [
          title.trim(),
          description || "",
          event_date,
          start_time,
          end_time,
          req.user.userId,
          Number(venue_id),
          Number(max_participants),
          category || 'Technology',
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


// UPDATE event - organizer only
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("organizer"),
  async (req, res) => {
    const eventId = Number(req.params.id);
    const { title, event_date } = req.body;

    if (
      !Number.isInteger(eventId) ||
      eventId <= 0 ||
      typeof title !== "string" ||
      !title.trim() ||
      !event_date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(event_date)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid event title and date",
      });
    }

    try {
      const [events] = await db.query(
        "SELECT event_id FROM EVENT WHERE event_id = ? AND organizer_id = ?",
        [eventId, req.user.userId]
      );

      if (events.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Event not found or you do not own this event",
        });
      }

      await db.query(
        "UPDATE EVENT SET title = ?, event_date = ? WHERE event_id = ? AND organizer_id = ?",
        [title.trim(), event_date, eventId, req.user.userId]
      );

      await logActivity({
        userId: req.user.userId,
        userRole: req.user.role,
        action: "event_updated",
        details: { event_id: eventId, title: title.trim() },
      });

      return res.json({
        success: true,
        message: "Event updated successfully",
      });
    } catch (error) {
      console.error("Event update error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to update event",
      });
    }
  }
);

// DELETE event - organizer only
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("organizer"),
  async (req, res) => {
    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    try {
      const [events] = await db.query(
        "SELECT event_id, title FROM EVENT WHERE event_id = ? AND organizer_id = ?",
        [eventId, req.user.userId]
      );

      if (events.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Event not found or you do not own this event",
        });
      }

      const [registrations] = await db.query(
        "SELECT COUNT(*) AS total FROM REGISTRATION WHERE event_id = ?",
        [eventId]
      );

      const [feedback] = await db.query(
        "SELECT COUNT(*) AS total FROM FEEDBACK WHERE event_id = ?",
        [eventId]
      );

      if (
        Number(registrations[0].total) > 0 ||
        Number(feedback[0].total) > 0
      ) {
        return res.status(409).json({
          success: false,
          message: "This event has registrations or feedback and cannot be deleted",
        });
      }

      await db.query(
        "DELETE FROM EVENT WHERE event_id = ? AND organizer_id = ?",
        [eventId, req.user.userId]
      );

      await logActivity({
        userId: req.user.userId,
        userRole: req.user.role,
        action: "event_deleted",
        details: { event_id: eventId, title: events[0].title },
      });

      return res.json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      console.error("Event deletion error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Failed to delete event",
      });
    }
  }
);

module.exports = router;



// GET all venues - public access
router.get("/venues", async (req, res) => {
  try {
    const [venues] = await db.query(`
      SELECT venue_id, venue_name, location, capacity
      FROM VENUE
      ORDER BY venue_name ASC
    `);

    res.json({
      success: true,
      count: venues.length,
      venues,
    });
  } catch (error) {
    console.error("Fetch venues error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch venues",
    });
  }
});





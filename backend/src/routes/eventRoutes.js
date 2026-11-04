const express = require("express");
const router = express.Router();
const db = require("../config/db");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// GET events belonging to the logged-in organizer
router.get(
  "/mine",
  authenticateToken,
  authorizeRole("organizer"),
  async (req, res) => {
    try {
      const events = await db.event.findMany({
        where: {
          organizerId: req.user.userId,
        },
        include: {
          venue: {
            select: {
              venueName: true,
              location: true,
              capacity: true,
            },
          },
          _count: {
            select: {
              registrations: {
                where: {
                  status: "Registered",
                },
              },
            },
          },
        },
        orderBy: [
          { eventDate: "asc" },
          { startTime: "asc" },
        ],
      });

      const formattedEvents = events.map((event) => ({
        event_id: event.eventId,
        title: event.title,
        description: event.description,
        event_date: event.eventDate.toISOString().split("T")[0],
        start_time: event.startTime.toISOString().split("T")[1].slice(0, 8),
        end_time: event.endTime.toISOString().split("T")[1].slice(0, 8),
        max_participants: event.maxParticipants,
        registrations: event._count.registrations,
        status: event.status,
        venue_name: event.venue.venueName,
        venue_location: event.venue.location,
        venue_capacity: event.venue.capacity,
      }));

      return res.json({
        success: true,
        count: formattedEvents.length,
        total_registrations: formattedEvents.reduce(
          (total, event) => total + event.registrations,
          0
        ),
        events: formattedEvents,
      });
    } catch (error) {
      console.error("Error fetching organizer events:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve organizer events",
      });
    }
  }
);

// GET all events - public access
router.get("/", async (req, res) => {
  try {
    const events = await db.event.findMany({
      include: {
        organizer: {
          select: { name: true },
        },
        venue: {
          select: {
            venueName: true,
            location: true,
            capacity: true,
          },
        },
      },
      orderBy: [
        { eventDate: "asc" },
        { startTime: "asc" },
      ],
    });

    const formattedEvents = events.map((event) => ({
      event_id: event.eventId,
      title: event.title,
      description: event.description,
      event_date: event.eventDate.toISOString().split("T")[0],
      start_time: event.startTime.toISOString().split("T")[1].slice(0, 8),
      end_time: event.endTime.toISOString().split("T")[1].slice(0, 8),
      max_participants: event.maxParticipants,
      status: event.status,
      organizer_name: event.organizer.name,
      venue_name: event.venue.venueName,
      venue_location: event.venue.location,
      venue_capacity: event.venue.capacity,
    }));

    return res.json({
      success: true,
      count: formattedEvents.length,
      events: formattedEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
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
      const venue = await db.venue.findUnique({
        where: { venueId: Number(venue_id) },
      });

      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found",
        });
      }

      if (Number(max_participants) > venue.capacity) {
        return res.status(400).json({
          success: false,
          message: "Maximum participants cannot exceed venue capacity",
        });
      }

      const event = await db.event.create({
        data: {
          title: title.trim(),
          description: description || "",
          eventDate: new Date(`${event_date}T00:00:00.000Z`),
          startTime: new Date(`1970-01-01T${start_time}Z`),
          endTime: new Date(`1970-01-01T${end_time}Z`),
          organizerId: req.user.userId,
          venueId: Number(venue_id),
          maxParticipants: Number(max_participants),
          status: "Upcoming",
        },
      });

      return res.status(201).json({
        success: true,
        message: "Event created successfully",
        event_id: event.eventId,
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

const express = require("express");
const router = express.Router();
const db = require("../config/db");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// GET registrations belonging to the logged-in student
router.get(
  "/my",
  authenticateToken,
  authorizeRole("student"),
  async (req, res) => {
    try {
      const registrations = await db.registration.findMany({
        where: {
          studentId: req.user.userId,
        },
        include: {
          event: {
            select: {
              title: true,
              eventDate: true,
              startTime: true,
              endTime: true,
              status: true,
              venue: {
                select: {
                  venueName: true,
                  location: true,
                },
              },
            },
          },
        },
        orderBy: {
          registrationDate: "desc",
        },
      });

      const formattedRegistrations = registrations.map((r) => ({
        registration_id: r.registrationId,
        event_id: r.eventId,
        event_title: r.event.title,
        event_date: r.event.eventDate,
        start_time: r.event.startTime,
        end_time: r.event.endTime,
        venue_name: r.event.venue.venueName,
        venue_location: r.event.venue.location,
        event_status: r.event.status,
        registration_date: r.registrationDate,
        registration_status: r.status,
      }));

      return res.json({
        success: true,
        count: formattedRegistrations.length,
        registrations: formattedRegistrations,
      });
    } catch (error) {
      console.error("Error fetching student registrations:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve your registrations",
      });
    }
  }
);

// GET registrations belonging to the logged-in organizer
router.get(
  "/",
  authenticateToken,
  authorizeRole("organizer"),
  async (req, res) => {
    try {
      const eventId = req.query.eventId
        ? Number(req.query.eventId)
        : null;

      if (
        eventId !== null &&
        (!Number.isInteger(eventId) || eventId <= 0)
      ) {
        return res.status(400).json({
          success: false,
          message: "A valid eventId is required",
        });
      }

      const registrations = await db.registration.findMany({
        where: {
          ...(eventId !== null ? { eventId } : {}),
          event: {
            organizerId: req.user.userId,
          },
        },
        include: {
          student: {
            select: {
              name: true,
              email: true,
              department: true,
              yearOfStudy: true,
            },
          },
          event: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          registrationDate: "desc",
        },
      });

      const formattedRegistrations = registrations.map((r) => ({
        registration_id: r.registrationId,
        student_id: r.studentId,
        student_name: r.student.name,
        student_email: r.student.email,
        department: r.student.department,
        year_of_study: r.student.yearOfStudy,
        event_id: r.eventId,
        event_title: r.event.title,
        registration_date: r.registrationDate,
        status: r.status,
      }));

      return res.json({
        success: true,
        count: formattedRegistrations.length,
        registrations: formattedRegistrations,
      });
    } catch (error) {
      console.error("Error fetching registrations:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve registrations",
      });
    }
  }
);

// POST a new registration - students only
router.post(
  "/",
  authenticateToken,
  authorizeRole("student"),
  async (req, res) => {
    const eventId = Number(req.body.event_id);
    const studentId = req.user.userId;

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid event_id is required",
      });
    }

    try {
      const result = await db.$transaction(
        async (tx) => {
          // Lock the event row to prevent overbooking.
          await tx.$queryRaw`
            SELECT event_id
            FROM "EVENT"
            WHERE event_id = ${eventId}
            FOR UPDATE
          `;

          const event = await tx.event.findUnique({
            where: { eventId },
          });

          if (!event) {
            return { error: "NOT_FOUND" };
          }

          if (event.status === "Cancelled") {
            return { error: "CANCELLED" };
          }

          const currentCount = await tx.registration.count({
            where: {
              eventId,
              status: "Registered",
            },
          });

          if (currentCount >= event.maxParticipants) {
            return { error: "FULL" };
          }

          const registration = await tx.registration.create({
            data: {
              studentId,
              eventId,
              status: "Registered",
            },
          });

          return {
            registrationId: registration.registrationId,
          };
        },
        {
          maxWait: 10000,
          timeout: 30000,
        }
      );

      if (result.error === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      if (result.error === "CANCELLED") {
        return res.status(409).json({
          success: false,
          message: "This event has been cancelled",
        });
      }

      if (result.error === "FULL") {
        return res.status(409).json({
          success: false,
          message: "Sorry, this event is full",
        });
      }

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        registration_id: result.registrationId,
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "You are already registered for this event",
        });
      }

      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed due to a server error",
      });
    }
  }
);

module.exports = router;

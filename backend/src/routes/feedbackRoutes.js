const express = require("express");
const router = express.Router();
const db = require("../config/db");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

// GET all feedback - public access
router.get("/", async (req, res) => {
  try {
    const feedback = await db.feedback.findMany({
      include: {
        student: {
          select: { name: true },
        },
        event: {
          select: { title: true },
        },
      },
      orderBy: {
        feedbackDate: "desc",
      },
    });

    const formattedFeedback = feedback.map((f) => ({
      feedback_id: f.feedbackId,
      student_id: f.studentId,
      student_name: f.student.name,
      event_id: f.eventId,
      event_title: f.event.title,
      rating: f.rating,
      comments: f.comments,
      feedback_date: f.feedbackDate,
    }));

    return res.json({
      success: true,
      count: formattedFeedback.length,
      feedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve feedback",
    });
  }
});

// POST feedback - authenticated students only
router.post(
  "/",
  authenticateToken,
  authorizeRole("student"),
  async (req, res) => {
    const studentId = req.user.userId;
    const { event_id, rating, comments } = req.body;

    const eventId = Number(event_id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid event_id is required",
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
      const event = await db.event.findUnique({
        where: { eventId },
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      const feedback = await db.feedback.create({
        data: {
          studentId,
          eventId,
          rating,
          comments: comments ?? null,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Feedback submitted successfully",
        feedback_id: feedback.feedbackId,
      });
    } catch (error) {
      if (error.code === "P2002") {
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
  }
);

module.exports = router;

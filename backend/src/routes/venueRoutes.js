const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all venues
router.get("/", async (req, res) => {
  try {
    const venues = await db.venue.findMany({
      orderBy: {
        venueId: "asc",
      },
    });

    const formattedVenues = venues.map((venue) => ({
      venue_id: venue.venueId,
      venue_name: venue.venueName,
      location: venue.location,
      capacity: venue.capacity,
    }));

    return res.json({
      success: true,
      count: formattedVenues.length,
      venues: formattedVenues,
    });
  } catch (error) {
    console.error("Error fetching venues:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve venues",
    });
  }
});

module.exports = router;

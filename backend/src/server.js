const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Smart Campus Event Management API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is working",
  });
});

// Event routes
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);

// Venue routes
const venueRoutes = require("./routes/venueRoutes");
app.use("/api/venues", venueRoutes);

// Registration routes
const registrationRoutes = require("./routes/registrationRoutes");
app.use("/api/registrations", registrationRoutes);

// Feedback routes
const feedbackRoutes = require("./routes/feedbackRoutes");
app.use("/api/feedback", feedbackRoutes);

// Authentication routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const PORT = Number(process.env.PORT || 5001);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

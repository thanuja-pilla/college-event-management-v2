const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const Event = require("./models/Event");

const app = express();

// ---------------------------
// MIDDLEWARE
// ---------------------------
app.use(cors());
app.use(express.json());

// Serve STATIC FILES (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------
// DATABASE CONNECTION
// ---------------------------
mongoose
  .connect(
    process.env.MONGO_URL ||
      "mongodb+srv://admin:admin123@cluster0.bj9j8wp.mongodb.net/college-events?retryWrites=true&w=majority"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ---------------------------
// API ROUTES
// ---------------------------

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add event
app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.json({ message: "Event added!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add event" });
  }
});

// Delete event
app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// ---------------------------
// SPA FALLBACK (PREVENT Cannot GET /)
// ---------------------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------------------------
// START SERVER
// ---------------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

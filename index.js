const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const Event = require("./models/Event");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Database
mongoose
  .connect(
    process.env.MONGO_URL ||
      "mongodb+srv://admin:admin123@cluster0.bj9j8wp.mongodb.net/college-events?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database Error:", err));

// API Routes
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.json({ message: "Event added!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add event" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// FIX: Safe fallback route for SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config(); // load env variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const Event = require("./models/Event"); // Make sure models/Event.js exists

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching events." });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ message: "✅ Event added successfully." });
  } catch (err) {
    res.status(400).json({ error: "❌ Failed to add event." });
  }
});

// DELETE event (only for qadmin)
app.delete("/api/events/:id", async (req, res) => {
  try {
    const user = req.query.user; // check query param for user
    if (user !== "qadmin") {
      return res.status(403).json({ error: "❌ Unauthorized" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "❌ Event not found" });
    }

    res.json({ message: "✅ Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting event." });
  }
});

// Fallback route for frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});

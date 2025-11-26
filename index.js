const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection failed:", err));

// Event schema
const eventSchema = new mongoose.Schema({
  name: String,
  type: String,
  startDate: String,
  endDate: String,
  url: String,
  description: String,
  eligibility: String,
});

const Event = mongoose.model("Event", eventSchema);

// GET all events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching events." });
  }
});

// POST a new event
app.post("/api/events", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json({ message: "✅ Event added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while adding event." });
  }
});

// DELETE an event (admin only)
app.delete("/api/events/:id", async (req, res) => {
  try {
    // Check admin from header
    const isAdmin = req.headers["x-admin"] === "true";
    if (!isAdmin) return res.status(403).json({ error: "❌ Unauthorized" });

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "❌ Event not found" });

    res.json({ message: "✅ Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting event." });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

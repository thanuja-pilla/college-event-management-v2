const mongoose = require("mongoose");

// Event model
const Event = require("./models/Event"); // Make sure this path is correct

mongoose
  .connect(
    "mongodb+srv://admin:admin123@cluster0.bj9j8wp.mongodb.net/college-events?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
    testDelete();
  })
  .catch((err) => console.error("❌ Connection failed:", err));

async function testDelete() {
  try {
    const events = await Event.find();
    console.log("📋 Current events:");
    console.log(events);

    if (events.length === 0) {
      console.log("No events to delete.");
      process.exit();
    }

    // Delete the first event (or replace with any specific ID)
    const idToDelete = events[0]._id;
    const deleted = await Event.findByIdAndDelete(idToDelete);
    console.log(`🗑️ Deleted event:`, deleted);

    const remaining = await Event.find();
    console.log("📋 Remaining events:");
    console.log(remaining);

    process.exit();
  } catch (err) {
    console.error("❌ Error during test delete:", err);
    process.exit(1);
  }
}

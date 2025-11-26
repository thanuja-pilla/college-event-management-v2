const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin:admin123@cluster0.bj9j8wp.mongodb.net/college-events?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection failed:", err));

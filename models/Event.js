const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  eligibility: { type: String },
  description: { type: String },
  url: { type: String },
});

module.exports = mongoose.model("Event", eventSchema);

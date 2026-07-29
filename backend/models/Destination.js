const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "India" },
    state: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    gallery: [{ url: String, public_id: String }],
    coordinates: {
      lat: Number,
      lng: Number,
    },
    bestTimeToVisit: { type: String }, // e.g. "October to March"
    tags: [{ type: String }], // e.g. Heritage, Beach, Hill Station, Wildlife
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

destinationSchema.index({ name: "text", city: "text", state: "text", country: "text" });

module.exports = mongoose.model("Destination", destinationSchema);

const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
    duration: {
      days: { type: Number, required: true },
      nights: { type: Number, required: true },
    },
    price: { type: Number, required: true }, // per person, in INR
    itinerary: [itineraryDaySchema],
    included: [{ type: String }],
    excluded: [{ type: String }],
    gallery: [{ url: String, public_id: String }],
    packageType: {
      type: String,
      enum: ["Adventure", "Luxury", "Family", "Honeymoon", "Pilgrimage", "Wildlife", "Cultural"],
      default: "Cultural",
    },
    maxGroupSize: { type: Number, default: 15 },
    startDates: [{ type: Date }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

packageSchema.index({ name: "text", packageType: "text" });

module.exports = mongoose.model("Package", packageSchema);

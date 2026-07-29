const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ url: String, public_id: String }],
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String },
      country: { type: String, required: true, default: "India" },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    amenities: [{ type: String }], // e.g. WiFi, Pool, Spa, Parking, Breakfast
    hotelType: {
      type: String,
      enum: ["Budget", "Standard", "Luxury", "Resort", "Boutique", "Heritage"],
      default: "Standard",
    },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

hotelSchema.index({ name: "text", "location.city": "text", "location.country": "text" });

module.exports = mongoose.model("Hotel", hotelSchema);

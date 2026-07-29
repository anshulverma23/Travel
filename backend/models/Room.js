const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Twin", "Deluxe", "Suite", "Family"],
      required: true,
    },
    price: { type: Number, required: true }, // price per night, in INR
    capacity: { type: Number, required: true, default: 2 },
    totalRooms: { type: Number, required: true, default: 1 },
    amenities: [{ type: String }],
    images: [{ url: String, public_id: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);

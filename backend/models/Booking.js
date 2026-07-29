const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bookingType: { type: String, enum: ["hotel", "package"], required: true },

    // Hotel booking fields
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    numberOfRooms: { type: Number, default: 1 },
    checkIn: { type: Date },
    checkOut: { type: Date },

    // Package booking fields
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    travelDate: { type: Date },

    guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },

    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },

    pricing: {
      basePrice: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },

    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    invoiceNumber: { type: String, unique: true },
    specialRequests: { type: String },
  },
  { timestamps: true }
);

// Auto-generate a human readable invoice number before saving a new booking
bookingSchema.pre("save", function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);

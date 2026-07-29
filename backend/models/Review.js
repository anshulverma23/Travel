const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, enum: ["hotel", "package"], required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    images: [{ url: String, public_id: String }],
    isVerifiedBooking: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// A user can only leave one review per hotel and one per package
reviewSchema.index({ user: 1, hotel: 1 }, { unique: true, partialFilterExpression: { hotel: { $exists: true } } });
reviewSchema.index({ user: 1, package: 1 }, { unique: true, partialFilterExpression: { package: { $exists: true } } });

// Recalculates the parent Hotel/Package's average rating + review count
reviewSchema.statics.recalculateRating = async function (targetType, targetId) {
  const Model = targetType === "hotel" ? require("./Hotel") : require("./Package");
  const field = targetType === "hotel" ? "hotel" : "package";

  const stats = await this.aggregate([
    { $match: { [field]: targetId } },
    { $group: { _id: `$${field}`, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await Model.findByIdAndUpdate(targetId, {
    rating: stats[0]?.avgRating ? Math.round(stats[0].avgRating * 10) / 10 : 0,
    numReviews: stats[0]?.count || 0,
  });
};

module.exports = mongoose.model("Review", reviewSchema);

const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        // Stores the exact Mongoose model name ("Hotel" or "Package") because
        // refPath resolves the referenced model from this field's literal value.
        itemType: { type: String, enum: ["Hotel", "Package"], required: true },
        item: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "items.itemType" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);

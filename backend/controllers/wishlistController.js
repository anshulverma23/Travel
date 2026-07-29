const asyncHandler = require("express-async-handler");
const Wishlist = require("../models/Wishlist");

// @desc    Get the logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("items.item");
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }
  res.status(200).json({ success: true, wishlist });
});

// @desc    Add a hotel or package to the wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { itemType, itemId } = req.body; // itemType: "Hotel" | "Package"

  if (!["Hotel", "Package"].includes(itemType)) {
    res.status(400);
    throw new Error("itemType must be 'Hotel' or 'Package'");
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  const alreadyExists = wishlist.items.some(
    (i) => i.itemType === itemType && i.item.toString() === itemId
  );
  if (alreadyExists) {
    res.status(400);
    throw new Error("Item is already in your wishlist");
  }

  wishlist.items.push({ itemType, item: itemId });
  await wishlist.save();

  res.status(201).json({ success: true, wishlist });
});

// @desc    Remove an item from the wishlist
// @route   DELETE /api/wishlist/:itemId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.items = wishlist.items.filter((i) => i.item.toString() !== req.params.itemId);
  await wishlist.save();

  res.status(200).json({ success: true, wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };

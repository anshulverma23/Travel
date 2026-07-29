const asyncHandler = require("express-async-handler");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const { deleteImage } = require("../config/cloudinary");

// @desc    Create a review for a hotel or package
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { targetType, hotelId, packageId, rating, comment } = req.body;

  if (!["hotel", "package"].includes(targetType)) {
    res.status(400);
    throw new Error("targetType must be 'hotel' or 'package'");
  }

  const targetId = targetType === "hotel" ? hotelId : packageId;

  // Mark as a verified review if the user has a completed booking for this item
  const isVerifiedBooking = !!(await Booking.findOne({
    user: req.user._id,
    bookingStatus: "completed",
    ...(targetType === "hotel" ? { hotel: targetId } : { package: targetId }),
  }));

  const images = (req.files || []).map((f) => ({ url: f.path, public_id: f.filename }));

  const review = await Review.create({
    user: req.user._id,
    targetType,
    hotel: targetType === "hotel" ? targetId : undefined,
    package: targetType === "package" ? targetId : undefined,
    rating,
    comment,
    images,
    isVerifiedBooking,
  });

  await Review.recalculateRating(targetType, targetId);

  res.status(201).json({ success: true, review });
});

// @desc    Get all reviews for a hotel
// @route   GET /api/reviews/hotel/:hotelId
// @access  Public
const getHotelReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ hotel: req.params.hotelId }).populate("user", "name avatar").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Get all reviews for a package
// @route   GET /api/reviews/package/:packageId
// @access  Public
const getPackageReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ package: req.params.packageId }).populate("user", "name avatar").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Update your own review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this review");
  }

  review.rating = req.body.rating ?? review.rating;
  review.comment = req.body.comment ?? review.comment;
  if (req.files?.length) {
    review.images.push(...req.files.map((f) => ({ url: f.path, public_id: f.filename })));
  }
  await review.save();

  await Review.recalculateRating(review.targetType, review.hotel || review.package);

  res.status(200).json({ success: true, review });
});

// @desc    Delete your own review (or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await Promise.all(review.images.map((img) => deleteImage(img.public_id)));
  const { targetType, hotel, package: pkg } = review;
  await review.deleteOne();

  await Review.recalculateRating(targetType, hotel || pkg);

  res.status(200).json({ success: true, message: "Review deleted successfully" });
});

// @desc    Get all reviews (admin) - across hotels and packages
// @route   GET /api/reviews?page=&limit=
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find()
    .populate("user", "name avatar")
    .populate("hotel", "name")
    .populate("package", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments();

  res.status(200).json({ success: true, count: reviews.length, total, reviews });
});

module.exports = { createReview, getHotelReviews, getPackageReviews, getAllReviews, updateReview, deleteReview };

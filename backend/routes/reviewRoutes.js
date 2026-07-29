const express = require("express");
const {
  createReview,
  getHotelReviews,
  getPackageReviews,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { makeUploader } = require("../config/cloudinary");

const router = express.Router();
const uploadReviewImages = makeUploader("reviews");

router.post("/", protect, uploadReviewImages.array("images", 4), createReview);
router.get("/", protect, admin, getAllReviews);
router.get("/hotel/:hotelId", getHotelReviews);
router.get("/package/:packageId", getPackageReviews);
router.put("/:id", protect, uploadReviewImages.array("images", 4), updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;

const express = require("express");
const {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { makeUploader } = require("../config/cloudinary");

const router = express.Router();
const uploadGallery = makeUploader("packages");

router.get("/", getPackages);
router.post("/", protect, admin, uploadGallery.array("gallery", 10), createPackage);

router.get("/:id", getPackageById);
router.put("/:id", protect, admin, uploadGallery.array("gallery", 10), updatePackage);
router.delete("/:id", protect, admin, deletePackage);

module.exports = router;

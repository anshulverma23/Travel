const express = require("express");
const { getProfile, updateProfile, getAllUsers, updateUser, deleteUser } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { makeUploader } = require("../config/cloudinary");

const router = express.Router();
const uploadAvatar = makeUploader("avatars");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadAvatar.single("avatar"), updateProfile);

// Admin: manage users
router.get("/", protect, admin, getAllUsers);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;

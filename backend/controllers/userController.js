const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { deleteImage } = require("../config/cloudinary");

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @desc    Update current user's profile (name, phone, avatar)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  if (req.file) {
    if (user.avatar?.public_id) await deleteImage(user.avatar.public_id);
    user.avatar = { url: req.file.path, public_id: req.file.filename };
  }

  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Get all users (admin)
// @route   GET /api/users?search=&role=&page=&limit=
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }];

  const skip = (Number(page) - 1) * Number(limit);
  const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await User.countDocuments(query);

  res.status(200).json({ success: true, count: users.length, total, users });
});

// @desc    Update a user's role or active status (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.body.role) user.role = req.body.role;
  if (typeof req.body.isActive === "boolean") user.isActive = req.body.isActive;
  await user.save();

  res.status(200).json({ success: true, user });
});

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

module.exports = { getProfile, updateProfile, getAllUsers, updateUser, deleteUser };

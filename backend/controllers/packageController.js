const asyncHandler = require("express-async-handler");
const Package = require("../models/Package");
const { deleteImage } = require("../config/cloudinary");

// @desc    Get all packages (search + filter + pagination)
// @route   GET /api/packages?search=&packageType=&minPrice=&maxPrice=&duration=&destination=&page=&limit=
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
  const { search, packageType, minPrice, maxPrice, duration, destination, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };
  if (packageType) query.packageType = packageType;
  if (destination) query.destination = destination;
  if (duration) query["duration.days"] = Number(duration);
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const packages = await Package.find(query)
    .populate("destination", "name city state")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Package.countDocuments(query);

  res.status(200).json({
    success: true,
    count: packages.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    packages,
  });
});

// @desc    Get a single package
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id).populate("destination", "name city state country");
  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }
  res.status(200).json({ success: true, package: pkg });
});

// @desc    Create a tour package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = asyncHandler(async (req, res) => {
  const gallery = (req.files || []).map((f) => ({ url: f.path, public_id: f.filename }));

  const pkg = await Package.create({
    ...req.body,
    duration: typeof req.body.duration === "string" ? JSON.parse(req.body.duration) : req.body.duration,
    itinerary: req.body.itinerary ? JSON.parse(req.body.itinerary) : [],
    included: req.body.included ? JSON.parse(req.body.included) : [],
    excluded: req.body.excluded ? JSON.parse(req.body.excluded) : [],
    startDates: req.body.startDates ? JSON.parse(req.body.startDates) : [],
    gallery,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, package: pkg });
});

// @desc    Update a tour package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }

  const updates = { ...req.body };
  ["duration", "itinerary", "included", "excluded", "startDates"].forEach((field) => {
    if (updates[field] && typeof updates[field] === "string") updates[field] = JSON.parse(updates[field]);
  });
  if (req.files?.length) {
    updates.gallery = [...pkg.gallery, ...req.files.map((f) => ({ url: f.path, public_id: f.filename }))];
  }

  Object.assign(pkg, updates);
  await pkg.save();

  res.status(200).json({ success: true, package: pkg });
});

// @desc    Delete a tour package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);
  if (!pkg) {
    res.status(404);
    throw new Error("Package not found");
  }

  await Promise.all(pkg.gallery.map((img) => deleteImage(img.public_id)));
  await pkg.deleteOne();

  res.status(200).json({ success: true, message: "Package deleted successfully" });
});

module.exports = { getPackages, getPackageById, createPackage, updatePackage, deletePackage };

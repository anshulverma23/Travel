const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { Readable } = require("stream");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Files are held in memory only briefly, then streamed straight to Cloudinary below -
// nothing touches disk, which keeps this safe on ephemeral hosts like Render/Vercel.
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `india-travel/${folder}`,
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    Readable.from(buffer).pipe(uploadStream);
  });

/**
 * Returns { array(fieldName, maxCount), single(fieldName) } - each gives back an
 * Express middleware chain that parses the multipart upload into memory, pushes the
 * buffer(s) to Cloudinary, then rewrites req.files/req.file to { path, filename }
 * (secure_url + public_id) so controllers can use them exactly like disk-based multer.
 */
const makeUploader = (folder) => {
  const array = (fieldName, maxCount) => [
    memoryUpload.array(fieldName, maxCount),
    async (req, res, next) => {
      try {
        if (!req.files || req.files.length === 0) return next();
        const uploaded = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, folder)));
        req.files = uploaded.map((r) => ({ path: r.secure_url, filename: r.public_id }));
        next();
      } catch (err) {
        next(err);
      }
    },
  ];

  const single = (fieldName) => [
    memoryUpload.single(fieldName),
    async (req, res, next) => {
      try {
        if (!req.file) return next();
        const result = await uploadBufferToCloudinary(req.file.buffer, folder);
        req.file = { path: result.secure_url, filename: result.public_id };
        next();
      } catch (err) {
        next(err);
      }
    },
  ];

  return { array, single };
};

// Removes an image from Cloudinary given its public_id (used on delete/replace)
const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error:", err.message);
  }
};

module.exports = { cloudinary, makeUploader, deleteImage };

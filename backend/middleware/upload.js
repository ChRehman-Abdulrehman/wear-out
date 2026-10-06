const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExt = /\.(jpe?g|png|webp|gif)$/i;
  if (allowedMimes.includes(file.mimetype) && allowedExt.test(file.originalname || '')) cb(null, true);
  else cb(new Error('Only image files (jpg, png, webp, gif) are allowed'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'wearout/products', transformation: [{ width: 800, height: 1000, crop: 'limit' }] },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(file.buffer).pipe(stream);
  });
}

module.exports = upload;
module.exports.uploadToCloudinary = uploadToCloudinary;

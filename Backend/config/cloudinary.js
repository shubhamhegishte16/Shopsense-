const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shopsense_receipts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    transformation: [{ width: 1000, crop: 'limit' }] // Compress image to improve OCR and save space
  }
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };

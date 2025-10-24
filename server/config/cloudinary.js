const cloudinary = require('cloudinary').v2;

let isConfigured = false;

const configureCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary environment variables are not fully configured. File uploads will be skipped.');
    isConfigured = false;
    return;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  isConfigured = true;
};

const isCloudinaryConfigured = () => isConfigured;

module.exports = {
  cloudinary,
  configureCloudinary,
  isCloudinaryConfigured,
};

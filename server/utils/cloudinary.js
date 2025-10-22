const streamifier = require('streamifier');
const { cloudinary } = require('../config/cloudinary');

const uploadToCloudinary = (buffer, folder = 'bugtrace/issues') =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

module.exports = {
  uploadToCloudinary,
};

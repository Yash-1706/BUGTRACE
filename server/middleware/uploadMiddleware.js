const multer = require('multer');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 5 },
  fileFilter,
});

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Unsupported file type') {
    return res.status(400).json({ message: err.message });
  }
  return next(err);
};

module.exports = {
  upload,
  multerErrorHandler,
};

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { MAX_FILE_SIZE, MAX_IMAGE_SIZE } = require('../constants/image');
const { CustomError } = require('../utils/error');

const allowedMimeTypes = [
  'image/jpeg', 'image/png', // Image files
  'application/pdf', // PDF files
  'application/msword', // Microsoft Word
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word .docx
  'application/vnd.ms-excel', // Excel .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel .xlsx
  'text/csv', // CSV files
  'application/vnd.oasis.opendocument.spreadsheet', // OpenDocument Spreadsheet (.ods)
  'application/vnd.ms-excel.sheet.macroEnabled.12', // Excel with macros (.xlsm)
];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let entityType = req.baseUrl.split('/')[1] || 'vehicles'; // Default to vehicles if not specified

    // Normalize the entityType to lowercase and plural form for directory naming
    entityType = entityType.toLowerCase();

    const uploadsPath = path.join(__dirname, '../../', 'uploads', entityType);

    // Check if the directory exists, and if not, create it
    fs.mkdirSync(uploadsPath, { recursive: true });

    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

// Multer middleware for handling file uploads
exports.upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // 20 MB file size limit
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});


const driverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    if (file.fieldname === 'picture') {
      uploadPath = 'uploads/drivers/pictures';
    } else {

      let entityType = req.baseUrl.split('/')[1] || 'drivers'; // Default to drivers if not specified
      entityType = entityType.toLowerCase();
      uploadPath = path.join(__dirname, '../../', 'uploads', `${entityType}/attachments`);
    }

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.originalname + '-' + uniqueSuffix + fileExtension);
  }
});

// Combined file filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'picture') {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (!extname || !mimetype) {
      return cb(new CustomError('Only images are allowed in picture field', 422), false);
    }
  } else if (file.fieldname === 'attachments') {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new CustomError('Invalid file type in attachments field', 422), false);
    }
  } else {
    return cb(new CustomError('Unknown field key', 422), false);
  }

  cb(null, true);
};

// Combined multer instance for both picture and attachments
exports.driverUpload = multer({
  storage: driverStorage,
  fileFilter: fileFilter
}).fields([
  { name: 'picture', maxCount: 1 },
  { name: 'attachments', maxCount: 30 }
]);

exports.validateFileSizes = (req, res, next) => {
  const files = req.files;

  if (files && files.picture) {
    const pictureFile = files.picture[0];
    if (pictureFile.size > MAX_IMAGE_SIZE) {
      return res.status(422).json({ error: 'Picture file size exceeds 5MB limit' });
    }
  }

  if (files && files.attachments) {
    for (const file of files.attachments) {
      if (file.size > MAX_FILE_SIZE) {
        return res.status(422).json({ error: `Attachment ${file.originalname} exceeds 20MB limit` });
      }
    }
  }

  next();
};

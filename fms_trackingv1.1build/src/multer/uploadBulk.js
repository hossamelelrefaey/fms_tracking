const multer = require('multer');
const { MAX_FILE_SIZE } = require('../constants/image');
const { CustomError } = require('../utils/error');
const { BAD_REQUEST } = require('../constants/status-codes');

const allowedMimeTypes = [
    'application/vnd.ms-excel', // Excel .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel .xlsx
    'text/csv', // CSV files
];

// Set up multer with a file size limit of 20MB and file type validation
const uploadVehicleAndDriverBulk = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE }, // 20MB limit
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new CustomError('Invalid file type. Only Excel and CSV files are allowed.'), BAD_REQUEST); // Reject the file
        }
    }
}).single('file');

module.exports = uploadVehicleAndDriverBulk
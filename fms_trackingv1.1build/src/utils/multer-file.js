const multer = require("multer");
let path = require("path");
const { CustomError } = require("./error");
const { BAD_REQUEST } = require("../constants/status-codes");

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext.toLocaleLowerCase() !== ".xls" & ext.toLocaleLowerCase() !== ".xlsx") {
            cb(new CustomError(`a file with ${ext} extension is not supported to be uploaded`, BAD_REQUEST), false);
            return;
        }
        cb(null, true);
    },
});

module.exports = multer(upload).single("file");

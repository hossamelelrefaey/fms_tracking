const { UNPROCESSABLE_ENTITY } = require("../constants/status-codes");

module.exports = (err, req, res, next) => {
    if (err.message === "Invalid file type") {
        err.statusCode = UNPROCESSABLE_ENTITY;
        err.message = "Invalid file type. Only images, documents, Excel sheets, and CSV files are allowed"
    }
    else if (err.message == "File too large") {
        err.statusCode = UNPROCESSABLE_ENTITY;
        err.message = "File size must be less than 20 MB"
    }
    else if (err.code == 'LIMIT_UNEXPECTED_FILE') {
        err.statusCode = UNPROCESSABLE_ENTITY;
        err.message = `field (${err.field}) can not accept more than ${err.field == 'picture' ? "1 file" : "10 files"}`
    }

    next(err);
};

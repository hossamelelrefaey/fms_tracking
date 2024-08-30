
const multer = require("multer");

let multerConfig = {
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const regex = /^image\//g;
    if (file.mimetype.match(regex)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
};

module.exports = multer(multerConfig).single("image");
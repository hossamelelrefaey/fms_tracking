const multer = require("multer")
const { MAX_IMAGE_SIZE } = require("../constants/image")

let multerConfig = {
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMAGE_SIZE },
    fileFilter: (req, file, cd) => {
        const regex = /^image\//g;
        if (file.mimetype.match(regex)) {
            cd(null, true);
        } else {
            cd(null, false)
        }
    },
};


module.exports = multer(multerConfig).single("image");
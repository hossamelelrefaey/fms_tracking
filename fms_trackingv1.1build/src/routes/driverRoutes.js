const express = require('express');
const driverController = require('../controllers/driverController');
const driverValidator = require('../validators/driver');
const generalValidator = require('../validators/general');
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../validators/validateRequest");
const validateDriverExcell = require("../middlewares/validateDriverExcell")
const { driverUpload, validateFileSizes } = require("../multer/uplaod")
const uploadDriverBulk = require('../multer/uploadBulk');
const router = express.Router();

router.post(
    '/register',
    driverUpload,
    validateFileSizes,
    validateRequestBody(driverValidator.create),
    driverController.registerDriver
);

router.get(
    '/:id',
    validateRequestParams(generalValidator.getById),
    driverController.viewDriver

);

router.put(
    '/:id',
    driverUpload,
    validateFileSizes,
    validateRequestBody(driverValidator.update),
    driverController.editDriver
);

router.delete(
    '/:id',
    validateRequestParams(generalValidator.getById),
    driverController.deleteDriver
);

router.get(
    '/',
    validateRequestQuery(generalValidator.getAll),
    driverController.listDrivers
);

router.post(
    '/bulk-upload',
    uploadDriverBulk,
    validateDriverExcell,
    driverController.bulkUploadDrivers
);

router.put(
    '/attachments/:id',
    driverUpload,
    validateFileSizes,
    validateRequestParams(generalValidator.getById),
    driverController.updateDriverAttachments
);

router.delete(
    '/attachments/:id',
    validateRequestParams(generalValidator.getById),
    driverController.deleteDriverAttachments
);

router.delete(
    '/picture/:id',
    validateRequestParams(generalValidator.getById),
    driverController.deleteDriverProfilePicture
);

module.exports = router;

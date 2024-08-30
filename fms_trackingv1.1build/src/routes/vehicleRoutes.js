// src/routes/vehicleRoutes.js
const express = require('express');
const multer = require('multer');
const vehicleController = require('../controllers/vehicleController');
const vehicleValidator = require('../validators/vehicle');
const { validateRequestBody, validateRequestParams, validateRequestQuery } = require("../validators/validateRequest");
const { upload } = require('../multer/uplaod');
const validateVehiclesFromExcel = require('../middlewares/validateVehicleExcell');
const uploadVehicleBulk = require('../multer/uploadBulk');
const router = express.Router();

router.post(
    '/register',
    upload.array('attachments', 30), // Allow up to 10 attachments
    validateRequestBody(vehicleValidator.vehicleSchema),
    vehicleController.registerVehicle
);

router.get('/',
    validateRequestQuery(vehicleValidator.vehiclesQuerySchema),
    vehicleController.listVehicles,
);

router.get('/:id',
    vehicleController.viewVehicle
);

router.put(
    '/:id',
    validateRequestBody(vehicleValidator.updateVehicleSchema),
    vehicleController.editVehicle
);

router.put('/:id/attachments',
    upload.array('attachments', 30),
    vehicleController.updateVehicleAttachments
);

router.delete('/attachments/:id',
    vehicleController.deleteVehicleAttachments
);

router.delete('/:id',
    vehicleController.deleteVehicle
);

router.post('/bulk-upload',
    uploadVehicleBulk,
    validateVehiclesFromExcel,
    vehicleController.bulkCreateVehicles
);

module.exports = router;

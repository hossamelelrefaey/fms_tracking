// src/controllers/vehicleController.js
const { CREATED, BAD_REQUEST, CONFLICT, NOT_FOUND } = require('../constants/status-codes');
const vehicleModel = require('../models/vehicle');
const driverModel = require('../models/driver');
const { CustomError } = require('../utils/error');
const { convertVehicleDataTypes, mapAttachments, deleteFiles, handleFileUpdates, checkDriversIds } = require('../utils/vehicleConversion');
const path = require("path");
const traccarService = require('../services/traccar/devices.service');

//done
const registerVehicle = async (req, res, next) => {
  try {
    if (req.body.driverId) {
      const checkDriver = await driverModel.getDriverById(parseInt(req.body.driverId))
      if (!checkDriver) throw new CustomError("Driver Not found", NOT_FOUND)
    }
    const checkImei = await vehicleModel.getVehicleByQuery({ imei: req.body.imei })
    if (checkImei) throw new CustomError("Dublicated IMEI", CONFLICT)
    if (req.fileValidationError) throw new CustomError(req.fileValidationError, BAD_REQUEST);
    let attachments = []
    if (req.files) {
      attachments = mapAttachments(req.files, "vehicles");
    }
    let conversinVehicleData = convertVehicleDataTypes(req.body)
    await traccarService.createDevice(conversinVehicleData)
    const vehicle = await vehicleModel.createVehicle({ ...conversinVehicleData, attachments });
    res.status(CREATED).json(vehicle);

  } catch (err) {
    if (req.files) {
      const filePaths = req.files.map(file => path.join('uploads', "vehicles", file.filename));
      deleteFiles(filePaths);
    }
    next(err)
  }
};

//done
const viewVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleModel.getVehicleById(req.params.id);
    if (!vehicle) throw new CustomError('Vehicle not found', NOT_FOUND);

    res.json(vehicle);
  } catch (err) {
    next(err)
  }
};

//done
const editVehicle = async (req, res, next) => {
  try {
    console.log("executing");
    const vehicleId = parseInt(req.params.id, 10);

    const existingVehicle = await vehicleModel.getVehicleById(vehicleId);
    if (!existingVehicle) throw new CustomError('Vehicle not found.', NOT_FOUND);
    if (req.body.imei && req.body.imei !== existingVehicle.imei) {
      const vehicleWithSameIMEI = await vehicleModel.getVehicleByQuery({ NOT: { id: vehicleId }, imei: req.body.imei });
      if (vehicleWithSameIMEI) throw new CustomError('The provided IMEI is already in use by another vehicle.', CONFLICT);
    

    }

    if (req.body.driverId ) {
    const driver = await driverModel.getDriverById(+req.body.driverId)
    if(!driver) throw new CustomError('Driver not found, Please review Driver id and try again')
    }
    let conversinVehicleData = convertVehicleDataTypes(req.body)
    const updatedData = { ...conversinVehicleData };
    const updatedVehicle = await vehicleModel.updateVehicle(vehicleId, updatedData);
    const deviceid = await traccarService.getDeviceIdByIMEI(existingVehicle.imei)
    console.log("getDeviceIdByIMEI executed");
    await traccarService.updateDevice(deviceid, { "name": req.body?.name || existingVehicle.name, "uniqueid": req.body.imei })
    console.log("traccar sent")
    res.json(updatedVehicle);
  } catch (err) {
    console.log({ err });
    next(err)
  }
};

//done
const deleteVehicle = async (req, res, next) => {
  try {
    const ckeckvehicle = await vehicleModel.getVehicleByQuery({ id: parseInt(req.params.id) });
    // Collect file paths
    if (!ckeckvehicle) throw new CustomError("Vehicle not found", NOT_FOUND)
    const filePaths = ckeckvehicle?.attachments.map((attachment) => attachment.url.replace(`${process.env.BASE_URL}/uploads`, 'uploads'));
    // Delete files from the server
    deleteFiles(filePaths);
    await traccarService.deregisterIMEI(ckeckvehicle.imei);

    // const device = await traccarService.findDeviceByImei(ckeckvehicle.imei)
    // await traccarService.deregisterIMEI(device?.id || 1)
    let vehicle = await vehicleModel.deleteVehicle(req.params.id);
    res.status(200).send({ message: "Vehicle Deleted Successfully" });
  } catch (err) {
    next(err)
  }
};

const deleteVehicleAttachments = async (req, res, next) => {
  try {
    const ckeckvehicleAttach = await vehicleModel.getVehicleAttachmentById(parseInt(req.params.id));
    // Collect file paths
    if (!ckeckvehicleAttach) throw new CustomError("Attachment not found", NOT_FOUND)

    const filePaths = ckeckvehicleAttach?.url.replace(`${process.env.BASE_URL}/uploads`, 'uploads')
    // Delete files from the server
    deleteFiles([filePaths]);

    let attachment = await vehicleModel.deleteVehicleAttachmentById(parseInt(req.params.id));
    res.status(200).send({ message: "Attachment Deleted Successfully" });
  } catch (err) {
    next(err)
  }
};



//done
const listVehicles = async (req, res, next) => {
  try {
    const { page, limit, search, sortBy, sortOrder } = req.query
    const vehicles = await vehicleModel.getAllVehicles({ page, limit, search, sortBy, sortOrder });
    res.json(vehicles);
  } catch (err) {
    next(err)
  }
};



const bulkCreateVehicles = async (req, res, next) => {
  try {
    // Access the validated vehicles from the request object
    const validVehicles = req.validVehicles;

    // Check the number of records
    if (validVehicles.length > 2002) {
      throw new CustomError(`The sheet contains more than 2000 vehicles. Please reduce the number of vehicles and try again.`, BAD_REQUEST);
    }

    // Perform the bulk insert    
    const imeis = validVehicles.map(vehicle => vehicle.imei);
    const driverIds = checkDriversIds(validVehicles);    
    const checkDrivers = await driverModel.findDriversByIds(driverIds);    

    if (checkDrivers.length !== driverIds.length) {
      throw new CustomError(`There was a problem with the driver IDs provided in the Excel sheet. Some of the drivers were not found. Please review the IDs and try again.`, BAD_REQUEST);
    }

    const existingVehicles = await vehicleModel.findVehiclesByIMEIs(imeis);
    const existingIMEIs = existingVehicles.map(vehicle => vehicle.imei);

    if (existingIMEIs.length > 0) {
      throw new CustomError(`Duplicate IMEIs found [${existingIMEIs}].`, CONFLICT);
    }

    const devices = validVehicles.map(vehicle => ({
      name: vehicle.name,
      uniqueid: vehicle.imei
    }));

    await traccarService.createMultipleDevicesConcurrently(devices);
    const createdVehicles = await vehicleModel.bulkCreateVehicles(validVehicles);

    res.status(201).json({
      message: 'Vehicles created successfully.',
      createdCount: createdVehicles.count, // count is returned by createMany
    });

  } catch (err) {
    next(err);
  }
};

//done
const updateVehicleAttachments = async (req, res, next) => {
  try {
    const vehicleId = parseInt(req.params.id, 10);

    const existingVehicle = await vehicleModel.getVehicleById(vehicleId);
    if (!existingVehicle) throw new CustomError('Vehicle not found.', NOT_FOUND);

    let attachments = []
    if (req.files) {
      attachments = mapAttachments(req.files, "vehicles");
    }
    // Delete old attachments from DB and add new ones
    if (attachments.length > 0) {
      attachments = attachments.map((attachment) => {
        return { ...attachment, vehicleId }
      })
      const updatedAttatch = await vehicleModel.createManyAttachments(attachments);
      res.json({ message: "Attachements uploaded successfully", updatedAttatch });
    } else {
      throw new CustomError('No files provided for update.', BAD_REQUEST);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerVehicle,
  viewVehicle,
  editVehicle,
  deleteVehicle,
  listVehicles,
  bulkCreateVehicles,
  updateVehicleAttachments,
  deleteVehicleAttachments
};

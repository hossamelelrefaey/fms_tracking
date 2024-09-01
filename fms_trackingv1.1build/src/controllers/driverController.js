const { CREATED, NOT_FOUND, OK } = require('../constants/status-codes');
const driverService = require('../services/driversService');
const { CustomError } = require('../utils/error');
const { convertCreateDriverDataTypes, convertUpdateDriverDataTypes, delereFilesIfThereIsAnyErrors } = require("../utils/vehicleConversion")
const traccarDriversServices = require("../services/traccar/drivers.service")
const driverModel = require('../models/driver');
const { driver } = require('../prisma/prisma');


const registerDriver = async (req, res, next) => {
    try {
        let { body, files } = req
        body = convertCreateDriverDataTypes(body, files)
        const driver = await driverService.createDriver(body, files);
        res.status(CREATED).json(driver);
    } catch (err) {
        delereFilesIfThereIsAnyErrors(req.files)
        next(err);
    }
};

const viewDriver = async (req, res, next) => {
    try {
        let { id } = req.params
        const driver = await driverService.getDriverById(id);
        if (!driver) throw new CustomError('Driver not found', NOT_FOUND)
        return res.status(OK).json(driver);
    } catch (err) {
        next(err);
    }
};

const editDriver = async (req, res, next) => {
    try {
      console.log("executing");
      const drivereId = parseInt(req.params.id, 10);
  
      const existingDriver = await driverModel.getDriverById(drivereId);
      if (!existingDriver) throw new CustomError('Driver not found.', NOT_FOUND);
      if (req.body.code && req.body.code !== existingDriver.imei) {
        const driverWithSameCode = await driverModel.getDriverByQuery({ NOT: { id: drivereId }, code: req.body.code });
        if (driverWithSameCode) throw new CustomError('The provided code is already in use by another driver.', CONFLICT);
      
  
      }
  
      if (req.body.driverId ) {
      const driver = await driverModel.getDriverById(+req.body.driverId)
      if(!driver) throw new CustomError('Driver not found, Please review Driver id and try again')
      }
      let conversinDriverData = convertUpdateDriverDataTypes(req.body)
      const updatedData = { ...conversinDriverData };
      const updatedDriver = await driverModel.updateDriver(drivereId, updatedData);
      const driverId = await traccarDriversServices.getDriverIdByUniqueId(existingDriver.code)
      console.log("getDriverIdByUniqueId executed");
      await traccarDriversServices.updateDriver(driverId, { "name": req.body?.name || existingDriver.name, "uniqueid": req.body.code })
      console.log("traccar sent")
      res.json(updatedDriver);
    } catch (err) {
      console.log({ err });
      next(err)
    }
  };



const deleteDriver = async (req, res, next) => {
    try {
      // Check if the driver exists
      const checkDriver = await driverModel.getDriverByQuery({ id: parseInt(req.params.id) });
      console.log('driver id is %',checkDriver);

      if (!checkDriver) throw new CustomError("Driver not found", NOT_FOUND);
  
      // Collect file paths related to the driver, defaulting to an empty array if attachments is undefined
      const filePaths = (checkDriver.attachments || []).map((attachment) => 
        attachment.url.replace(`${process.env.BASE_URL}/uploads`, 'uploads')
      );
  
      // Delete files from the server if there are any file paths
      if (filePaths.length > 0) {
        deleteFiles(filePaths);
      }
  
      // Deregister the driver using Traccar service
      console.log('unique id is %',checkDriver.code);
      await traccarDriversServices.deleteDriver(checkDriver.code);

      // Delete the driver from the database
      await driverModel.deleteDriver(req.params.id);
  
      res.status(200).send({ message: "Driver Deleted Successfully" });
    } catch (err) {
      next(err);
    }
  };
  
  

const listDrivers = async (req, res, next) => {
    try {
        let { page, limit, sortBy, sortOrder, search } = req.query
        const drivers = await driverService.getAllDrivers(page, limit, sortBy, sortOrder, search);
        return res.status(OK).json(drivers);
    } catch (err) {
        next(err);
    }
};
const bulkUploadDrivers = async (req, res, next) => {
    try {


      // Access the validated vehicles from the request object
      const validDrivers = req.body.drivers;
  console.log(validDrivers);
      // Check the number of records
      if (validDrivers.length > 2002) {
        throw new CustomError(`The sheet contains more than 2000 drivers. Please reduce the number of drivers and try again.`, BAD_REQUEST);
      }
  
      // Perform the bulk insert    
      const codes = validDrivers.map(driver => driver.code);
    //   const driverIds = checkDriversIds(validDrivers);    
    //   const checkDrivers = await driverModel.findDriversByIds(driverIds);    
  
    //   if (checkDrivers.length !== driverIds.length) {
    //     throw new CustomError(`There was a problem with the driver IDs provided in the Excel sheet. Some of the drivers were not found. Please review the IDs and try again.`, BAD_REQUEST);
    //   }
  
      const existingDrivers = await driverModel.findVehiclesByCodes(codes);
      const existingCodes = existingDrivers.map(driver => driver.code);
  
      if (existingCodes.length > 0) {
        throw new CustomError(`Duplicate IMEIs found [${existingCodes}].`, CONFLICT);
      }
  
      const drivers = validDrivers.map(driver => ({
        name: driver.name,
        uniqueid: driver.code
      }));
  
      await traccarDriversServices.createMultipleDriversConcurrently(drivers);
      const createdDrivers = await driverModel.bulkCreateDrivers(validDrivers);
  
      res.status(201).json({
        message: 'Vehicles created successfully.',
        createdCount: createdDrivers.count, // count is returned by createMany
      });
  
    } catch (err) {
      next(err);
    }
  };
  

// const bulkUploadDrivers = async (req, res, next) => {
//     try {
//         const { drivers } = req.body
//         // return res.status(200).send(drivers)
//         return driverService.bulkCreateDrivers(drivers).then((createdDrivers) => {
//             traccarDriversServices.createMultipleDriversConcurrently(createdDrivers).then(result => {
//                 return res.status(201).json(result)
//             }).catch(err => next(err))
//         }).catch(err => next(err))
//     } catch (err) {
//         next(err);
//     }
// };

const updateDriverAttachments = async (req, res, next) => {
    try {
        const { id } = req.params
        const { files } = req

        const driver = await driverService.updateDriverAttachments(id, files);
        return res.status(OK).json(driver);
    } catch (err) {
        next(err)
    }
}

const deleteDriverAttachments = async (req, res, next) => {
    try {
        const { id } = req.params
        await driverService.deleteDriverAttachments(id);
        return res.status(OK).json({ message: "Driver attachment deleted successfully" });
    } catch (err) {
        next(err)
    }
}

const deleteDriverProfilePicture = async (req, res, next) => {
    try {
        const { id } = req.params
        await driverService.deleteDriverProfilePicture(id);
        return res.status(OK).json({ message: "Driver Picture deleted successfully" });
    } catch (err) {
        next(err)
    }
}

module.exports = {
    registerDriver,
    viewDriver,
    deleteDriver,
    listDrivers,
    editDriver,
    bulkUploadDrivers,
    updateDriverAttachments,
    deleteDriverAttachments,
    deleteDriverProfilePicture
};

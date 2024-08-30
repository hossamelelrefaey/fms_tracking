const { CREATED, NOT_FOUND, OK } = require('../constants/status-codes');
const driverService = require('../services/driversService');
const { CustomError } = require('../utils/error');
const { convertCreateDriverDataTypes, convertUpdateDriverDataTypes, delereFilesIfThereIsAnyErrors } = require("../utils/vehicleConversion")
const traccarDriversServices = require("../services/traccar/drivers.service")

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
        let { body, files } = req
        let { id } = req.params
        body = convertUpdateDriverDataTypes(body, files)

        const driver = await driverService.updateDriver(id, body, files);
        return res.status(OK).json(driver);
    } catch (err) {
        delereFilesIfThereIsAnyErrors(req.files)
        next(err);
    }
};

const deleteDriver = async (req, res, next) => {
    try {
        let { id } = req.params
        console.log(req);
        await driverService.deleteDriver(id);
        return res.status(OK).json({ message: "Driver deleted successfully" });
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
        const { drivers } = req.body
        // return res.status(200).send(drivers)
        return driverService.bulkCreateDrivers(drivers).then((createdDrivers) => {
            traccarDriversServices.createMultipleDriversConcurrently(createdDrivers).then(result => {
                return res.status(201).json(result)
            }).catch(err => next(err))
        }).catch(err => next(err))
    } catch (err) {
        next(err);
    }
};

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
    editDriver,
    deleteDriver,
    listDrivers,
    bulkUploadDrivers,
    updateDriverAttachments,
    deleteDriverAttachments,
    deleteDriverProfilePicture
};

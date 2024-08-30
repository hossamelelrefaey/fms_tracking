// src/models/driver.js
const prisma = require('../prisma/prisma');
const { mapDriversAttachments, deleteDriverFiles } = require("../utils/vehicleConversion")
const traccarDriversServices = require('./traccar/drivers.service');
const driverModel = require('../models/driver');
const { CustomError } = require('../utils/error');
const { NOT_FOUND, UNPROCESSABLE_ENTITY } = require('../constants/status-codes');
const { buildDriverQuery } = require("../utils/buildVehicleQuery")

const getDriverByQuery = async (query) => {
    return driverModel.getDriverByQuery(query)
};

const createDriver = async (data, files) => {
    if (data.code != undefined) {
        const checkCode = await getDriverByQuery({ code: data.code });
        if (checkCode) throw new CustomError(`Duplicated Code: ${data.code}`, UNPROCESSABLE_ENTITY);
    }

    if (data.idNo != undefined) {
        const checkIdNo = await getDriverByQuery({ idNo: data.idNo });
        if (checkIdNo) throw new CustomError(`Duplicated ID No.: ${data.idNo}`, UNPROCESSABLE_ENTITY);
    }

    if (data.phoneNumber != undefined) {
        const checkPhoneNumber = await getDriverByQuery({ phoneNumber: data.phoneNumber });
        if (checkPhoneNumber) throw new CustomError(`Duplicated Phone Number: ${data.phoneNumber}`, UNPROCESSABLE_ENTITY);
    }

    if (data.licenseNo != undefined) {
        const checkLicenseNo = await getDriverByQuery({ licenseNo: data.licenseNo });
        if (checkLicenseNo) throw new CustomError(`Duplicated License Number: ${data.licenseNo}`, UNPROCESSABLE_ENTITY);
    }


    let attachments = []
    if (files && files.attachments) attachments = mapDriversAttachments(files.attachments);

    let driver = await driverModel.createDriver(data, files);
     await traccarDriversServices.createTraccarDriver(driver)

    return driver
};

const getDriverById = async (id) => {
    return driverModel.getDriverById(id);
};

const updateDriver = async (id, data, files) => {
    let myDriver = await getDriverById(id)
    if (!myDriver) throw new CustomError('Driver not found', NOT_FOUND)

    if (data.idNo != undefined) {
        const checkIdNo = await getDriverByQuery({ idNo: data.idNo, id: { not: +id } });
        if (checkIdNo) throw new CustomError(`Duplicated ID No.: ${data.idNo}`, UNPROCESSABLE_ENTITY);
    }

    if (data.phoneNumber != undefined) {
        const checkPhoneNumber = await getDriverByQuery({ phoneNumber: data.phoneNumber, id: { not: +id } });
        if (checkPhoneNumber) throw new CustomError(`Duplicated Phone Number: ${data.phoneNumber}`, UNPROCESSABLE_ENTITY);
    }

    if (data.licenseNo != undefined) {
        const checkLicenseNo = await getDriverByQuery({ licenseNo: data.licenseNo, id: { not: +id } });
        if (checkLicenseNo) throw new CustomError(`Duplicated License Number: ${data.licenseNo}`, UNPROCESSABLE_ENTITY);
    }

    if (data.code != undefined) {
        const checkLicenseNo = await getDriverByQuery({ code: data.code, id: { not: +id } });
        if (checkLicenseNo) throw new CustomError(`Duplicated Code: ${data.code}`, UNPROCESSABLE_ENTITY);
    }

    let driver = await driverModel.updateDriver(id, data, files);
    await traccarDriversServices.updateTraccarDriverByUniqueId(id, driver)
    return driver
};

// Get driver ID by uniqueId
const getDriverIdByUniqueId = async (uniqueId) => {
    try {
      const response = await traccarService.get(`/drivers?uniqueId=${uniqueId}`);
      const drivers = response.data;
      if (drivers.length > 0) {
        return drivers[0].id; // Return the first driver ID found
      } else {
        throw new Error('Driver not found for uniqueId: ' + uniqueId);
      }
    } catch (error) {
      const errorMessage = error.response 
        ? `Error fetching driver ID: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
        : `Error fetching driver ID: ${error.message}`;
    
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Delete driver by ID
  const deleteDriverById = async (driverId) => {
    try {
      const response = await traccarService.delete(`/drivers/${driverId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response 
        ? `Error deleting driver: ${error.response.status} ${error.response.statusText} - ${error.response.data}`
        : `Error deleting driver: ${error.message}`;
    
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  
  // Deregister a driver with Traccar
  const deleteDriver = async (uniqueId) => {
    try {
      const driverId = await getDriverIdByUniqueId(uniqueId);
      await deleteDriverById(driverId);
    } catch (error) {
      const errorMessage = `Error deregistering uniqueId with Traccar: ${error.message}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  

// const deleteDriver = async (id) => {
//     let myDriver = await getDriverById(id)
//     console.log(myDriver);
//     if (!myDriver) throw new CustomError('Driver not found', NOT_FOUND)

//     let traccarDriver = await traccarDriversServices.fetchDriverByUniqueId(id)
//     console.log(traccarDriver);
//     await traccarDriversServices.deleteTraccarDriver(traccarDriver.id)
//     return driverModel.deleteDriver(id);
// };

const getAllDrivers = async (page, pageSize, sortBy, sortOrder, search) => {
    const query = buildDriverQuery(page, pageSize, sortBy, sortOrder, search, ["name", "licenseNo", "address", "idNo", "code", "phoneNumber"])
    let drivers = await driverModel.getAllDrivers(query)
    const totalCount = await prisma.driver.count({ where: query.where });

    let response = {
        drivers,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(+totalCount / +query.take),
    }
    return response
};

const updateDriverAttachments = async (id, files) => {
    let myDriver = await getDriverById(id)
    if (!myDriver) throw new CustomError('Driver not found', NOT_FOUND)

    // let oldAttachs = myDriver.attachments.map(attachment => attachment.url)
    // deleteDriverFiles(oldAttachs)
    let attachments = []
    if (files && files.attachments) attachments = mapDriversAttachments(files.attachments);

    let driver = await driverModel.updateDriverAttachments(id, attachments);
    return driver
}

const deleteDriverAttachments = async (id) => {
    const attachment = await driverModel.getDriverAttachments(id)
    if (!attachment) throw new CustomError('Attachment not found', NOT_FOUND)

    await driverModel.deleteDriverAttachments(id)
    deleteDriverFiles([attachment.url])
}

const deleteDriverProfilePicture = async (id) => {
    const driver = await driverModel.getDriverById(id)
    if (!driver) throw new CustomError('Driver not found', NOT_FOUND)
    if (!driver.picture) throw new CustomError('Driver Picture already deleted', 204)

    await driverModel.updateDriver(id, { picture: null })
    // deleteDriverFiles([driver.picture])
}

const bulkCreateDrivers = async (drivers) => {
    let count = await prisma.driver.createMany({
        data: drivers.map(driverData => ({
            ...driverData,
        })),
    });

    const createdDrivers = await prisma.driver.findMany({
        take: count.count,
        orderBy: { id: "desc" }
    });

    return createdDrivers
};

const preCheckDrivers = async (drivers) => {
    const errors = [];

    for (let i = 0; i < drivers.length; i++) {
        const data = drivers[i];
        if (data.code) {
            const checkCode = await getDriverByQuery({ code: data.code });
            if (checkCode) errors.push({ row: i + 2, error: `Duplicated Code: ${data.code}` });
        }

        if (data.idNo) {
            const checkIdNo = await getDriverByQuery({ idNo: data.idNo });
            if (checkIdNo) errors.push({ row: i + 2, error: `Duplicated ID No.: ${data.idNo}` });
        }

        if (data.phoneNumber) {
            const checkPhoneNumber = await getDriverByQuery({ phoneNumber: data.phoneNumber });
            if (checkPhoneNumber) errors.push({ row: i + 2, error: `Duplicated Phone Number: ${data.phoneNumber}` });
        }

        if (data.phoneNumber) {
            const checkLicenseNo = await getDriverByQuery({ licenseNo: data.licenseNo });
            if (checkLicenseNo) errors.push({ row: i + 2, error: `Duplicated License Number: ${data.licenseNo}` });
        }
    }

    return errors;
};

module.exports = {
    createDriver,
    getDriverById,
    getDriverByQuery,
    updateDriver,
    deleteDriver,
    getAllDrivers,
    bulkCreateDrivers,
    preCheckDrivers,
    updateDriverAttachments,
    deleteDriverAttachments,
    deleteDriverProfilePicture
};

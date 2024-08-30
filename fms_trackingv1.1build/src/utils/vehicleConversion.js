// src/utils/conversion.js

const path = require('path');
const fs = require('fs');

const convertToNumber = (value) => {
  const number = parseFloat(value);
  return isNaN(number) ? value : number;
};

const convertToBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value; // Return the original value if it's not a boolean string
};

const convertToDate = (value) => {
  if (value && new Date(value) != 'Invalid Date') return new Date(value)
  return value; // Return the original value if it's not a boolean string
};

const convertVehicleDataTypes = (data) => {
  return {
    ...data,
    fuelConsumption: convertToNumber(data?.fuelConsumption),
    fuelCost: convertToNumber(data?.fuelCost),
    year: convertToNumber(data?.year),
    odometer: convertToNumber(data?.odometer),
    idleTime: convertToNumber(data?.idleTime),
    fuelCapacity: convertToNumber(data?.fuelCapacity),
    tankHeight: convertToNumber(data?.tankHeight),
    tankWidth: convertToNumber(data?.tankWidth),
    tankLength: convertToNumber(data?.tankLength),
    parent: convertToNumber(data?.parent),
    department: convertToNumber(data?.department),
    driverId: convertToNumber(data?.driverId),
    accSupport: convertToBoolean(data?.accSupport),
    fuelSupport: convertToBoolean(data?.fuelSupport),
    doorSupport: convertToBoolean(data?.doorSupport),
    weightSensorSupport: convertToBoolean(data?.weightSensorSupport),
    temperatureSensorSupport: convertToBoolean(data?.temperatureSensorSupport),
    iButtonSensorSupport: convertToBoolean(data?.iButtonSensorSupport),
    ptoSensorSupport: convertToBoolean(data?.ptoSensorSupport),
    seatSensorSupport: convertToBoolean(data?.seatSensorSupport),
    refrigeratorSensorSupport: convertToBoolean(data?.refrigeratorSensorSupport),
    headlightsSensorSupport: convertToBoolean(data?.headlightsSensorSupport),
    licenseExpireReminder: convertToBoolean(data?.licenseExpireReminder),
    idleAlert: convertToBoolean(data?.idleAlert),
    archived: convertToBoolean(data?.archived),
  };
};

const convertCreateDriverDataTypes = (data, files) => {
  return {
    ...data,
    picture: files && files.picture ? `${process.env.BASE_URL}/${files.picture[0]?.path?.replaceAll("\\", "/")}` : null,
    name: data?.name,
    code: data?.code,
    idNo: data?.idNo,
    phoneNumber: data?.phoneNumber,
    emergencyPhoneNumber: data?.emergencyPhoneNumber,
    address: data?.address,
    licenseNo: data?.licenseNo,
    licenseStartDate: convertToDate(data?.licenseStartDate),
    licenseExpireDate: convertToDate(data?.licenseExpireDate),
    licenseExpireReminder: convertToBoolean(data?.licenseExpireReminder),
    contractStartDate: convertToDate(data?.contractStartDate),
    contractExpireDate: convertToDate(data?.contractExpireDate),
    contractExpireReminder: convertToBoolean(data?.contractExpireReminder)
  };
};

const convertUpdateDriverDataTypes = (data, files) => {
  const updatedData = {};

  if (files && files.picture && files.picture[0]?.path) {
    updatedData.picture = `${process.env.BASE_URL}/${files.picture[0]?.path?.replaceAll("\\", "/")}`;
  }

  if (data?.name !== undefined) updatedData.name = data.name;
  if (data?.code !== undefined) updatedData.code = String(data.code);
  if (data?.idNo !== undefined) updatedData.idNo = String(data.idNo);
  if (data?.phoneNumber !== undefined) updatedData.phoneNumber = String(data.phoneNumber);
  if (data?.emergencyPhoneNumber !== undefined) updatedData.emergencyPhoneNumber = String(data.emergencyPhoneNumber);
  if (data?.address !== undefined) updatedData.address = data.address;
  if (data?.licenseNo !== undefined) updatedData.licenseNo = data.licenseNo;
  if (data?.licenseStartDate !== undefined) updatedData.licenseStartDate = convertToDate(data.licenseStartDate);
  if (data?.licenseExpireDate !== undefined) updatedData.licenseExpireDate = convertToDate(data.licenseExpireDate);
  if (data?.licenseExpireReminder !== undefined) updatedData.licenseExpireReminder = convertToBoolean(data.licenseExpireReminder);
  if (data?.contractStartDate !== undefined) updatedData.contractStartDate = convertToDate(data.contractStartDate);
  if (data?.contractExpireDate !== undefined) updatedData.contractExpireDate = convertToDate(data.contractExpireDate);
  if (data?.contractExpireReminder !== undefined) updatedData.contractExpireReminder = convertToBoolean(data.contractExpireReminder);

  return updatedData;
};


const mapAttachments = (files, entityType) => {
  return files.map(file => {
    const filePath = path.join('uploads', entityType, file.filename);
    const fullUrl = `${process.env.BASE_URL}/${filePath}`; // Assuming BASE_URL is your server's base URL
    return {
      url: fullUrl,
    };
  });
};

const mapDriversAttachments = (files, entityType) => {
  return files.map(file => {
    const filePath = path.join('uploads', "drivers", "attachments", file.filename);
    const fullUrl = `${process.env.BASE_URL}/${filePath}`; // Assuming BASE_URL is your server's base URL
    return {
      url: fullUrl,
    };
  });
};

const deleteFiles = (files) => {
  files.forEach(file => {
    const filePath = path.join(__dirname, '../../', file);
    fs.unlink(filePath, (err) => {
    });
  });
};

const deleteDriverFiles = (files) => {
  files.forEach(file => {
    const filePath = path.join(__dirname, '../../', 'uploads/', file.split("uploads/")[1],);
    fs.unlinkSync(filePath);
  });
};

const handleFileUpdates = (existingVehicle, req) => {
  if (req.files && req.files.length > 0) {
    // Collect paths of new files      
    const attachments = req.files.map(file => {
      const filePath = path.join('uploads', req.body.entityType || 'vehicles', file.filename);
      const fullUrl = `${process.env.BASE_URL}/${filePath}`;
      return { url: fullUrl, path: filePath };
    });

    // Delete old files
    const oldFilePaths = existingVehicle.attachments.map(attachment => attachment.url.replace(`${process.env.BASE_URL}/uploads`, 'uploads'));
    deleteFiles(oldFilePaths);

    return attachments;
  }

  // If no new files are uploaded, return the existing attachments
  return existingVehicle.attachments;
};

const delereFilesIfThereIsAnyErrors = (files) => {
  if (files?.attachments) {
    const filePaths = files?.attachments?.map(file => path.join('uploads', "drivers/attachments", file.filename));
    deleteFiles(filePaths);
  }
  if (files?.picture) {
    const filePaths = files?.picture?.map(file => path.join('uploads', "drivers/pictures", file.filename));
    deleteFiles(filePaths);
  }
}

const checkDriversIds = (validVehicles) => {
  // Initialize a Set to store unique driver IDs
  const driverIdSet = new Set();

  // Filter valid vehicles, extract driver IDs, and add them to the Set
  validVehicles
    .filter(vehicle => vehicle.driverId != null)
    .forEach(vehicle => driverIdSet.add(+vehicle.driverId));

  // Convert the Set back to an array
  const driverIdsArray = Array.from(driverIdSet);

  // Now `driverIdsArray` contains all unique driver IDs
  return driverIdsArray;

}

module.exports = {
  convertVehicleDataTypes,
  convertCreateDriverDataTypes,
  convertUpdateDriverDataTypes,
  mapAttachments,
  mapDriversAttachments,
  deleteFiles,
  handleFileUpdates,
  delereFilesIfThereIsAnyErrors,
  checkDriversIds,
  deleteDriverFiles
};

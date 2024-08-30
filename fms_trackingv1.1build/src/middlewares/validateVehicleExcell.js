// // // src/middleware/validateVehicles.js

const { vehicleSchema } = require('../validators/vehicle');
const xlsx = require('xlsx');
const { BAD_REQUEST } = require('../constants/status-codes');

const validateVehiclesFromExcel = (req, res, next) => {
  if (!req.file) {
    return res.status(BAD_REQUEST).json({ message: 'No file uploaded.' });
  }

  try {
    // Parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON while preserving numbers as strings
    const vehicleData = xlsx.utils.sheet_to_json(sheet, {
      raw: true, // Keeps the data as it is
    });

    // Initialize sets and arrays for processing
    const validationErrors = [];
    const uniqueVehicles = [];
    const seenImei = new Set();

    // Function to correct scientific notation for large numbers
    const formatLargeNumber = (num) => {
      return (typeof num === 'number' && num.toString().includes('e'))
        ? num.toFixed().replace(/\.0+$/, '')
        : num.toString();
    };

    // Validate and process vehicles in a single loop
    for (let i = 0; i < vehicleData.length; i++) {
      const vehicle = vehicleData[i];

      // Ensure IMEI is treated as a string and correct any scientific notation
      if (vehicle.imei) {
        vehicle.imei = formatLargeNumber(vehicle.imei);
      }

      if (vehicle.code) {
        vehicle.code = formatLargeNumber(vehicle.code);
      }
      if (vehicle.simNumber) {
        vehicle.simNumber = formatLargeNumber(vehicle.simNumber);
      }
      if (vehicle.simNumberSerial) {
        vehicle.simNumberSerial = formatLargeNumber(vehicle.simNumberSerial);
      }
      if (vehicle.registrationNumber) {
        vehicle.registrationNumber = formatLargeNumber(vehicle.registrationNumber);
      }

      // Validate the vehicle
      const { error } = vehicleSchema.validate(vehicle, { abortEarly: false });

      if (error) {
        validationErrors.push({
          vehicle: vehicle.name || `Vehicle ${i + 1}`,
          errors: error.details.map((detail) => detail.message),
        });
      } else if (seenImei.has(vehicle.imei)) {
        validationErrors.push({
          vehicle: vehicle.name || `Vehicle ${i + 1}`,
          errors: [`IMEI ${vehicle.imei} is duplicated.`],
        });
      } else {
        // Add the vehicle to the valid list and mark the IMEI as seen
        uniqueVehicles.push(vehicle);
        seenImei.add(vehicle.imei);
      }
    }

    if (validationErrors.length > 0) {
      return res.status(BAD_REQUEST).json({
        message: 'Validation failed for one or more vehicles.',
        errors: validationErrors,
      });
    }

    // Attach valid vehicles to the request object
    req.validVehicles = uniqueVehicles;
    next();
  } catch (err) {
    return res.status(BAD_REQUEST).json({ message: err.message });
  }
};

module.exports = validateVehiclesFromExcel;

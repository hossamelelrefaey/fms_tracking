const xlsx = require('xlsx');
const driverService = require('../services/driversService');
const { create } = require("../validators/driver");
const { UNPROCESSABLE_ENTITY } = require('../constants/status-codes');
const { convertUpdateDriverDataTypes } = require("../utils/vehicleConversion")

const parseExcelDate = (excelDate) => {
  if (!excelDate) return null;

  if (typeof excelDate === 'string') {
    // Define regex patterns for different date formats
    const patterns = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,  // Matches "dd/mm/yyyy" or "d/m/yyyy"
      /^(\d{1,2})-(\d{1,2})-(\d{4})$/,    // Matches "dd-mm-yyyy" or "d-m-yyyy"
      /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,  // Matches "yyyy/mm/dd" or "yyyy/m/d"
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/     // Matches "yyyy-mm-dd" or "yyyy-m-d"
    ];

    for (const pattern of patterns) {
      const match = excelDate.match(pattern);
      if (match) {
        let day, month, year;

        if (pattern === patterns[0] || pattern === patterns[1]) {
          // dd/mm/yyyy or dd-mm-yyyy
          [, day, month, year] = match;
        } else {
          // yyyy/mm/dd or yyyy-mm-dd
          [, year, month, day] = match;
        }

        // Return the parsed date
        return new Date(year, month - 1, day);
      }
    }

    // If the string does not match any known pattern, try using Date constructor directly
    const parsedDate = new Date(excelDate);
    if (!isNaN(parsedDate)) {
      return parsedDate;
    }
  }

  // Handle Excel serial date numbers
  if (typeof excelDate === 'number') {
    return new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  }

  // Return null if none of the above conditions are met
  return null;
};


module.exports = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    // Read the workbook from the uploaded file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert the sheet to JSON, skipping the header row
    const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 })
      .slice(1) // Skip the header row
      .filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== '')); // Filter out empty rows

    const drivers = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let driverData = {
        name: row[0],
        code: row[1],
        idNo: row[2] != undefined ? String(row[2]) : null,
        phoneNumber: row[3] != undefined ? String(row[3]) : null,
        emergencyPhoneNumber: row[4] != undefined ? String(row[4]) : null,
        address: row[5],
        licenseNo: row[6],
        licenseStartDate: row[7] ? parseExcelDate(row[7]) : undefined,
        licenseExpireDate: row[8] ? parseExcelDate(row[8]) : undefined,
        licenseExpireReminder: row[9],
        contractStartDate: row[10] ? parseExcelDate(row[10]) : undefined,
        contractExpireDate: row[11] ? parseExcelDate(row[11]) : undefined,
        contractExpireReminder: row[12]
      };
      // driverData = convertUpdateDriverDataTypes(driverData)

      const { error, value } = create.validate(driverData);
      if (error) {
        errors.push({
          row: i + 2, // Adjust for header row
          error: error.details.map(e => e.message).join(", ")
        });
        continue;
      }
      drivers.push(value);
    }

    if (errors.length) return res.status(UNPROCESSABLE_ENTITY).json({
      success: false,
      message: "Validation errors occurred",
      errors
    });

    // Perform pre-checks for duplicates and other business logic errors
    const preCheckErrors = await driverService.preCheckDrivers(drivers);
    if (preCheckErrors.length) {
      return res.status(UNPROCESSABLE_ENTITY).json({
        success: false,
        message: "Validation errors occurred",
        errors: preCheckErrors
      });
    }

    req.body.drivers = drivers
    next()
  } catch (error) {
    return next(error)
  }
}
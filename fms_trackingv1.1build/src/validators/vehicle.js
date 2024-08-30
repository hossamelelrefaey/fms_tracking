const Joi = require('joi');

const vehicleTypes = require('./vehicleTypes');

const vehicleSchema = Joi.object({
  name: Joi.string().required().trim().required(),
  code: Joi.string().optional(),
  imei: Joi.string().trim().max(128).pattern(/^\S+$/).required().messages({
    'string.pattern.base': 'imei must not contain spaces.',
  }),
  make: Joi.string().trim().optional(),
  model: Joi.string().trim().optional(),
  registrationNumber: Joi.string().trim().optional(),
  fuelType: Joi.string().trim().optional(),
  fuelConsumption: Joi.number().optional(),
  fuelCost: Joi.number().optional(),
  vehicleType: Joi.string().trim().optional()
    .valid(...vehicleTypes),
  plateNumber: Joi.string().trim().required(),
  vin: Joi.string().trim().optional(),
  licenseExpire: Joi.date().optional(),
  licenseExpireReminder: Joi.boolean()
    .when('licenseExpire', {
      is: Joi.exist().not(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
  simNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .trim() // E.164 format for phone numbers
    .required(),

  simNumberSerial: Joi.string()
  .trim().optional(),
  odometer: Joi.number().optional(),
  brand: Joi.string().trim().optional(),
  color: Joi.string().trim().optional(),
  year: Joi.number().optional(),
  vehicleExpires: Joi.date().required(),
  parent: Joi.number().required(),
  accSupport: Joi.boolean().required(),
  fuelSupport: Joi.boolean().required(),
  fuelCapacity: Joi.number().when('fuelSupport', { is: true, then: Joi.required() }),
  tankHeight: Joi.number().when('fuelSupport', { is: true, then: Joi.required() }),
  tankWidth: Joi.number().when('fuelSupport', { is: true, then: Joi.required() }),
  tankLength: Joi.number().when('fuelSupport', { is: true, then: Joi.required() }),
  doorSupport: Joi.boolean().required(),
  weightSensorSupport: Joi.boolean().optional(),
  temperatureSensorSupport: Joi.boolean().optional(),
  iButtonSensorSupport: Joi.boolean().optional(),
  ptoSensorSupport: Joi.boolean().optional(),
  seatSensorSupport: Joi.boolean().optional(),
  refrigeratorSensorSupport: Joi.boolean().optional(),
  headlightsSensorSupport: Joi.boolean().optional(),
  idleAlert: Joi.boolean().optional(),
  idleTime: Joi.number().when('idleAlert', { is: true, then: Joi.required() }),
  archived: Joi.boolean().optional(),
  department: Joi.number().optional(),
  driverId: Joi.number().optional(),
  icon: Joi.string().required(),
  attachments: Joi.array()
});

const updateVehicleSchema = vehicleSchema.fork(
  Object.keys(vehicleSchema.describe().keys),
  (schema) => schema.optional()
).keys({
  attachments: Joi.forbidden(), // Forbid attachments field in updates
  driverId : Joi.number().min(1).allow(null),
  odometer: Joi.forbidden().messages({ "any.unknown": "Odometer should not be editable." })
  ,name: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'name should not contain consecutive spaces.',
  }).allow("")
  ,code: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'code should not contain consecutive spaces.',
  }).allow("")
  ,make: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'make should not contain consecutive spaces.',
  }).allow("")
  ,model: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'model should not contain consecutive spaces.',
  }).allow("")
  ,registrationNumber: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'registration number should not contain consecutive spaces.',
  }).allow("")
  ,fuelType: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'fuel Type should not contain consecutive spaces.',
  }).allow("")
  ,vehicleType: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'vehicle Type should not contain consecutive spaces.',
  }).allow("")
  ,vin: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'vin should not contain consecutive spaces.',
  }).allow("")
  ,licenseExpire: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'license Expire should not contain consecutive spaces.',
  }).allow("")
  ,simNumberSerial: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'sim Number Serial should not contain consecutive spaces.',
  }).allow("")
  ,brand: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'brand should not contain consecutive spaces.',
  }).allow("")
  ,color: Joi.string().pattern(/^\S*(?:\s\S+)*$/, 'no consecutive spaces')
  .messages({
    'string.pattern.name': 'color should not contain consecutive spaces.',
  }).allow("")
});


const vehiclesQuerySchema = Joi.object({
  page: Joi.number().min(1).required(),
  limit: Joi.number().min(1).max(100).required(),
  search: Joi.string(),
  sortBy: Joi.string().valid("id", "name", "code", "imei", "vehicleType","plateNumber", "archived","parent"),
  sortOrder: Joi.string().valid("asc", "desc")
})

module.exports = {
  vehicleSchema,
  vehiclesQuerySchema,
  updateVehicleSchema
}
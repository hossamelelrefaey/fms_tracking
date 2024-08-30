const Joi = require('joi');

const create = Joi.object({
    name: Joi.string().required().custom((value, helper) => {
        if (!/\S/.test(value)) return helper.message('name must contain at least one non-whitespace character');
        return value;
    }),
    code: Joi.string().trim(),
    idNo: Joi.string().allow(null),
    phoneNumber: Joi.string().optional().pattern(/^\+?[1-9]\d{1,14}$/).messages({
        'string.pattern.base': `phoneNumber must be a valid international phone number`
    }).allow(null),
    emergencyPhoneNumber: Joi.string().optional().messages({
        'string.pattern.base': `emergencyPhoneNumber must be a valid international phone number`
    }).allow(null),
    address: Joi.string().optional(),
    licenseNo: Joi.string().trim(),
    licenseStartDate: Joi.date().iso(),
    licenseExpireDate: Joi.date().iso().when(
        'licenseStartDate', {
        is: Joi.exist(),
        then: Joi.date().iso().required(),
        otherwise: Joi.date().iso().optional()
    }
    ).greater(Joi.ref('licenseStartDate')).message({
        'date.greater': '"licenseExpireDate" must be greater than "licenseStartDate"',
    }).allow(null),
    licenseExpireReminder: Joi.boolean().when(
        'licenseExpireDate', {
        is: Joi.exist(),
        then: Joi.boolean().required(),
        otherwise: Joi.boolean().optional()
    }), // Only applicable if licenseExpireDate is provided
    contractStartDate: Joi.date().iso(),
    contractExpireDate: Joi.date().iso().when(
        'contractStartDate', {
        is: Joi.exist(),
        then: Joi.date().iso().required(),
        otherwise: Joi.date().iso().optional()
    }
    ).greater(Joi.ref('contractStartDate')).message({
        'date.greater': '"contractExpireDate" must be greater than "contractStartDate"',
    }).allow(null),
    contractExpireReminder: Joi.boolean().optional().when(
        'contractExpireDate', {
        is: Joi.exist(),
        then: Joi.boolean().required(),
        otherwise: Joi.boolean().optional()
    }), // Only applicable if contractExpireDate is provided
});

const update = Joi.object({
    name: Joi.string().optional(),
    code: Joi.string().optional().allow(""),
    idNo: Joi.string().optional().trim().allow(""),
    phoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
        'string.pattern.base': `phoneNumber must be a valid international phone number`
    }).allow(""),
    emergencyPhoneNumber: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
        'string.pattern.base': `emergencyPhoneNumber must be a valid international phone number`
    }).allow("").allow(null),
    address: Joi.string().optional().allow(""),
    licenseNo: Joi.string().optional().trim().allow(""),
    licenseStartDate: Joi.date().iso().optional(),
    licenseExpireDate: Joi.date().iso().when(
        'licenseStartDate', {
        is: Joi.exist(),
        then: Joi.date().iso().required(),
        otherwise: Joi.date().iso().optional()
    }
    ).greater(Joi.ref('licenseStartDate')).message({
        'date.greater': '"licenseExpireDate" must be greater than "licenseStartDate"',
    }).allow(null),
    licenseExpireReminder: Joi.boolean().when(
        'licenseExpireDate', {
        is: Joi.exist(),
        then: Joi.boolean().required(),
        otherwise: Joi.boolean().optional()
    }),
    contractStartDate: Joi.date().iso(),
    contractExpireDate: Joi.date().iso().when(
        'contractStartDate', {
        is: Joi.exist(),
        then: Joi.date().iso().required(),
        otherwise: Joi.date().iso().optional()
    }
    ).greater(Joi.ref('contractStartDate')).message({
        'date.greater': '"contractExpireDate" must be greater than "contractStartDate"',
    }).allow(null),
    contractExpireReminder: Joi.boolean().optional().when(
        'contractExpireDate', {
        is: Joi.exist(),
        then: Joi.boolean().required(),
        otherwise: Joi.boolean().optional()
    })
})

module.exports = {
    create,
    update,
};

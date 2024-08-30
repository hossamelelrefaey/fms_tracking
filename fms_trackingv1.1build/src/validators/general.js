const Joi = require('joi');

const getById = Joi.object({
    id: Joi.number().integer().positive().required()
});

const getAll = Joi.object({
    page: Joi.number().integer().positive().required().min(1),
    limit: Joi.number().integer().positive().required().max(100),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc'),
    search: Joi.string()
})

module.exports = {
    getById,
    getAll,
};

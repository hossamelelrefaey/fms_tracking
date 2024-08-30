const { UNPROCESSABLE_ENTITY } = require("../constants/status-codes");

exports.validateRequestBody = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(UNPROCESSABLE_ENTITY).json({ message: error.details[0].message });
    } else {
      return next();
    }
  };
};

exports.validateRequestQuery = (schema) => {
  return async (req, res, next) => {
    if (req.query.page && !isNaN(req.query.page))
      req.query.page = +req.query.page;
    if (req.query.limit && !isNaN(req.query.limit))
      req.query.limit = +req.query.limit;

    const { error } = schema.validate(req.query);
    if (error) {
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: error.details[0].message });
    }
    return next();
  };
};

exports.validateRequestParams = (schema) => {
  return async (req, res, next) => {
    if (req.params["0"]) delete req.params["0"];
    const { error } = schema.validate(req.params);
    if (error) {
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: error.details[0].message });
    }
    return next();
  };
};

exports.errorHandler = async (err, req, res, next) => {
  console.log(err);

  let status = err.statusCode || err.status || 500;
  let message = err.message;

  if (status == 500 && !err.message) message = "Internal server error!"
  res.status(status).json({ code: status, success: false, message });
};

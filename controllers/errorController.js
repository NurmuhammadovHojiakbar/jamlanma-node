const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDublicateError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Dublicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const values = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${values.join(". ")}`;
  return new AppError(message, 400);
};

const invalidJsonError = () => {
  return new AppError(
    "This token is invalid. Please check the token or log in again!",
    401
  );
};

const expiredTokenError = () => {
  return new AppError("This token is expired. Please log in again!", 401);
};

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational === true) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  console.log("Error: ", err);

  res.status(500).json({
    status: "error",
    message: "Something went very wrong!!!",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDublicateError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.name === "JsonWebTokenError") error = invalidJsonError();
    if (err.name === "TokenExpiredError") error = expiredTokenError();
    sendErrorProd(error, res);
  }
};

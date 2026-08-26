const globalErrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    errorMiddlewareInDevelopment(err, req, res);
  } else {
    errorMiddlewareInProduction(err, req, res);
  }
};

const errorMiddlewareInDevelopment = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorMiddlewareInProduction = (err, req, res) => {
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: err.status,
      message: "Invalid token. Please log in again",
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: err.status,
      message: "Your token has expired. Please log in again",
    });
  }
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrorMiddleware;

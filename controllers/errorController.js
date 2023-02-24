//export a module that takes in an err, req, res, next
// the statusCode should equal 500 by default or err.statusCode
// the status should be 'error by default or the provided code
// res.status status code and the status/message should be derived from the err
const AppError = require('./../utils/appError.js');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate Field Value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    //Programming or other unknown error: don't leak error details to Client
    console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || '500';
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errObj = { ...err };
    console.log(errObj);
    if (errObj.kind === 'ObjectId') errObj = handleCastErrorDB(errObj);
    if (errObj.code === 11000) errObj = handleDuplicateFieldsDB(errObj);
    sendErrorProd(errObj, res);
  }
};

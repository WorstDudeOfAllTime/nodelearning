// class app Error extends the built in error message
// takes in a message and a statuscode
// provide the message to the super constructor
// store statuscode in this statuscode
// the status checks if the status code starts with a 4 and returns fail or error accordingly
// set isoperation to tru

class AppError extends Error {
  constructor(message, statusCode){
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperation = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
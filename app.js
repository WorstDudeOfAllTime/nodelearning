const express = require('express');
const app = express();
const morgan = require('morgan');
const port = 3000;
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
//MIDDLEWARE//
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//END OF MIDDLEWARE//
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);

//SERVER START//
module.exports = app;

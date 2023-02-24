const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
//MIDDLEWARE//
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//END OF MIDDLEWARE//
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/user', userRouter);
//app.all, if any requests is made to a route not specified above, there will be an error introduced
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});
app.use(errorController);

//SERVER START//
module.exports = app;

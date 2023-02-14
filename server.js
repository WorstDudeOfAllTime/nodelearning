const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const Tour = require('./models/tourModel')
dotenv.config({ path: './config.env' });
const DB = process.env.DB_CONNECT;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  });

  //tour schema with name rating and price, all required, default on rating
  // create the tour 
  // save the tour to the database

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

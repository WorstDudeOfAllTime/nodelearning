const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel')
const fs = require('fs');
dotenv.config({ path: './config.env' });

const DB = "mongodb+srv://worstdudeofall:3WORSTdudeOFall4@cluster0.mswrm5x.mongodb.net/natours?retryWrites=true&w=majority"
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  });


//IMPORT FUNCTION TO DATABASE//
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data has been successfully loaded");
    process.exit();
  } catch (err) {
    console.log(err)
  }
};
const dataDeleter = async () => {
  try {
    await Tour.deleteMany();
    console.log("data succesfully deleted");
    process.exit();
  }catch(err){
    console.log(err)
  }
}
if(process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete"){
  dataDeleter();
}

console.log(process.argv);
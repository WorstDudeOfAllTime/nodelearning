const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'You cannot signup without a username'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'You cannot signup without a username'],
    
  },
})
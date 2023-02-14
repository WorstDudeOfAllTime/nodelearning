const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required'],
    unique: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour must have a group size"]
  },
  difficulty: {
    type: String,
    required: [true, "Need a difficulty"]
  }, 
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  }, 
  price: {
    type: Number,
    required: [true, 'A price is required'], 
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    required: [true, "A tour must have a description"],
    trim: true
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: true
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  startDate: [Date]
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
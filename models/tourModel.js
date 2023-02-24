const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator')
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A name is required'],
      unique: true,
      maxlength: [40, 'A tour name must have less than 40 characters'],
      minlength: [10, 'A tour name must have more than 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'Need a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'This is not an accepted value'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A price is required'],
      min: [0, 'Price must be above $0']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //need to return true or false
          return val < this.price;
          //this only points to NEW doc. wont work on PATCH or UPDATE
        },
        message: 'Discount price should be less than the actual price'
      }
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true
    },
    description: {
      type: String,
      trim: true
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
    startDate: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
//virtual properties are properties that are not storedi n th DB
// CONVERSIONS
tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
  //must not use an arrow function, they dont
  // get  a 'this'
});
//created each time data is GET from the database
// called a getter

//VIRTUALS CANT BE USED IN A QUERY
// SO WTF IS THE POINT

//DOCUMENT MIDDLEWARE
//PRE MIDDLEWARE, BEFORE AN EVENT, SAVE IN THIS CASE
// and .create()

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took: ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});

//aggregation middleware
tourSchema.pre('aggregate', function(next) {
  console.log(this.project);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//mongoose MIDDLEWARE
//AKA Pre/Post Hooks
// can act currently processed Document

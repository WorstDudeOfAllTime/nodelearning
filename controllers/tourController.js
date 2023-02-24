const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasTopTours = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
});

exports.mostExpensive = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price';
  next();
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5
        }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    { $sort: { avgPrice: 1 } }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const ourTour = await Tour.findById(req.params.id);

  if (!ourTour) {
    return next(new AppError('No tour with that ID Exists', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: ourTour
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  if (!newTour) {
    return next(new AppError('No tour with that ID Exists', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!newTour) {
    return next(new AppError('No tour with that ID Exists', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.findByIdAndDelete(req.params.id);

  if (!newTour) {
    return next(new AppError('No tour with that ID Exists', 404));
  }

  res.status(204).json({
    status: 'success',
    data: deadTour
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([{ $unwind: '$startDates' }]);

  res.status(200).json({
    status: 'success',
    data: {
      plan: plan
    }
  });
});

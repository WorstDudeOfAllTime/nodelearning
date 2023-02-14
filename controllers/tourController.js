const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures')
exports.aliasTopTours = async (req, res, next) => {
  try {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.mostExpensive = async (req, res, next) => {
  try {
    req.query.limit = '5';
    req.query.sort = '-price';
    next();
  } catch (err) {
    console.log(err);
  }
};


exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const ourTour = await Tour.findById(req.params.id);
    console.log(ourTour);

    res.status(200).json({
      status: 'success',
      data: {
        tour: ourTour
      }
    });
  } catch (err) {
    console.log('ERROR');
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.createTour = async (req, res) => {
  console.log('Fired');
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      data: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const newTour = await Tour.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: deadTour
    });
  } catch (err) {
    res.status(400).json({
      status: 'success',
      message: err
    });
  }
};

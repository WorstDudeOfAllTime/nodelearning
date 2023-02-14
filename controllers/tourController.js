const Tour = require('./../models/tourModel');

exports.aliasTopTours = async (req, res, next) => {
  try {
    req.query.limit = '5';
    req.query.sort= '-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next()
  }catch(err){
    console.log(err);
  }
}

exports.mostExpensive = async(req, res, next) => {
try {
  req.query.limit = '5';
  req.query.sort='-price';
  next();
} catch(err){
  console.log(err);
}
}

exports.getAllTours = async (req, res) => {
  try {
    //FILTERING//
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {
      return `$${match}`;
    });
    let query = Tour.find(JSON.parse(queryStr));
    // END OF FILTER//
    //SORTING//
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    //END OF SORTING//

    //FIELDING//
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    //END OF FIELDING//

    //PAGINATION//
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if(req.query.page) {
      const numTours = await Tour.countDocuments();
      if(skip >= numTours) throw new Error('This page does not exist');
    }

    //END OF PAGINATION//
    const tours = await query;

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

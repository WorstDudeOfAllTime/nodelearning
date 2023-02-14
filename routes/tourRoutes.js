// import express and your tour controller, import express.Router()
// what is router.param?
// route the routes as normal, using Router instead of app
// module export the router.


const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

//param middleware
// only runs for certain parameters
// id in this app is the only param we will have in this case
//
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/most-expensive').get(tourController.mostExpensive, tourController.getAllTours)
;
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

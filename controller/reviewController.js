const Review = require('./../models/reviewModal')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')



exports.setToursUserIds = (req, res, next) => {
   //Allow nested routes
   if (!req.body.tour) req.body.tour = req.params.tourId
   if (!req.body.user) req.body.user = req.user.id
   next()
}

exports.getAllReview = factory.getAll(Review)
exports.createReview = factory.createOne(Review)
exports.getReview = factory.getOne(Review)
exports.updateReview = factory.updateOne(Review)
exports.deleteReview = factory.deleteOne(Review)


// exports.getAllReview = catchAsync(async (req, res, next) => {
//    let filter = {}
//    if (req.params.tourId) filter = { tour: req.params.tourId }

//    const reviews = await Review.find(filter)

//    res.status(200).json({
//       status: 'success',
//       length: reviews.length,
//       data: {
//          reviews
//       }
//    })
// })


// exports.createReview = catchAsync(async (req, res, next) => {

//    const newReview = await Review.create(req.body)
//    res.status(201).json({
//       status: 'success',
//       data: {
//          review: newReview
//       }
//    })
// })
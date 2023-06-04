const express = require('express')
const reviewController = require('./../controller/reviewController')
const authController = require('./../controller/authController')


const router = express.Router({ mergeParams: true })

// POST /tours/2345ad5fad3/reviews
//POST /reviews
router.use(authController.protect)

router
   .route('/')
   .get(reviewController.getAllReview)
   .post(
      authController.restrictTo('user'),
      reviewController.setToursUserIds,
      reviewController.createReview
   )

router
   .route('/:id')
   .get(reviewController.getReview)
   .patch(authController.restrictTo('admin', 'user'), reviewController.updateReview)
   .delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview)

module.exports = router

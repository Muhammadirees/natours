const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema(
   {
      review: {
         type: String,
         required: [true, 'Review cannot be empty!']
      },
      rating: {
         type: Number,
         min: 1,
         max: 5
      },
      createdAt: {
         type: Date,
         default: Date.now(),
         select: false
      },
      user: {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
         required: [true, 'Review must belong to a user.']
      },
      tour: {
         type: mongoose.Schema.ObjectId,
         ref: 'Tour',
         required: [true, 'Review must belong to a tour.']
      }
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, async function (next) {
   // this.populate({
   //    path: 'tour',
   //    select: 'name'
   // }).populate({
   //    path: 'user',
   //    select: 'name photo'
   // })
   this.populate({
      path: 'user',
      select: 'name photo'
   })
   next()
})

reviewSchema.statics.calcAverageRating = async function (tourId) {
   // console.log(tourId)

   const stats = await this.aggregate([
      {
         $match: { tour: tourId }
      },
      {
         $group: {
            _id: '$tour',
            nRating: { $sum: 1 },
            avgRating: { $avg: '$rating' }
         }
      }
   ])
   // console.log(stats)
   if (stats.length > 0) {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: stats[0].nRating,
         ratingsAverage: stats[0].avgRating
      })
   }
   else {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsQuantity: 0,
         ratingsAverage: 4.5
      })
   }

}

reviewSchema.post('save', function () {
   // this.constructor point to the Modal
   this.constructor.calcAverageRating(this.tour)
})

//findByIdAndUpdate
//findByIdAndDelete

reviewSchema.pre(/^findOneAnd/, async function (next) {
   // why use this.findOne? To get access of doc becuase findOneAnd is a query middleware
   // why use this.r? to pass the doc to next post query middleware
   this.r = await this.findOne()
   next()
})

reviewSchema.post(/^findOneAnd/, async function () {
   // await this.findOne() does NOT work here, the query has already executed
   await this.r.constructor.calcAverageRating(this.r.tour)
})


const Review = mongoose.model('Review', reviewSchema)

module.exports = Review
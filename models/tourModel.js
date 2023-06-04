const mongoose = require('mongoose');
const slugify = require('slugify')
const User = require('./userModel')

const tourSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'A tour must have a name '],
         unique: true,
         trim: true,
         maxlength: [40, 'A tour name mush have less or equal then 40 characters'],
         minlength: [10, 'A tour name mush have greater or equal then 10 characters']
      },
      slug: String,
      duration: {
         type: Number,
         required: [true, 'A tour must have durations']
      },
      maxGroupSize: {
         type: Number,
         required: [true, 'A tour must have group size']
      },
      difficulty: {
         type: String,
         enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult'
         },
         required: [true, 'A tour must have group size']
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         min: [1, 'Rating must be above 1.0'],
         max: [5, 'Rating must be below 5.0'],
         set: val => Math.round(val * 10) / 10  //4.55555, 45.5555, 45, 4.5 
      },
      ratingsQuantity: {
         type: Number,
         default: 0
      },
      price: {
         type: Number,
         required: [true, 'A tour must have a price ']
      },
      priceDiscount: {
         type: Number,
         validate: {
            validator: function (val) {
               return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
         }
      },
      summary: {
         type: String,
         trim: true,
         required: [true, 'A tour must have summary']
      },
      description: {
         type: String,
         trim: true
      },
      imageCover: {
         type: String,
         required: [true, 'A tour must have the cover image']
      },
      images: [String],
      createdAt: {
         type: Date,
         default: Date.now(),
         select: false
      },
      startDates: [Date],
      secratTour: {
         type: Boolean,
         default: false
      },
      startLocation: {
         //GeoJSON
         type: {
            type: String,
            default: 'Point',
            enum: ['Point']
         },
         coordinates: [Number],
         address: String,
         description: String
      },
      locations: [
         {
            type: {
               type: String,
               default: 'Point',
               enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
         }
      ],
      guides: [
         {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
         }
      ],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
   }
)

// tourSchema.index({ price: 1 })
tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

tourSchema.virtual('durationWeeks').get(function () {
   return this.duration / 7;
})

tourSchema.virtual('reviews', {
   ref: 'Review',
   foreignField: 'tour',
   localField: '_id'
})

//The Documentt middleware only works on save() and create()
tourSchema.pre('save', function (next) {
   this.slug = slugify(this.name, { lower: true })
   next()
})

// tourSchema.pre('save', async function (next) {
//    const guidesPromise = this.guides.map(async id => await User.findById(id))
//    this.guides = await Promise.all(guidesPromise)
//    next()
// })
// tourSchema.post('save', function (doc, next) {
//    console.log(this)
//    next()
// })

//Query middleware works on ^find and ^remove
tourSchema.pre(/^find/, function (next) {
   this.find({ secratTour: { $ne: true } })
   this.start = Date.now()
   next()
})

tourSchema.pre(/^find/, function (next) {
   this.populate({
      path: 'guides',
      select: '-__v -passwordChangedAt -passwordResetExpiresIn'
   })
   next()
})

tourSchema.post(/^find/, function (docs, next) {
   console.log(`This Query took ${Date.now() - this.start} milliseconds`)
   next()

})


//Aggreagate middleware
// tourSchema.pre('aggregate', function (next) {
//    this.pipeline().unshift({
//       $match: {
//          secratTour: {
//             $ne: true
//          }
//       }
//    })
//    next()
// })



const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour;

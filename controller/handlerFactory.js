const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')


exports.getAll = Modal =>
   catchAsync(async (req, res, next) => {
      // console.log(req.file)

      //To allow  for nested Get reviews on tour (hack)
      let filter = {}
      if (req.params.tourId) filter = { tour: req.params.tourId }

      //EXECUTE QUERY
      const features = new APIFeatures(Modal.find(filter), req.query)
         .filter()
         .sort()
         .limitFields()
         .paginate()
      // console.log(features.query)
      const doc = await features.query
      //SEND RESPONSE
      res.status(200).json({
         status: 'success',
         result: doc.length,
         data: {
            data: doc
         }
      })

   })


exports.createOne = Modal => catchAsync(async (req, res, next) => {
   const doc = await Modal.create(req.body)
   res.status(201).json({
      status: 'success',
      data: {
         data: doc
      }
   })
})

exports.getOne = (Modal, popOptions) =>
   catchAsync(async (req, res, next) => {

      let query = Modal.findById(req.params.id)
      if (popOptions) query = query.populate(popOptions)
      const doc = await query

      // const tour = await Tour.findById(req.params.id).populate('reviews')

      if (!doc) return next(new AppError('Not document found with this ID', 404))

      res.status(200).json({
         status: 'success',
         data: {
            data: doc
         }
      })

   })


exports.deleteOne = Modal =>
   catchAsync(async (req, res, next) => {
      const doc = await Modal.findByIdAndDelete(req.params.id)

      if (!doc) return next(new AppError('Not document found with this ID', 404))

      res.status(204).json({
         status: 'success',
         data: null
      })
   })

exports.updateOne = Modal =>
   catchAsync(async (req, res, next) => {
      const doc = await Modal.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true
      })

      if (!doc) return next(new AppError('Not document found with this ID', 404))

      res.status(200).json({
         status: 'success',
         data: {
            data: doc
         }
      })
   })

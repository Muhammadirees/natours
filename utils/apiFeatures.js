class APIFeatures {
   constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString
   }

   filter() {
      // Build the Query
      // 1A) Filtereing
      const queryObj = { ...this.queryString }
      const excludeFields = ['page', 'sort', 'limit', 'fields']
      excludeFields.forEach(el => delete queryObj[el])

      // console.log(queryObj)

      //1B) Advance filtering         
      let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
      // console.log(queryStr)
      this.query = this.query.find(JSON.parse(queryStr))
      // console.log(this)
      // console.log('type', typeof (this))
      return this
   }

   sort() {
      //2) Sorting
      if (this.queryString.sort) {
         console.log(this.queryString.sort)
         const sortBy = this.queryString.sort.split(',').join(' ')
         this.query = this.query.sort(sortBy)
      }
      else {
         this.query = this.query.sort('-createdAt')
      }
      return this
   }

   limitFields() {
      //3) Field Limiting
      if (this.queryString.fields) {
         const fields = this.queryString.fields.split(',').join(' ')
         this.query = this.query.select(fields)
      }
      else {
         this.query = this.query.select('-__v')
      }
      return this
   }

 paginate() {
      //4) Pagination
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 100
      const skip = (page - 1) * limit


      this.query = this.query.skip(skip).limit(limit)

      // if (this.queryString.page) {
      //    const numTours = await this.query.countDocuments()
      //    if (skip >= numTours) throw new Error("This page doesn't exist")
      // }
      
      return this
   }
}
module.exports = APIFeatures




//Build the Query
      //1A) Filtereing
      // const queryObj = { ...req.query }
      // const excludeFields = ['page', 'sort', 'limit', 'fields']
      // excludeFields.forEach(el => delete queryObj[el])

      // // console.log(queryObj)

      // //1B) Advance filtering         
      // let queryStr = JSON.stringify(queryObj)
      // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

      // let query = Tour.find(JSON.parse(queryStr))
      //2) Sorting
      // if (req.query.sort) {
      //    const sortBy = req.query.sort.split(',').join(' ')
      //    query = query.sort(sortBy)
      // }
      // else {
      //    query = query.sort('-createdAt')
      // }

      // //3) Field Limiting
      // if (req.query.fields) {
      //    const fields = req.query.fields.split(',').join(' ')
      //    query = query.select(fields)
      // }
      // else {
      //    query = query.select('-__v')
      // }

      // //4) Pagination
      // const page = req.query.page * 1 || 1
      // const limit = req.query.limit * 1 || 100
      // const skip = (page - 1) * limit


      // query = query.skip(skip).limit(limit)

      // if (req.query.page) {
      //    const numTours = await Tour.countDocuments()
      //    if (skip >= numTours) throw new Error("This page doesn't exist")
      // }
      //Execute the Query 
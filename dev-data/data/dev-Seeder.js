const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require('../../Models/tourModel')
const dotenv = require('dotenv');


dotenv.config({ path: '../../config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
   // mongoose.connect(process.env.DATABASE_LOCAL, {
}).then(con => {
   // console.log(con.connection)
   console.log("Connection Succefully")

})


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`))
const importData = async () => {
   try {
      await Tour.create(tours)
      console.log("Data successfully loaded")
      process.exit()
   } catch (err) {
      console.log(err.message)
   }
}

const deleteData = async () => {
   try {
      await Tour.deleteMany()
      console.log("Data successfully deleted")
      process.exit()
   } catch (err) {
      console.log(err.message)
   }
}

if (process.argv[2] === '--import') {
   importData()
} else if (process.argv[2] === '--delete') {
   deleteData()
}
const mongoose = require('mongoose')
// const reqtour = require('./mydata.json')
const fs = require('fs')
const dotenv = require('dotenv');
const Tour = require('../../Models/tourModel')
// const app = require('./app');

// dotenv.config({ path: './config.env' });
// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// mongoose.connect(DB, {
mongoose.connect('mongodb://localhost:27017/mydata').then(con => {
   // console.log(con.connection)
   console.log("Connection Succefully")
   creatdb().then(data => console.log(data)).catch(err => console.log(err.message))

})

let reqtour = fs.readFileSync(`${__dirname}/mydata.json`)
reqtour = JSON.parse(reqtour)
const creatdb = async () => {
   // await Tour.deleteMany({})
   // console.log(reqtour)
   for (let rt of reqtour) {
      console.log(rt)
      const t = await new Tour(rt)
      await t.save()
   }
}


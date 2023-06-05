const mongoose = require('mongoose');
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
   console.log('UNCAUGHT EXCEPTION! Shutting down...........')
   console.log(err)
   console.log(err.name, err.message)
   process.exit(1)
})

dotenv.config({ path: './config.env' })

const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
   // .connect(process.env.DATABASE_LOCAL, {
   .connect(DB, {
      useNewUrlParser: true, useUnifiedTopology: true
   })
   .then(() => console.log('DB connection Successfull'))


const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
   console.log(`Listening on ${PORT}`)
})

process.on('unhandledRejection', err => {
   console.log('UNHANDLED REJECTION! Shutting down...........')
   console.log(err.name, err.message)
   server.close(() => {
      process.exit(1)
   })
})


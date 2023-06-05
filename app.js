const path = require('path')
const express = require('express')

const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')
const compression = require('compression')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const viewRoutes = require('./routes/viewRoutes')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controller/errorController')

//Start express app
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
   console.log('UNCAUGHT EXCEPTION! Shutting down...........')
   console.log(err)
   console.log(err.name, err.message)
   process.exit(1)
})

dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
   // .connect(process.env.DATABASE_LOCAL, {
   .connect(DB, {
      useNewUrlParser: true, useUnifiedTopology: true
   })
   .then(() => console.log('DB connection Successfull'))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// 1) GLOBAL MIDDLEWARE

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP headers
// app.use(helmet());
app.use(
   helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
   })
);

//Development logging
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'))
}

// Limit request from same API
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,
   message: 'Too many request from this IP, Please try agian in an hour!'
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitize against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
   hpp({
      whitelist: [
         'duration',
         'ratingsAverage',
         'ratingQuantity',
         'price',
         'maxGroupSize',
         'difficulty'
      ]
   })
)

app.use(compression())

// Testing middleware
app.use((req, res, next) => {
   req.requestTime = new Date().toISOString()
   // console.log(req.cookies)
   // console.log(req.headers)
   next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRoutes)
app.use('/api/v1/bookings', bookingRoutes)
app.use('/', viewRoutes)

app.all('*', (req, res, next) => {
   // if (req.originalUrl === '/bundle.js.map')
   //    next()
   // else
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})


app.use(globalErrorHandler)

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

module.exports = app;
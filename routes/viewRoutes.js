const express = require('express')
const viewContoller = require('./../controller/viewController')
const authContoller = require('./../controller/authController')
const bookingContoller = require('./../controller/bookingController')
const router = express.Router()

router.get('/me', authContoller.protect, viewContoller.getAccount)
router.post('/submit-user-data', authContoller.protect, viewContoller.updateUserData)
router.get('/my-tours', authContoller.protect, viewContoller.getMyTours)

router.use(authContoller.isLoggedIn)
router.get('/', bookingContoller.createBookingCheckout, viewContoller.getOverview)
router.get('/tour/:slug', viewContoller.getTour)
router.get('/login', viewContoller.getLoginForm)
module.exports = router;
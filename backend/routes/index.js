const express = require('express')
const router = express.Router()

const usersRoutes = require('./users')
const eventsRoutes = require('./events')
const paymentsRoutes = require('./payments')

router.use('/users', usersRoutes)
router.use('/events', eventsRoutes)
router.use('/payments', paymentsRoutes)

module.exports = router
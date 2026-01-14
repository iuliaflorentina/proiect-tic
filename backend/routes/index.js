const express=require('express')
const router=express.Router()

const usersRoutes=require('./users')
const eventsRoutes=require('./events')

router.use('/users',usersRoutes)
router.use('/events',eventsRoutes)

module.exports=router
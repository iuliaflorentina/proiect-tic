const express=require('express')
const router=express.Router()

const eventsController=require("../controllers/events")
const {validate} = require('../middlewares/validate')
const { eventValidator } = require('../validators/eventsValidation')

router.post("/",eventValidator,validate,eventsController.addEvent())
router.delete("/:id",eventsController.deleteEvent())
router.put("/:id",eventsController.updateEvent())
router.get("/:id",eventsController.getEventById())
router.get("/",eventsController.getEvents())

module.exports=router
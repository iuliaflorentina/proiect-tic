const express = require('express')
const router = express.Router()

const eventsController = require("../controllers/events")
const { validate } = require('../middlewares/validate')
const { eventValidator } = require('../validators/eventsValidation')
const { validateToken } = require('../middlewares/auth')

router.post("/", validateToken, eventValidator, validate, eventsController.addEventController)
router.delete("/:id", validateToken, eventsController.deleteEventController)
router.put("/:id", validateToken, eventsController.updateEventController)
router.get("/:id", eventsController.getEventById)
router.get("/", eventsController.getEvents)

module.exports = router
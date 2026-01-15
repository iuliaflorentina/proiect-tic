const {
  findEvents,
  findEventById,
  addEvent,
  updateEvent,
  deleteEvent
} = require("../models/events")

const getEvents  = async (req, res) => {
  try {
    const events = await findEvents()
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getEventById  = async (req, res) => {
  try {
    const { id } = req.params
    const event = await findEventById(id)
    if (!event) return res.status(404).json({ message: "Event not found" })
    res.status(200).json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addEventController  = async (req, res) => {
  try {
    const newEvent = req.body
    const createdEvent = await addEvent(newEvent)
    res.status(201).json(createdEvent)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateEventController  = async (req, res) => {
  try {
    const { id } = req.params
    const eventUpdated = req.body
    const updatedEvent = await updateEvent(id, eventUpdated)
    res.status(200).json(updatedEvent)
  } catch (error) {
    if (error.message === "Event not found") return res.status(404).json({ message: error.message })
    res.status(500).json({ message: error.message })
  }
}

const deleteEventController  = async (req, res) => {
  try {
    const { id } = req.params
    const message = await deleteEvent(id)
    res.status(200).json(message)
  } catch (error) {
    if (error.message === "Event not found") return res.status(404).json({ message: error.message })
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getEvents,
  getEventById,
  addEventController,
  updateEventController,
  deleteEventController 
}

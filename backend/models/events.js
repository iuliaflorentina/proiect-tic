const db = require("../db")
const eventsCollection = db.collection("events")

const findEvents = async () => {
  const snapshot = await eventsCollection.get()
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const findEventById = async (id) => {
  const doc = await eventsCollection.doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() }
}

const addEvent = async (newEvent) => {
  const docRef = await eventsCollection.add(newEvent)
  return { id: docRef.id, ...newEvent }
}

const updateEvent = async (id, eventUpdated) => {
  const docRef = eventsCollection.doc(id)
  const doc = await docRef.get()
  if (!doc.exists) throw new Error("Event not found")

  await docRef.update({ ...eventUpdated })
  return { id, ...doc.data(), ...eventUpdated }
}

const deleteEvent = async (id) => {
  const docRef = eventsCollection.doc(id)
  const doc = await docRef.get()
  if (!doc.exists) throw new Error("Event not found")

  await docRef.delete()
  return { message: "Event deleted successfully" }
}

module.exports = {
  findEvents,
  findEventById,
  addEvent,
  updateEvent,
  deleteEvent
}

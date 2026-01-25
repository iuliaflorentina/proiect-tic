import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useEventsStore = defineStore('events', () => {
    const events = ref([])
    const currentEvent = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const searchQuery = ref('')
    const authStore = useAuthStore()

    function setSearchQuery(query) {
        searchQuery.value = query
    }

    async function fetchEvents() {
        isLoading.value = true
        error.value = null
        try {
            const headers = {}
            if (authStore.token) {
                headers['Authorization'] = `Bearer ${authStore.token}`
            }

            const response = await fetch('/events', { headers })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                authStore.logout()
                return []
            }

            if (!response.ok) {
                throw new Error('Failed to fetch events')
            }

            const data = await response.json()
            events.value = data
        } catch (err) {
            error.value = err.message
            console.error(err)
        } finally {
            isLoading.value = false
        }
    }

    async function fetchEventById(id) {
        isLoading.value = true
        error.value = null
        try {
            const headers = {}
            if (authStore.token) {
                headers['Authorization'] = `Bearer ${authStore.token}`
            }

            const response = await fetch(`/events/${id}`, { headers })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                authStore.logout()
                return null
            }

            if (!response.ok) {
                throw new Error('Failed to fetch event')
            }

            const data = await response.json()
            currentEvent.value = data
            return data
        } catch (err) {
            error.value = err.message
            console.error(err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function updateEventTickets(eventId, ticketsPurchased) {
        error.value = null
        try {
            const event = await fetchEventById(eventId)
            if (!event || !event.tickets) {
                throw new Error('Event not found or has no tickets')
            }

            const updatedTickets = event.tickets.map(ticket => {
                const purchased = ticketsPurchased.find(p =>
                    p.type.toLowerCase() === ticket.type.toLowerCase()
                )

                if (purchased) {
                    const currentAvailable = ticket.availableQuantity !== undefined ? ticket.availableQuantity : (ticket.quantity || 0)
                    const newQuantity = currentAvailable - purchased.quantity
                    if (newQuantity < 0) {
                        throw new Error(`Insufficient ${ticket.type} tickets available`)
                    }
                    return { ...ticket, availableQuantity: newQuantity }
                }
                return ticket
            })

            const response = await fetch(`/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify({ tickets: updatedTickets })
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                authStore.logout()
                return false
            }

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to update event tickets')
            }

            currentEvent.value = { ...event, tickets: updatedTickets }
            return true
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    async function addEvent(eventData) {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify(eventData)
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                authStore.logout()
                return null
            }

            if (!response.ok) {
                const data = await response.json()
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map(err => err.msg).join(', ')
                    throw new Error(messages)
                }
                throw new Error(data.message || 'Failed to add event')
            }

            const newEvent = await response.json()
            events.value.push(newEvent)
            return newEvent
        } catch (err) {
            error.value = err.message
            console.error(err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function updateEvent(id, eventData) {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch(`/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: JSON.stringify(eventData)
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                authStore.logout()
                return null
            }

            if (!response.ok) {
                const data = await response.json()
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map(err => err.msg).join(', ')
                    throw new Error(messages)
                }
                throw new Error(data.message || 'Failed to update event')
            }

            const updatedEvent = await response.json()
            const index = events.value.findIndex(e => e.id === id)
            if (index !== -1) {
                events.value[index] = updatedEvent
            }
            if (currentEvent.value && currentEvent.value.id === id) {
                currentEvent.value = updatedEvent
            }
            return updatedEvent
        } catch (err) {
            error.value = err.message
            console.error(err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function deleteEvent(id) {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch(`/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                authStore.logout()
                return false
            }

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to delete event')
            }

            events.value = events.value.filter(e => e.id !== id)
            return true
        } catch (err) {
            error.value = err.message
            console.error(err)
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        events,
        currentEvent,
        isLoading,
        error,
        searchQuery,
        fetchEvents,
        fetchEventById,
        updateEventTickets,
        addEvent,
        updateEvent,
        deleteEvent,
        setSearchQuery
    }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useEventsStore = defineStore('events', () => {
    const events = ref([])
    const currentEvent = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const authStore = useAuthStore()

    async function fetchEvents() {
        isLoading.value = true
        error.value = null
        try {
            const headers = {}
            if (authStore.token) {
                headers['Authorization'] = authStore.token
            }

            const response = await fetch('/events', { headers })

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    // Silent fail or specific error for unauthenticated
                    return []
                }
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
                headers['Authorization'] = authStore.token
            }

            const response = await fetch(`/events/${id}`, { headers })

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
            // First, fetch the current event to get latest ticket quantities
            const event = await fetchEventById(eventId)
            if (!event || !event.tickets) {
                throw new Error('Event not found or has no tickets')
            }

            // Calculate new quantities
            const updatedTickets = event.tickets.map(ticket => {
                // Find matching purchased tickets
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

            // Update the event with new ticket quantities
            const response = await fetch(`/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authStore.token
                },
                body: JSON.stringify({ tickets: updatedTickets })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Failed to update event tickets')
            }

            // Update local state
            currentEvent.value = { ...event, tickets: updatedTickets }

            return true
        } catch (err) {
            error.value = err.message
            throw err
        }
    }

    return {
        events,
        currentEvent,
        isLoading,
        error,
        fetchEvents,
        fetchEventById,
        updateEventTickets
    }
})

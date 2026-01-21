import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)
    const error = ref(null)

    const router = useRouter()

    const isAuthenticated = computed(() => {
        if (!token.value) return false
        return !isTokenExpired(token.value)
    })

    function isTokenExpired(token) {
        if (!token) return true
        try {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''))

            const { exp } = JSON.parse(jsonPayload)
            if (!exp) return false

            const currentTime = Math.floor(Date.now() / 1000)
            return exp < currentTime
        } catch (e) {
            console.error('Error decoding token:', e)
            return true
        }
    }

    // Startup check
    if (token.value && isTokenExpired(token.value)) {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    async function login(email, password) {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Login failed')
            }

            if (data.token) {
                token.value = data.token
                user.value = data.user || { email }

                localStorage.setItem('token', token.value)
                localStorage.setItem('user', JSON.stringify(user.value))
                return true
            }
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function signup(userData) {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed')
            }

            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    async function updateProfile(updatedData) {
        isLoading.value = true
        error.value = null
        try {
            if (!user.value || !user.value.id) {
                throw new Error('User ID not found')
            }

            const response = await fetch(`/users/${user.value.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                },
                body: JSON.stringify(updatedData)
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                logout()
                router.push('/login')
                return false
            }

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Update failed')
            }

            user.value = { ...user.value, ...updatedData }
            localStorage.setItem('user', JSON.stringify(user.value))

            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function deleteAccount() {
        isLoading.value = true
        error.value = null
        try {
            if (!user.value || !user.value.id) {
                throw new Error('User ID not found')
            }

            const response = await fetch(`/users/${user.value.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token.value}`
                }
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                logout()
                router.push('/login')
                return false
            }

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Delete failed')
            }

            logout()
            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    const boughtTickets = ref([])

    async function fetchBoughtTickets() {
        if (!user.value || !user.value.id) return

        try {
            const response = await fetch(`/users/boughtTickets/${user.value.id}`, {
                headers: {
                    'Authorization': `Bearer ${token.value}`
                }
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                logout()
                router.push('/login')
                return
            }

            if (!response.ok) throw new Error('Failed to fetch tickets')

            const data = await response.json()
            boughtTickets.value = data.tickets || []
        } catch (err) {
            console.error(err)
        }
    }

    async function buyTicket(ticketDetails) {
        isLoading.value = true
        error.value = null
        try {
            if (!user.value || !user.value.id) throw new Error('User not found')

            // 1. Ensure we have the latest bought tickets
            await fetchBoughtTickets()

            // 2. Create new ticket object
            const newTicket = {
                id: Date.now().toString(), // Simple ID generation
                eventId: ticketDetails.eventId,
                eventTitle: ticketDetails.eventTitle,
                ticketType: ticketDetails.ticketType,
                quantity: ticketDetails.quantity,
                price: ticketDetails.price,
                date: new Date().toISOString()
            }

            // 3. Append to existing tickets
            const updatedTickets = [...boughtTickets.value, newTicket]

            // 4. Update user profile with new tickets list
            // Note: The backend updateUserData controller expects the fields to update in the body
            const response = await fetch(`/users/${user.value.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                },
                body: JSON.stringify({ boughtTickets: updatedTickets })
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                logout()
                router.push('/login')
                return false
            }

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Purchase failed')
            }

            // 5. Update local state
            boughtTickets.value = updatedTickets
            // Also update user object if it contains boughtTickets
            user.value = { ...user.value, boughtTickets: updatedTickets }
            localStorage.setItem('user', JSON.stringify(user.value))

            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function buyTickets(ticketsArray) {
        isLoading.value = true
        error.value = null
        try {
            if (!user.value || !user.value.id) throw new Error('User not found')

            // Extract eventId from first ticket (all tickets should be from same event)
            const eventId = ticketsArray[0]?.event?.eventId
            if (!eventId) throw new Error('Invalid ticket data')

            // Import events store dynamically to avoid circular dependency
            const { useEventsStore } = await import('./events')
            const eventsStore = useEventsStore()

            // 1. Update event ticket quantities FIRST (this validates availability)
            await eventsStore.updateEventTickets(eventId, ticketsArray)

            // 2. Ensure we have the latest bought tickets
            await fetchBoughtTickets()

            // 3. Append new tickets to existing ones
            const updatedTickets = [...boughtTickets.value, ...ticketsArray]

            // 4. Update user profile with new tickets list
            const response = await fetch(`/users/${user.value.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`
                },
                body: JSON.stringify({ boughtTickets: updatedTickets })
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                logout()
                router.push('/login')
                return false
            }

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message || 'Purchase failed')
            }

            // 5. Update local state
            boughtTickets.value = updatedTickets
            user.value = { ...user.value, boughtTickets: updatedTickets }
            localStorage.setItem('user', JSON.stringify(user.value))

            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function fetchBuyersByEvent(eventId) {
        isLoading.value = true
        error.value = null
        try {
            const response = await fetch(`/users/eventBuyers/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${token.value}`
                }
            })

            if (response.status === 401 || response.status === 403) {
                alert('Session expired. Please login again.')
                logout()
                router.push('/login')
                return []
            }

            if (!response.ok) throw new Error('Failed to fetch buyers')

            const data = await response.json()
            return data.buyers || []
        } catch (err) {
            console.error(err)
            error.value = err.message
            return []
        } finally {
            isLoading.value = false
        }
    }

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
        boughtTickets,
        fetchBoughtTickets,
        buyTicket,
        buyTickets,
        fetchBuyersByEvent
    }
})

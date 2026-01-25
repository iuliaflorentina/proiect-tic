import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)
    const error = ref(null)

    const router = useRouter()

    const isAuthenticated = computed(() => {
        if (!token.value) return false
        try {
            const decoded = jwtDecode(token.value)
            const currentTime = Math.floor(Date.now() / 1000)
            return decoded.exp > currentTime
        } catch {
            return false
        }
    })

    if (token.value) {
        try {
            const decoded = jwtDecode(token.value)
            const currentTime = Math.floor(Date.now() / 1000)
            if (decoded.exp <= currentTime) {
                logout()
            }
        } catch {
            logout()
        }
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
            await fetchBoughtTickets()

            const newTicket = {
                id: Date.now().toString(),
                eventId: ticketDetails.eventId,
                eventTitle: ticketDetails.eventTitle,
                ticketType: ticketDetails.ticketType,
                quantity: ticketDetails.quantity,
                price: ticketDetails.price,
                date: new Date().toISOString()
            }

            const updatedTickets = [...boughtTickets.value, newTicket]

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

    async function buyTickets(ticketsArray) {
        isLoading.value = true
        error.value = null
        try {
            if (!user.value || !user.value.id) throw new Error('User not found')

            const eventId = ticketsArray[0]?.event?.eventId
            if (!eventId) throw new Error('Invalid ticket data')

            const { useEventsStore } = await import('./events')
            const eventsStore = useEventsStore()

            await eventsStore.updateEventTickets(eventId, ticketsArray)

            await fetchBoughtTickets()

            const updatedTickets = [...boughtTickets.value, ...ticketsArray]

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

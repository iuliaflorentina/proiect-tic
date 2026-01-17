import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const token = ref(localStorage.getItem('token') || null)
    const isLoading = ref(false)
    const error = ref(null)

    const router = useRouter()

    const isAuthenticated = computed(() => !!token.value)

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

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        login,
        signup,
        logout
    }
})

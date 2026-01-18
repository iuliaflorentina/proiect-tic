<template>
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
            <h1 class="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">My Profile</h1>

            <div v-if="authStore.isLoading" class="text-center text-gray-400 py-8">
                Loading...
            </div>

            <div v-else-if="user">
                <!-- View Mode -->
                <div v-if="!isEditing" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <p class="text-lg text-white font-medium">{{ user.name }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <p class="text-lg text-white font-medium">{{ user.email }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-400 mb-1">Role</label>
                            <p class="text-lg text-white font-medium capitalize">{{ user.role }}</p>
                        </div>
                        <div v-if="user.role === 'organizer'">
                            <label class="block text-sm font-medium text-gray-400 mb-1">Organization</label>
                            <p class="text-lg text-white font-medium">{{ user.organizationName }}</p>
                        </div>
                    </div>

                    <div class="pt-6 border-t border-gray-700 flex justify-between items-center mt-6">
                        <button @click="startEditing"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 font-medium">
                            Edit Profile
                        </button>

                        <button @click="confirmDelete"
                            class="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors duration-200 font-medium">
                            Delete Account
                        </button>
                    </div>

                    <!-- Bought Tickets Section -->
                    <div v-if="user.role === 'client' || !user.role" class="mt-8 border-t border-gray-700 pt-8">
                        <button @click="toggleTickets"
                            class="w-full flex justify-between items-center text-left focus:outline-none group">
                            <h2
                                class="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                                My Bought Tickets
                            </h2>
                            <span class="text-gray-400 group-hover:text-blue-400 text-xl">
                                {{ showTickets ? '−' : '+' }}
                            </span>
                        </button>

                        <div v-show="showTickets" class="mt-4 space-y-4 animate-fade-in-down">
                            <div v-if="ticketsLoading && !boughtTickets.length" class="text-gray-400 text-center py-4">
                                Loading tickets...
                            </div>
                            <div v-else-if="boughtTickets.length === 0" class="text-gray-400 text-center py-4">
                                You have not bought any tickets yet.
                            </div>
                            <div v-else class="grid gap-4">
                                <div v-for="ticket in boughtTickets" :key="ticket.ticketId || ticket.id"
                                    class="bg-gray-700 p-4 rounded-md border border-gray-600">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="text-lg font-semibold text-white">
                                            {{ ticket.event?.name || 'Event Ticket' }}
                                        </h3>
                                        <span
                                            class="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full uppercase">
                                            {{ ticket.type || 'Standard' }}
                                        </span>
                                    </div>
                                    <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
                                        <p class="text-gray-300">
                                            <span class="text-gray-500">Date:</span>
                                            {{ ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() :
                                                (ticket.date ? new Date(ticket.date).toLocaleDateString() : 'N/A') }}
                                        </p>
                                        <p class="text-gray-300">
                                            <span class="text-gray-500">Location:</span>
                                            {{ ticket.event?.adress || 'N/A' }}
                                        </p>
                                        <p class="text-gray-300">
                                            <span class="text-gray-500">Quantity:</span>
                                            {{ ticket.quantity || 1 }}
                                        </p>
                                        <p class="text-gray-300">
                                            <span class="text-gray-500">Price:</span>
                                            ${{ ticket.price || 0 }}
                                        </p>
                                        <p class="text-gray-300 col-span-2 font-semibold">
                                            <span class="text-gray-500">Total:</span>
                                            ${{ (ticket.price || 0) * (ticket.quantity || 1) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Edit Mode -->
                <form v-else @submit.prevent="handleUpdate" class="space-y-6 animate-fade-in-down">
                    <div class="space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                            <input id="name" v-model="editForm.name" type="text" required
                                class="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                        </div>

                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email
                                Address</label>
                            <input id="email" v-model="editForm.email" type="email" required
                                class="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                        </div>

                        <div v-if="user.role === 'organizer'">
                            <label for="orgName" class="block text-sm font-medium text-gray-300 mb-1">Organization
                                Name</label>
                            <input id="orgName" v-model="editForm.organizationName" type="text" required
                                class="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                        </div>
                    </div>

                    <div v-if="authStore.error"
                        class="text-red-400 text-sm bg-red-900/10 p-3 rounded-md border border-red-900/30">
                        {{ authStore.error }}
                    </div>

                    <div class="pt-6 border-t border-gray-700 flex gap-4 mt-6">
                        <button type="submit"
                            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200 flex-1 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="authStore.isLoading">
                            {{ authStore.isLoading ? 'Saving...' : 'Save Changes' }}
                        </button>
                        <button type="button" @click="cancelEditing"
                            class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors duration-200 font-medium">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>

            <div v-else class="text-center py-8">
                <p class="text-red-400 mb-4 text-lg">You are not logged in.</p>
                <router-link to="/login"
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 inline-block">
                    Go to Login
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)
const boughtTickets = computed(() => authStore.boughtTickets)
const isEditing = ref(false)
const editForm = ref({})
const showTickets = ref(false)
const ticketsLoading = ref(false)

async function toggleTickets() {
    showTickets.value = !showTickets.value
    if (showTickets.value && boughtTickets.value.length === 0) {
        ticketsLoading.value = true
        await authStore.fetchBoughtTickets()
        ticketsLoading.value = false
    }
}

function startEditing() {
    editForm.value = { ...user.value }
    isEditing.value = true
}

function cancelEditing() {
    isEditing.value = false
    editForm.value = {}
    authStore.error = null
}

async function handleUpdate() {
    const success = await authStore.updateProfile(editForm.value)
    if (success) {
        isEditing.value = false
    }
}

async function confirmDelete() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone and you will be logged out immediately.')) {
        const success = await authStore.deleteAccount()
        if (success) {
            router.push('/')
        }
    }
}
</script>
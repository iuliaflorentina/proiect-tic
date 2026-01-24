<template>
    <div class="relative w-full flex justify-center py-12 min-h-screen bg-background overflow-x-hidden">
        <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
            <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="profileDotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" class="text-blue-light" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#profileDotPattern)" />
            </svg>
        </div>

        <div class="fixed -top-32 -left-32 w-80 h-80 bg-purple/20 rounded-full blur-[120px] pointer-events-none z-0">
        </div>
        <div class="fixed -bottom-32 -right-32 w-96 h-96 bg-blue/15 rounded-full blur-[140px] pointer-events-none z-0">
        </div>

        <div class="relative z-10 w-full max-w-3xl px-4 md:px-6">
            <div
                class="bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">

                <div class="relative h-48 bg-gradient-to-br from-blue via-purple to-purple-light overflow-hidden">
                    <div class="absolute inset-0 opacity-20">
                        <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                                <pattern id="profileHeaderGrid" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" stroke-width="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#profileHeaderGrid)" />
                        </svg>
                    </div>

                    <div class="absolute inset-0 overflow-hidden opacity-30">
                        <div
                            class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent">
                        </div>
                        <div
                            class="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent">
                        </div>
                    </div>

                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                        <div
                            class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-3 shadow-2xl">
                            <span class="text-4xl text-white">👤</span>
                        </div>
                        <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">My Profile
                        </h1>
                    </div>
                </div>

                <div class="p-8 md:p-10">
                    <div v-if="authStore.isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
                        <div
                            class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary">
                        </div>
                        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Accessing Data...</p>
                    </div>

                    <div v-else-if="user">
                        <div v-if="!isEditing" class="space-y-10 animate-in fade-in duration-500">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="group">
                                    <label
                                        class="block text-xs font-black uppercase tracking-widest text-purple-light mb-2 group-hover:text-white transition-colors">Full
                                        Name</label>
                                    <p class="text-xl text-white font-bold">{{ user.name }}</p>
                                </div>
                                <div class="group">
                                    <label
                                        class="block text-xs font-black uppercase tracking-widest text-purple-light mb-2 group-hover:text-white transition-colors">Email
                                        Address</label>
                                    <p class="text-xl text-white font-bold truncate">{{ user.email }}</p>
                                </div>
                                <div class="group">
                                    <label
                                        class="block text-xs font-black uppercase tracking-widest text-purple-light mb-2 group-hover:text-white transition-colors">Current
                                        Role</label>
                                    <div class="flex">
                                        <span
                                            class="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-black text-primary uppercase tracking-wider">
                                            {{ user.role }}
                                        </span>
                                    </div>
                                </div>
                                <div v-if="user.role === 'organizer'" class="group">
                                    <label
                                        class="block text-xs font-black uppercase tracking-widest text-purple-light mb-2 group-hover:text-white transition-colors">Organization</label>
                                    <p class="text-xl text-white font-bold">{{ user.organizationName }}</p>
                                </div>
                            </div>

                            <div
                                class="pt-8 border-t border-border/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <button @click="startEditing"
                                    class="group relative w-full sm:w-auto px-8 py-3 bg-primary cursor-pointer overflow-hidden rounded-xl font-black text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95">
                                    <div
                                        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer">
                                    </div>
                                    <span class="relative group-hover:text-neon transition-colors duration-300">Edit
                                        Profile</span>
                                </button>

                                <button @click="confirmDelete"
                                    class="w-full sm:w-auto px-8 py-3 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-black text-sm uppercase tracking-widest cursor-pointer">
                                    Archive Account
                                </button>
                            </div>

                            <div v-if="user.role === 'client' || !user.role"
                                class="mt-10 pt-10 border-t border-border/30">
                                <button @click="toggleTickets"
                                    class="w-full flex justify-between items-center text-left focus:outline-none group cursor-pointer bg-white/5 p-6 rounded-2xl border border-border/20 hover:bg-white/10 transition-all">
                                    <div>
                                        <h2
                                            class="text-2xl font-black text-white tracking-tight group-hover:text-neon transition-all">
                                            My Digital Assets</h2>
                                        <p
                                            class="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">
                                            Verified purchases & event access</p>
                                    </div>
                                    <div
                                        class="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-white transition-all text-2xl">
                                        {{ showTickets ? '−' : '+' }}
                                    </div>
                                </button>

                                <div v-show="showTickets"
                                    class="mt-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                    <div v-if="ticketsLoading && !boughtTickets.length"
                                        class="text-gray-500 font-bold text-center py-10 uppercase tracking-widest text-xs">
                                        Decrypting Tickets...
                                    </div>
                                    <div v-else-if="boughtTickets.length === 0"
                                        class="text-gray-500 font-bold text-center py-10 uppercase tracking-widest text-xs bg-black/20 rounded-2xl border border-dashed border-border/30">
                                        No active assets found.
                                    </div>
                                    <div v-else class="grid gap-6">
                                        <div v-for="ticket in boughtTickets" :key="ticket.ticketId || ticket.id"
                                            class="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-light/50 transition-all group overflow-hidden relative">
                                            <div
                                                class="absolute -right-4 -top-4 w-24 h-24 bg-purple/10 rounded-full blur-2xl group-hover:bg-purple/20 transition-all">
                                            </div>

                                            <div class="relative z-10">
                                                <div class="flex justify-between items-start mb-4">
                                                    <h3 class="text-xl font-black text-white tracking-tight">
                                                        {{ ticket.event?.name || 'Event Ticket' }}
                                                    </h3>
                                                    <span
                                                        class="px-3 py-1 bg-primary/20 border border-primary/20 text-primary text-[10px] font-black rounded-full uppercase tracking-tighter shadow-sm">
                                                        {{ ticket.type || 'Standard' }}
                                                    </span>
                                                </div>

                                                <div class="grid grid-cols-2 gap-4 text-xs">
                                                    <div class="flex flex-col gap-1">
                                                        <span
                                                            class="uppercase tracking-widest text-muted-foreground font-black">Timeline</span>
                                                        <span class="text-white font-bold">
                                                            {{ ticket.event?.date ? new
                                                                Date(ticket.event.date).toLocaleDateString() : 'N/A' }}
                                                        </span>
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <span
                                                            class="uppercase tracking-widest text-muted-foreground font-black">Coordinates</span>
                                                        <span class="text-white font-bold truncate">
                                                            {{ ticket.event?.adress || 'N/A' }}
                                                        </span>
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <span
                                                            class="uppercase tracking-widest text-muted-foreground font-black">Unit
                                                            Quantity</span>
                                                        <span class="text-white font-bold">{{ ticket.quantity || 1
                                                            }}</span>
                                                    </div>
                                                    <div class="flex flex-col gap-1">
                                                        <span
                                                            class="uppercase tracking-widest text-muted-foreground font-black">Unit
                                                            Price</span>
                                                        <span class="text-white font-bold">${{ ticket.price || 0
                                                            }}</span>
                                                    </div>
                                                </div>

                                                <div
                                                    class="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                                    <span
                                                        class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">Total
                                                        Investment</span>
                                                    <span class="text-lg font-black text-purple-light">${{ (ticket.price
                                                        || 0) * (ticket.quantity || 1) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form v-else @submit.prevent="handleUpdate" class="space-y-8 animate-in fade-in duration-500">
                            <div class="space-y-6">
                                <div class="group">
                                    <label for="name"
                                        class="block text-[10px] font-black uppercase tracking-[0.3em] text-purple-light mb-2 group-focus-within:text-white transition-colors">Full
                                        Identity</label>
                                    <input id="name" v-model="editForm.name" type="text" required
                                        class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-light/20 focus:border-blue-light transition-all placeholder:text-muted-foreground/30"
                                        placeholder="Full Name" />
                                </div>

                                <div class="group">
                                    <label for="email"
                                        class="block text-[10px] font-black uppercase tracking-[0.3em] text-purple-light mb-2 group-focus-within:text-white transition-colors">Digital
                                        Contact</label>
                                    <input id="email" v-model="editForm.email" type="email" required
                                        class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-light/20 focus:border-blue-light transition-all placeholder:text-muted-foreground/30"
                                        placeholder="email@example.com" />
                                </div>

                                <div v-if="user.role === 'organizer'" class="group">
                                    <label for="orgName"
                                        class="block text-[10px] font-black uppercase tracking-[0.3em] text-purple-light mb-2 group-focus-within:text-white transition-colors">Entity
                                        Name</label>
                                    <input id="orgName" v-model="editForm.organizationName" type="text" required
                                        class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-light/20 focus:border-blue-light transition-all placeholder:text-muted-foreground/30"
                                        placeholder="Organization" />
                                </div>
                            </div>

                            <div v-if="authStore.error"
                                class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-bold animate-in slide-in-from-top-2">
                                {{ authStore.error }}
                            </div>

                            <div class="pt-8 border-t border-border/30 flex flex-col sm:flex-row gap-4">
                                <button type="submit"
                                    class="group relative flex-1 py-4 bg-primary cursor-pointer overflow-hidden rounded-xl font-black text-primary-foreground shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                                    :disabled="authStore.isLoading">
                                    <div
                                        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer">
                                    </div>
                                    <span class="relative group-hover:text-neon transition-colors duration-300">
                                        {{ authStore.isLoading ? 'Committing...' : 'Commit Changes' }}
                                    </span>
                                </button>
                                <button type="button" @click="cancelEditing"
                                    class="flex-1 py-4 border border-border/50 bg-white/5 rounded-xl text-white font-bold hover:bg-white/10 transition-all cursor-pointer">
                                    Abort
                                </button>
                            </div>
                        </form>
                    </div>

                    <div v-else class="text-center py-20 animate-in fade-in duration-700">
                        <p class="text-3xl font-black text-red-400 mb-8 uppercase tracking-widest drop-shadow-md">
                            Unauthorized View</p>
                        <router-link to="/login"
                            class="inline-block px-10 py-4 bg-primary cursor-pointer rounded-xl font-black text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:shadow-primary/20">
                            Establish Authentication
                        </router-link>
                    </div>
                </div>
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
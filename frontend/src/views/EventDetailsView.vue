<template>
    <div class="w-full flex justify-center py-12">
        <div class="w-full max-w-7xl px-4 md:px-6">
            <div v-if="eventsStore.isLoading && !event" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary">
                </div>
                <p class="mt-4 text-gray-400 text-lg">Loading event details...</p>
            </div>

            <div v-else-if="event" class="flex flex-col space-y-12">
                <div>
                    <button @click="router.back()"
                        class="flex items-center text-gray-400 hover:text-purple-light transition-all hover:scale-105 cursor-pointer">
                        <span class="mr-2">←</span> Back to Events
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div class="lg:col-span-2 space-y-10">
                        <div class="aspect-video md:h-[400px] w-full rounded-2xl overflow-hidden relative shadow-2xl transition-all duration-500"
                            :class="getCardGradient(0)">

                            <img v-if="event.imageUrl" :src="event.imageUrl" :alt="event.title"
                                class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40">

                            <div class="absolute inset-0 opacity-20">
                                <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <defs>
                                        <pattern id="detailGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor"
                                                stroke-width="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100" height="100" fill="url(#detailGrid)" />
                                </svg>
                            </div>

                            <div class="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-[80px]">
                            </div>
                            <div class="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/20 blur-[60px]">
                            </div>

                            <div class="absolute inset-0 overflow-hidden opacity-30">
                                <div
                                    class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent">
                                </div>
                                <div
                                    class="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent">
                                </div>
                            </div>

                            <div
                                class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                                <span
                                    class="block text-sm font-semibold tracking-[0.3em] uppercase opacity-90 mb-4 text-white drop-shadow-md">
                                    {{ event.location?.city || 'Online' }}
                                </span>
                                <h1
                                    class="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-2xl">
                                    {{ event.name || event.title }}
                                </h1>
                            </div>

                            <div
                                class="absolute top-6 right-6 bg-background/60 backdrop-blur-xl px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/20 text-white shadow-2xl">
                                {{ event.date ? new Date(event.date).toLocaleDateString(undefined, {
                                    day: 'numeric',
                                    month: 'short', year: 'numeric'
                                }) : 'TBA' }}
                            </div>
                        </div>

                        <div class="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-border/50 shadow-xl">
                            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 py-3">
                                <h2 class="text-3xl font-bold text-white tracking-tight">Experience Decoded</h2>
                                <span
                                    class="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black text-lg">
                                    Starting at ${{ minPrice || 'Free' }}
                                </span>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div class="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span class="text-2xl">📅</span>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs uppercase tracking-widest text-muted-foreground font-bold">Event
                                            Date</span>
                                        <span class="text-lg font-medium">{{ event.date ? new
                                            Date(event.date).toLocaleDateString() : 'Date TBA' }}</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                    <span class="text-2xl">📍</span>
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs uppercase tracking-widest text-muted-foreground font-bold">Location</span>
                                        <span class="text-lg font-medium">
                                            {{ event.location.name }}, {{ event.location.city }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-10">
                                <h3 class="text-xl font-bold text-white border-b border-border/50 py-5">About this
                                    Event</h3>
                                <p class="text-gray-400 leading-relaxed whitespace-pre-wrap text-lg py-5">{{
                                    event.description }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-1">
                        <div
                            class="bg-card/40 backdrop-blur-xl rounded-2xl p-8 border border-border/50 sticky top-8 shadow-2xl">
                            <h2 class="text-2xl font-black text-white mb-8 tracking-tight">Secure Your Entry</h2>

                            <form @submit.prevent="handlePurchase">
                                <div v-if="availableTickets.length > 0" class="p-5 flex flex-col gap-4">
                                    <div v-for="(ticket, index) in availableTickets" :key="index"
                                        class="p-4 rounded-xl border bg-white/5 border-white/10 group transition-all hover:bg-white/10">
                                        <div class="flex justify-between items-center">
                                            <div class="flex flex-col">
                                                <span
                                                    class="text-white font-bold text-lg group-hover:text-purple-light transition-colors">{{
                                                        ticket.type || 'Standard' }}</span>
                                            </div>
                                            <span class="text-white font-black text-xl">${{ ticket.price || 0 }}</span>
                                        </div>
                                        <div
                                            class="flex items-center rounded-lg border border-border/50 bg-black/40 overflow-hidden">
                                            <button type="button" @click="decrementTicket(ticket.originalIndex)"
                                                class="px-4 py-2 hover:bg-primary hover:text-white transition-all text-white font-bold cursor-pointer">-</button>
                                            <input v-model.number="ticketQuantities[ticket.originalIndex]" type="number"
                                                min="0" :max="ticket.displayAvailable"
                                                class="w-full bg-transparent text-center text-white focus:outline-none py-2 font-bold"
                                                @input="validateQuantity(ticket.originalIndex, ticket.displayAvailable)" />
                                            <button type="button"
                                                @click="incrementTicket(ticket.originalIndex, ticket.displayAvailable)"
                                                class="px-4 py-2 hover:bg-primary hover:text-white transition-all text-white font-bold cursor-pointer">+</button>
                                        </div>
                                    </div>
                                </div>
                                <div v-else
                                    class="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center">
                                    <p class="font-black text-lg">SOLD OUT</p>
                                    <p class="text-sm opacity-80 mt-1 text-muted-foreground">Catch the next wave.</p>
                                </div>

                                <div class="border-t border-border/50 pt-6 mt-8">
                                    <div class="space-y-3 mb-6">
                                        <div v-for="(ticket, index) in availableTickets" :key="index">
                                            <div v-if="ticketQuantities[ticket.originalIndex] > 0"
                                                class="flex justify-between text-sm">
                                                <span class="text-gray-400">{{ ticket.type }} × {{
                                                    ticketQuantities[ticket.originalIndex] }}</span>
                                                <span class="text-white font-bold">${{ (ticket.price *
                                                    ticketQuantities[ticket.originalIndex]).toFixed(2) }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex justify-between items-center text-xl font-black text-white mb-8">
                                        <span>Total</span>
                                        <span class="text-purple-light">${{ total }}</span>
                                    </div>

                                    <div v-if="successMessage"
                                        class="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center animate-in zoom-in-95 font-bold">
                                        {{ successMessage }}
                                    </div>

                                    <div v-if="authStore.error"
                                        class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center animate-in slide-in-from-top-2 font-bold">
                                        {{ authStore.error }}
                                    </div>

                                    <button type="submit"
                                        :disabled="authStore.isLoading || isSuccess || totalQuantity === 0"
                                        class="group relative w-full py-4 px-6 bg-primary cursor-pointer overflow-hidden rounded-xl shadow-2xl transition-all hover:scale-[1.03] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <div
                                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer">
                                        </div>
                                        <div
                                            class="relative flex items-center justify-center text-primary-foreground font-black text-lg">
                                            <span v-if="authStore.isLoading" class="flex items-center gap-2">
                                                <svg class="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" stroke-width="4" fill="none"></circle>
                                                    <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                    </path>
                                                </svg>
                                                Securing...
                                            </span>
                                            <span v-else-if="isSuccess" class="text-neon">Reserved! 🎟️</span>
                                            <span v-else class="group-hover:text-neon transition-colors duration-300">
                                                Confirm Purchase ({{ totalQuantity }})
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-20">
                <p class="text-3xl font-bold mb-6 text-white text-neon">Event not found.</p>
                <button @click="router.push('/')"
                    class="px-8 py-3 bg-white/5 rounded-xl border border-white/10 text-primary font-bold hover:bg-white/10 transition-all">Return
                    to Mission Control</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const authStore = useAuthStore()

const ticketQuantities = ref([])
const isSuccess = ref(false)
const successMessage = ref('')

const event = computed(() => eventsStore.currentEvent)

const getCardGradient = (index) => {
    const gradients = [
        'bg-gradient-to-br from-blue via-purple to-blue-light',
        'bg-gradient-to-br from-purple via-blue to-blue-light',
        'bg-gradient-to-br from-blue-light via-blue to-purple',
        'bg-gradient-to-br from-purple via-blue-light to-blue',
        'bg-gradient-to-br from-blue via-blue-light to-purple',
        'bg-gradient-to-br from-blue-light via-purple to-blue'
    ]
    return gradients[index % gradients.length]
}

const availableTickets = computed(() => {
    if (!event.value?.tickets) return []
    return event.value.tickets
        .map((ticket, index) => ({
            ...ticket,
            originalIndex: index,
            displayAvailable: ticket.availableQuantity !== undefined ? ticket.availableQuantity : (ticket.quantity || 0)
        }))
        .filter(ticket => ticket.displayAvailable > 0)
})

const total = computed(() => {
    if (!event.value?.tickets) return '0.00'
    return event.value.tickets.reduce((sum, ticket, index) => {
        return sum + (ticket.price * (ticketQuantities.value[index] || 0))
    }, 0).toFixed(2)
})

const totalQuantity = computed(() => {
    if (!availableTickets.value.length) return 0
    return availableTickets.value.reduce((sum, ticket) => {
        return sum + (ticketQuantities.value[ticket.originalIndex] || 0)
    }, 0)
})

const minPrice = computed(() => {
    if (!availableTickets.value?.length) return event.value?.price || 0
    return Math.min(...availableTickets.value.map(ticket => ticket.price))
})

watch(event, (newEvent) => {
    if (newEvent?.tickets) {
        ticketQuantities.value = new Array(newEvent.tickets.length).fill(0)
    }
}, { immediate: true })

function incrementTicket(index, maxQuantity = 10) {
    const currentQty = ticketQuantities.value[index] || 0
    if (currentQty < maxQuantity) {
        ticketQuantities.value[index] = currentQty + 1
    }
}

function decrementTicket(index) {
    if (ticketQuantities.value[index] > 0) {
        ticketQuantities.value[index]--
    }
}

function validateQuantity(index, maxQuantity = 10) {
    const qty = ticketQuantities.value[index]
    if (qty < 0) ticketQuantities.value[index] = 0
    if (qty > maxQuantity) ticketQuantities.value[index] = maxQuantity
}

onMounted(async () => {
    const eventId = route.params.id
    if (eventId) {
        await eventsStore.fetchEventById(eventId)
    }
})

async function handlePurchase() {
    if (!event.value || totalQuantity.value === 0) return

    const purchasedCount = totalQuantity.value

    const ticketsToPurchase = []

    event.value.tickets.forEach((ticket, index) => {
        const qty = ticketQuantities.value[index]
        if (qty > 0) {
            ticketsToPurchase.push({
                ticketId: `${event.value.id}-${ticket.type}-${Date.now()}`,
                event: {
                    eventId: event.value.id,
                    name: event.value.name || event.value.title,
                    date: event.value.date,
                    adress: event.value.location?.address || event.value.location?.city || 'Online'
                },
                type: ticket.type?.toLowerCase() || 'standard',
                price: ticket.price,
                quantity: qty
            })
        }
    })

    const success = await authStore.buyTickets(ticketsToPurchase)

    if (success) {
        isSuccess.value = true
        successMessage.value = `Successfully purchased ${purchasedCount} ticket${purchasedCount !== 1 ? 's' : ''}!`

        setTimeout(() => {
            router.push('/profile')
        }, 2000)
    }
}
</script>

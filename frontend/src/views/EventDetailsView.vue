<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="eventsStore.isLoading && !event" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p class="mt-4 text-gray-400 text-lg">Loading event details...</p>
        </div>

        <div v-else-if="event" class="max-w-6xl mx-auto">
            <button @click="router.back()"
                class="mb-6 flex items-center text-gray-400 hover:text-white transition-colors">
                <span class="mr-2">←</span> Back to Events
            </button>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-8">
                    <div class="h-64 md:h-96 w-full bg-gray-800 rounded-xl overflow-hidden relative shadow-2xl">
                        <img v-if="event.imageUrl" :src="event.imageUrl" :alt="event.title"
                            class="w-full h-full object-cover">
                        <div v-else class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                            <span class="text-6xl">🎉</span>
                        </div>
                    </div>

                    <div class="bg-card rounded-xl p-8 border border-border">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h1 class="text-3xl md:text-4xl font-bold text-white">{{ event.title }}</h1>
                            <span
                                class="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/20 text-primary font-bold">
                                ${{ minPrice || 'Free' }}
                            </span>
                        </div>

                        <div class="space-y-4 text-gray-300">
                            <div class="flex items-center gap-3">
                                <span class="text-xl">📅</span>
                                <span class="text-lg">{{ event.date ? new Date(event.date).toLocaleDateString() : 'DateTBA' }}</span>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xl">📍</span>
                                <span class="text-lg">
                                    {{ event.location.name }}, {{ event.location.address }}, {{ event.location.city }}
                                </span>
                            </div>
                        </div>

                        <div class="mt-8">
                            <h2 class="text-2xl font-bold text-white mb-4">About this Event</h2>
                            <p class="text-gray-300 leading-relaxed whitespace-pre-wrap">{{ event.description }}</p>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div class="bg-card rounded-xl p-6 border border-border sticky top-8 shadow-xl">
                        <h2 class="text-xl font-bold text-white mb-6">Get Tickets</h2>

                        <form @submit.prevent="handlePurchase" class="space-y-6">
                            <div v-if="availableTickets.length > 0">
                                <label class="block text-sm font-medium text-gray-400 mb-2">Select Tickets</label>
                                <div class="space-y-3">
                                    <div v-for="(ticket, index) in availableTickets" :key="index"
                                        class="p-3 rounded-lg border bg-gray-700/50 border-gray-600">
                                        <div class="flex justify-between items-center mb-2">
                                            <div>
                                                <span class="text-white font-medium">{{ ticket.type || 'Standard Ticket'
                                                }}</span>
                                                <span class="text-white font-bold ml-3">${{ ticket.price || 0 }}</span>
                                            </div>
                                        </div>
                                        <div
                                            class="flex items-center rounded-md border border-gray-600 bg-gray-800/50 overflow-hidden">
                                            <button type="button" @click="decrementTicket(ticket.originalIndex)"
                                                class="px-3 py-1 hover:bg-gray-600 text-white transition-colors text-sm">-</button>
                                            <input v-model.number="ticketQuantities[ticket.originalIndex]" type="number"
                                                min="0" :max="ticket.displayAvailable"
                                                class="w-full bg-transparent text-center text-white focus:outline-none py-1 text-sm"
                                                @input="validateQuantity(ticket.originalIndex, ticket.displayAvailable)" />
                                            <button type="button"
                                                @click="incrementTicket(ticket.originalIndex, ticket.displayAvailable)"
                                                class="px-3 py-1 hover:bg-gray-600 text-white transition-colors text-sm">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else
                                class="p-4 bg-red-900/20 border border-red-800 text-red-400 rounded-md text-sm text-center">
                                <p class="font-semibold">All tickets sold out!</p>
                                <p class="text-xs mt-1">This event is no longer available for purchase.</p>
                            </div>

                            <div class="border-t border-gray-700 pt-4 mt-6">
                                <div class="space-y-2 mb-4">
                                    <div v-for="(ticket, index) in availableTickets" :key="index">
                                        <div v-if="ticketQuantities[ticket.originalIndex] > 0"
                                            class="flex justify-between text-sm text-gray-300">
                                            <span>{{ ticket.type }} × {{ ticketQuantities[ticket.originalIndex]
                                                }}</span>
                                            <span>${{ (ticket.price * ticketQuantities[ticket.originalIndex]).toFixed(2)
                                                }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="flex justify-between items-center text-lg font-bold text-white mb-6 border-t border-gray-700 pt-2">
                                    <span>Total</span>
                                    <span>${{ total }}</span>
                                </div>

                                <div v-if="successMessage"
                                    class="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-md text-green-400 text-sm text-center">
                                    {{ successMessage }}
                                </div>

                                <div v-if="authStore.error"
                                    class="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm text-center">
                                    {{ authStore.error }}
                                </div>

                                <button type="submit"
                                    :disabled="authStore.isLoading || isSuccess || totalQuantity === 0"
                                    class="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-md shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                                    <span v-if="authStore.isLoading">Processing...</span>
                                    <span v-else-if="isSuccess">Purchased! 🎟️</span>
                                    <span v-else>Confirm Purchase ({{ totalQuantity }} ticket{{ totalQuantity !== 1 ?
                                        's' : '' }})</span>
                                </button>
                            </div>
                        </form>

                        <p class="mt-4 text-xs text-center text-gray-500">
                            Secure payment processing. By clicking "Confirm Purchase" you agree to our Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-20 text-gray-400">
            <p class="text-xl mb-4">Event not found.</p>
            <button @click="router.push('/')" class="text-primary hover:underline">Return Home</button>
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
                    name: event.value.name,
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

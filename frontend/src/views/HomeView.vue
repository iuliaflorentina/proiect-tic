<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'
import OrganizerDashboard from '../components/OrganizerDashboard.vue'

const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()

const events = computed(() => eventsStore.events)
const isLoading = computed(() => eventsStore.isLoading)
const getMinPrice = (event) => {
  if (!event.tickets || event.tickets.length === 0) return event.price || 0
  return Math.min(...event.tickets.map(ticket => ticket.price))
}

onMounted(() => {
  eventsStore.fetchEvents()
})

const showLoginPrompt = ref(false)
const selectedEventName = ref('')

const handleBuyTicket = (event) => {
  if (!authStore.isAuthenticated) {
    selectedEventName.value = event.name
    showLoginPrompt.value = true
  } else {
    router.push(`/event/${event.id}`)
  }
}

const confirmLogin = () => {
  showLoginPrompt.value = false
  router.push('/login')
}
</script>

<template>
  <div v-if="authStore.user?.role === 'organizer'">
    <OrganizerDashboard />
  </div>
  <div v-else class="flex flex-col">
    <section class="relative w-full py-20 md:py-32 lg:py-40 bg-background overflow-hidden">
      <div class="absolute inset-0 z-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-700/20 rounded-full blur-[128px]"></div>
      </div>

      <div class="container relative z-10 px-4 md:px-6 mx-auto">
        <div class="flex flex-col items-center space-y-8 text-center">
          <div
            class="inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-sm font-medium backdrop-blur-md">
            <span class="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            The Future of Event Management
          </div>

          <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Elevate Your <span
              class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Events</span>
            <br class="hidden md:block" />
            to the Next Level
          </h1>

          <p class="mx-auto max-w-[800px] text-muted-foreground md:text-xl leading-relaxed">
            Create, manage, and scale your events with EventHub. The all-in-one platform designed for organizers who
            demand excellence and attendees who expect seamless experiences.
          </p>

          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button @click="authStore.isAuthenticated ? null : router.push('/login')"
              class="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              {{ authStore.isAuthenticated ? 'Scroll Down for Events' : 'Get Started Now' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div class="container px-4 md:px-6 mx-auto">
        <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Upcoming Events</h2>

        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-400">Loading events...</p>
        </div>

        <div v-else-if="events.length === 0" class="text-center py-12">
          <p class="text-xl text-gray-400">No upcoming events found.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="event in events" :key="event.id"
            class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div class="h-48 w-full bg-gray-800 relative">
              <img v-if="event.imageUrl" :src="event.imageUrl" :alt="event.title" class="w-full h-full object-cover">
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
                <span class="text-4xl">🎉</span>
              </div>
              <div
                class="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-border">
                {{ event.date ? new Date(event.date).toLocaleDateString() : 'TBA' }}
              </div>
            </div>
            <div class="p-6 flex flex-col items-start space-y-4">
              <h3 class="text-2xl font-semibold leading-tight tracking-tight text-white">{{ event.title }}</h3>
              <p class="text-sm text-muted-foreground line-clamp-2">{{ event.description }}</p>
              <div class="flex items-center text-sm text-gray-400 w-full justify-between">
                <span>{{ event.location.name + "," + event.location.address + ", " + event.location.city || 'Online'
                }}</span>
                <span class="font-bold text-white">${{ getMinPrice(event) || 'Free' }}</span>
              </div>
              <button @click="handleBuyTicket(event)"
                class="w-full mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Buy Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="showLoginPrompt"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        class="bg-card w-full max-w-md rounded-2xl border border-border p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <h3 class="text-2xl font-bold">Login Required</h3>

          <p class="text-muted-foreground">
            To purchase tickets for <span class="text-white font-semibold">"{{ selectedEventName }}"</span>, you need to
            be signed in to your account.
          </p>

          <div class="flex flex-col w-full space-y-3 pt-4">
            <button @click="confirmLogin"
              class="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-all">
              Log In Now
            </button>
            <button @click="showLoginPrompt = false"
              class="w-full py-3 text-muted-foreground hover:text-white transition-colors">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

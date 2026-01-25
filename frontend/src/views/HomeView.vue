<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useEventsStore } from '../stores/events'
import OrganizerDashboard from '../components/OrganizerDashboard.vue'

const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()

const events = computed(() => {
  const allEvents = eventsStore.events
  const query = eventsStore.searchQuery
  
  if (!query.trim()) {
    return allEvents
  }
  
  return allEvents.filter(event =>
    event.name.toLowerCase().includes(query.toLowerCase())
  )
})
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

const handleHeroAction = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    const element = document.getElementById('upcoming-events')
    element?.scrollIntoView({ behavior: 'smooth' })
  }
}

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
</script>

<template>
  <div v-if="authStore.user?.role === 'organizer'">
    <OrganizerDashboard />
  </div>
  <div v-else class="flex flex-col">
    <section class="relative w-full py-20 md:py-32 lg:py-40 bg-background overflow-hidden">
      <div class="absolute inset-0 z-0 ">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple/30 rounded-full blur-[120px]">
        </div>
      </div>

      <div class="relative z-10 w-full flex flex-col items-center px-4 md:px-6">
        <div class="flex flex-col items-center space-y-8 text-center pt-10">
          <div
            class="inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-sm font-medium backdrop-blur-md animate-in slide-in-from-top duration-500">
            <span class="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            The Future of Event Management
          </div>

          <h1
            class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl animate-in fade-in duration-700">
            Elevate Your <span
              class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Events</span>
            <br class="hidden md:block" />
            to the Next Level
          </h1>

          <p
            class="mx-auto max-w-[800px] text-muted-foreground md:text-xl leading-relaxed animate-in fade-in duration-1000">
            Create, manage, and scale your events with EventHub. The all-in-one platform designed for organizers who
            demand excellence and attendees who expect seamless experiences.
          </p>

          <div
            class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-in slide-in-from-bottom duration-700">
            <button @click="handleHeroAction"
              class="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-xl bg-primary px-10 text-base font-bold text-primary-foreground shadow-xl transition-all hover:scale-105 hover:shadow-primary/25 cursor-pointer">
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer">
              </div>
              <span class="relative group-hover:text-neon transition-colors duration-300">
                {{ authStore.isAuthenticated ? 'Scroll Down for Events' : 'Get Started Now' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="upcoming-events" class="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div class="">
        <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-left px-10">Upcoming Events
        </h2>

        <div v-if="isLoading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p class="mt-4 text-gray-400">Loading events...</p>
        </div>

        <div v-else-if="events.length === 0" class="text-center py-12">
          <p class="text-xl text-gray-400">
            {{ eventsStore.searchQuery ? 'No events match your search.' : 'No upcoming events found.' }}
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 p-10">
          <div v-for="(event, index) in events" :key="event.id"
            class="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div class="aspect-video relative overflow-hidden flex items-center justify-center"
              :class="getCardGradient(index)">

              <div class="absolute inset-0 opacity-20">
                <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <pattern :id="'grid-' + index" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" :fill="'url(#grid-' + index + ')'" />
                </svg>
              </div>

              <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/50 blur-xl"></div>
              <div class="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/50 blur-lg"></div>

              <div class="absolute inset-0 overflow-hidden opacity-30">
                <div
                  class="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent">
                </div>
                <div
                  class="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent">
                </div>
              </div>

              <div class="relative z-10 text-center px-6">
                <span class="block text-xs font-medium tracking-widest uppercase opacity-80 mb-2">
                  {{ event.location.city || 'Online' }}
                </span>
                <h3 class="text-2xl font-bold tracking-tight leading-tight text-white drop-shadow-lg">
                  {{ event.name }}
                </h3>
              </div>

              <div
                class="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-border text-white">
                {{ event.date ? new Date(event.date).toLocaleDateString() : 'TBA' }}
              </div>
            </div>
            <div class="p-6 flex flex-col items-start space-y-4">
              <p class="text-sm text-muted-foreground line-clamp-2">{{ event.description }}</p>
              <div class="flex items-center text-sm text-purple-light w-full justify-between">
                <span>{{ event.location.name + "," + event.location.address + ", " + event.location.city || 'Online'
                }}</span>
                <span class="font-bold text-blue bg-blue-light px-2 py-1 rounded-full">${{ getMinPrice(event) || 'Free'
                }}</span>
              </div>
              <button @click="handleBuyTicket(event)"
                class="w-full mt-4 inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:text-purple transition-all hover:scale-105 ">
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
              class="w-full py-3 bg-primary cursor-pointer text-primary-foreground rounded-lg font-bold hover:text-neon hover:scale-110 transition-all duration-300">
              Log In Now
            </button>
            <button @click="showLoginPrompt = false"
              class="w-full py-3 cursor-pointer hover:text-neon transition-colors hover:scale-110 transition-all duration-300">
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

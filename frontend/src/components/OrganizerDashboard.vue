<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import { useAuthStore } from '../stores/auth'

const router = useRouter()

const eventsStore = useEventsStore()
const authStore = useAuthStore()

const myEvents = computed(() => {
  return eventsStore.events.filter(event => event.organizationName === authStore.user?.organizationName)
})

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentEventId = ref(null)

const emptyEvent = {
  name: '',
  description: '',
  date: '',
  isPublic: true,
  organizationName: authStore.user?.organizationName || '',
  location: {
    name: '',
    address: '',
    city: '',
    capacity: 100
  },
  tickets: [
    { type: 'standard', price: 10, availableQuantity: 100 },
    { type: 'vip', price: 50, availableQuantity: 20 }
  ]
}

const form = ref({ ...emptyEvent })

const openAddModal = () => {
  isEditing.value = false
  currentEventId.value = null
  form.value = JSON.parse(JSON.stringify(emptyEvent))
  form.value.organizationName = authStore.user?.organizationName // Ensure organization name is set
  isModalOpen.value = true
}

const openEditModal = (event) => {
  isEditing.value = true
  currentEventId.value = event.id
  form.value = JSON.parse(JSON.stringify(event))
  // Ensure date is in the right format for input type="datetime-local"
  if (form.value.date) {
    form.value.date = new Date(form.value.date).toISOString().slice(0, 16)
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  let result;
  if (isEditing.value) {
    result = await eventsStore.updateEvent(currentEventId.value, form.value)
  } else {
    result = await eventsStore.addEvent(form.value)
  }

  if (result) {
    closeModal()
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this event?')) {
    await eventsStore.deleteEvent(id)
  }
}

onMounted(() => {
  eventsStore.fetchEvents()
})
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white">Organizer Dashboard</h1>
        <p class="text-muted-foreground">Manage events for {{ authStore.user?.organizationName }}</p>
      </div>
      <button @click="openAddModal"
        class="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add New Event
      </button>
    </div>

    <div v-if="eventsStore.isLoading && !myEvents.length" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      <p class="mt-4 text-gray-400">Loading your events...</p>
    </div>

    <div v-else-if="myEvents.length === 0" class="bg-card border border-border rounded-xl p-12 text-center">
      <div class="text-4xl mb-4">📅</div>
      <h3 class="text-xl font-semibold mb-2">No events found</h3>
      <p class="text-muted-foreground mb-6">You haven't created any events yet. Click the button above to get started.
      </p>
      <button @click="openAddModal" class="text-primary hover:underline font-medium">Create your first event</button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="event in myEvents" :key="event.id"
        class="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors flex flex-col">
        <div class="p-6 flex-grow">
          <div class="flex justify-between items-start mb-4">
            <span :class="event.isPublic ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'"
              class="px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider">
              {{ event.isPublic ? 'Public' : 'Private' }}
            </span>
            <span class="text-xs text-muted-foreground">
              {{ new Date(event.date).toLocaleDateString() }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">{{ event.name }}</h3>
          <p class="text-sm text-muted-foreground line-clamp-3 mb-4">{{ event.description }}</p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center text-xs text-gray-400">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ event.location.name }}, {{ event.location.city }}
            </div>
            <div class="flex items-center text-xs text-gray-400">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z">
                </path>
              </svg>
              {{event.tickets.reduce((acc, t) => acc + t.availableQuantity, 0)}} tickets available
            </div>
          </div>
        </div>

        <div class="px-4 pb-4 flex flex-col gap-2">
          <div class="flex gap-2">
            <button @click="openEditModal(event)"
              class="flex-1 py-2 text-sm font-medium border border-border rounded-md hover:bg-white/5 transition-colors">
              Edit
            </button>
            <button @click="handleDelete(event.id)"
              class="flex-1 py-2 text-sm font-medium text-red-400 border border-red-400/20 rounded-md hover:bg-red-400/10 transition-colors">
              Delete
            </button>
          </div>
          <button @click="$router.push(`/organizer/buyers/${event.id}`)"
            class="w-full py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            View Buyers Evidence
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        class="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-border flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h2>
          <button @click="closeModal" class="text-muted-foreground hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="p-6 overflow-y-auto">
          <div v-if="eventsStore.error"
            class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            {{ eventsStore.error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-400">Event Name</label>
                <input v-model="form.name" type="text" required
                  class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-400">Date & Time</label>
                <input v-model="form.date" type="datetime-local" required
                  class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none">
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-400">Description</label>
              <textarea v-model="form.description" rows="3" required
                class="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl">
              <div class="md:col-span-2">
                <h4 class="text-sm font-bold uppercase tracking-wider text-primary mb-2">Location Details</h4>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-400">Venue Name</label>
                <input v-model="form.location.name" type="text" required
                  class="w-full bg-background border border-border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-400">City</label>
                <input v-model="form.location.city" type="text" required
                  class="w-full bg-background border border-border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none">
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-sm font-medium text-gray-400">Full Address</label>
                <input v-model="form.location.address" type="text" required
                  class="w-full bg-background border border-border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none">
              </div>
            </div>

            <div class="space-y-4">
              <h4 class="text-sm font-bold uppercase tracking-wider text-primary">Ticket Types</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(ticket, index) in form.tickets" :key="index"
                  class="p-4 border border-border rounded-xl space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-bold uppercase text-white">{{ ticket.type }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label class="text-xs text-gray-400">Price ($)</label>
                      <input v-model.number="ticket.price" type="number" step="0.01" required
                        class="w-full bg-background border border-border rounded-lg px-2 py-1 text-sm outline-none">
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs text-gray-400">Quantity</label>
                      <input v-model.number="ticket.availableQuantity" type="number" required
                        class="w-full bg-background border border-border rounded-lg px-2 py-1 text-sm outline-none">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <input v-model="form.isPublic" type="checkbox" id="isPublic"
                class="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary">
              <label for="isPublic" class="text-sm text-gray-300">Make this event public</label>
            </div>

            <div class="pt-4 border-t border-border flex justify-end gap-3">
              <button type="button" @click="closeModal"
                class="px-6 py-2 rounded-md border border-border hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button type="submit" :disabled="eventsStore.isLoading"
                class="px-8 py-2 bg-primary text-primary-foreground rounded-md font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                {{ eventsStore.isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Event') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

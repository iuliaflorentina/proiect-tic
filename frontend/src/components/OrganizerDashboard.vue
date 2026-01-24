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
  form.value.organizationName = authStore.user?.organizationName
  isModalOpen.value = true
}

const openEditModal = (event) => {
  isEditing.value = true
  currentEventId.value = event.id
  form.value = JSON.parse(JSON.stringify(event))
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
  <div class="relative w-full flex justify-center py-12 min-h-screen bg-background overflow-x-hidden">
    <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
      <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dashboardDotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" class="text-blue-light" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dashboardDotPattern)" />
      </svg>
    </div>

    <div class="fixed -top-32 -right-32 w-80 h-80 bg-purple/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="fixed -bottom-32 -left-32 w-96 h-96 bg-blue/15 rounded-full blur-[140px] pointer-events-none z-0"></div>

    <div class="relative z-10 w-full max-w-7xl px-4 md:px-6">
      <div
        class="bg-card/30 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-3xl overflow-hidden animate-in zoom-in-95 duration-700">

        <div
          class="px-8 pt-10 pb-6 md:px-12 md:pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
              Dashboard
            </h1>
            <p class="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              Managing <span class="text-primary">{{ authStore.user?.organizationName }}</span>
            </p>
          </div>

          <button @click="openAddModal"
            class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-primary px-8 text-xs font-black text-primary-foreground shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer">
            </div>
            <span class="relative flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Event
            </span>
          </button>
        </div>

        <div class="p-8 md:p-12">
          <div v-if="eventsStore.isLoading && !myEvents.length"
            class="flex flex-col items-center justify-center py-20 space-y-4">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p class="text-gray-400 font-black uppercase tracking-widest text-xs">Syncing Global Data...</p>
          </div>

          <div v-else-if="myEvents.length === 0"
            class="bg-black/20 border border-dashed border-border/50 rounded-2xl p-20 text-center animate-in fade-in duration-700">
            <div class="text-6xl mb-6 opacity-30">📅</div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase tracking-tight">No Events On Radar</h3>
            <p class="text-gray-400 mb-8 max-w-md mx-auto font-medium">Your organization hasn't launched any experiences
              yet. Initiate your first event to start scaling.</p>
            <button @click="openAddModal"
              class="text-primary font-black uppercase tracking-widest text-sm hover:text-neon transition-all cursor-pointer">Initialize
              System</button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="event in myEvents" :key="event.id"
              class="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:scale-[1.02] hover:shadow-2xl flex flex-col relative">

              <div class="p-6 flex-grow">
                <div class="flex justify-between items-start mb-6">
                  <span
                    :class="event.isPublic ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'"
                    class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm">
                    {{ event.isPublic ? 'Public' : 'Private' }}
                  </span>
                  <span
                    class="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {{ new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) }}
                  </span>
                </div>

                <h3 class="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-neon transition-colors">
                  {{ event.name }}</h3>
                <p class="text-sm text-gray-400 line-clamp-2 mb-6 font-medium leading-relaxed">{{ event.description }}
                </p>

                <div class="space-y-4">
                  <div
                    class="flex items-center text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                    <div
                      class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 border border-white/5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    {{ event.location.city }}
                  </div>
                  <div
                    class="flex items-center text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                    <div
                      class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mr-3 border border-white/5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z">
                        </path>
                      </svg>
                    </div>
                    {{event.tickets.reduce((acc, t) => acc + t.availableQuantity, 0)}} Allocated Units
                  </div>
                </div>
              </div>

              <div class="p-6 pt-0 flex flex-col gap-3">
                <div class="flex gap-2">
                  <button @click="openEditModal(event)"
                    class="flex-1 py-3 text-xs font-black uppercase tracking-widest border border-border/50 rounded-xl hover:bg-white/10 transition-all cursor-pointer text-white">
                    Modify
                  </button>
                  <button @click="handleDelete(event.id)"
                    class="flex-1 py-3 text-xs font-black uppercase tracking-widest text-red-400 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-all cursor-pointer">
                    Purge
                  </button>
                </div>
                <button @click="$router.push(`/organizer/buyers/${event.id}`)"
                  class="group relative w-full py-4 text-xs font-black uppercase tracking-widest bg-white/5 text-white rounded-xl border border-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-2 cursor-pointer overflow-hidden">
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer">
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Client Evidence
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        class="bg-card w-full max-w-2xl rounded-2xl border border-border shell shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
        <div
          class="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 border-b border-white/10 flex justify-between items-center">
          <h2 class="text-xl font-black text-white uppercase tracking-tight">{{ isEditing ? 'Edit System Entity' :
            'Create New System Entity' }}</h2>
          <button @click="closeModal" class="text-white opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="p-8 overflow-y-auto bg-card/50 backdrop-blur-2xl">
          <div v-if="eventsStore.error"
            class="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold">
            {{ eventsStore.error }}
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="group">
                <label
                  class="block text-[10px] font-black uppercase tracking-[0.2em] text-purple-light mb-2 group-focus-within:text-white transition-colors">Event
                  Name</label>
                <input v-model="form.name" type="text" required
                  class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
              </div>
              <div class="group">
                <label
                  class="block text-[10px] font-black uppercase tracking-[0.2em] text-purple-light mb-2 group-focus-within:text-white transition-colors">Date
                  & Time</label>
                <input v-model="form.date" type="datetime-local" required
                  class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
              </div>
            </div>

            <div class="group">
              <label
                class="block text-[10px] font-black uppercase tracking-[0.2em] text-purple-light mb-2 group-focus-within:text-white transition-colors">Description</label>
              <textarea v-model="form.description" rows="3" required
                class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"></textarea>
            </div>

            <div class="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Deployment Coordinates</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="group">
                  <label class="block text-[10px] font-bold text-gray-500 mb-2">Venue Name</label>
                  <input v-model="form.location.name" type="text" required
                    class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-2.5 text-white font-bold focus:border-primary outline-none transition-all">
                </div>
                <div class="group">
                  <label class="block text-[10px] font-bold text-gray-500 mb-2">City</label>
                  <input v-model="form.location.city" type="text" required
                    class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-2.5 text-white font-bold focus:border-primary outline-none transition-all">
                </div>
                <div class="md:col-span-2 group">
                  <label class="block text-[10px] font-bold text-gray-500 mb-2">Full Address</label>
                  <input v-model="form.location.address" type="text" required
                    class="w-full bg-black/40 border border-border/50 rounded-xl px-4 py-2.5 text-white font-bold focus:border-primary outline-none transition-all">
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Unit Configuration</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(ticket, index) in form.tickets" :key="index"
                  class="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4">
                  <div class="flex justify-between items-center border-b border-white/5 pb-2">
                    <span class="text-xs font-black uppercase tracking-widest text-white">{{ ticket.type }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold text-gray-500 uppercase">Price ($)</label>
                      <input v-model.number="ticket.price" type="number" step="0.01" required
                        class="w-full bg-black/40 border border-border/50 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-primary transition-all">
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-bold text-gray-500 uppercase">Quantity</label>
                      <input v-model.number="ticket.availableQuantity" type="number" required
                        class="w-full bg-black/40 border border-border/50 rounded-lg px-3 py-2 text-white font-bold outline-none focus:border-primary transition-all">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <input v-model="form.isPublic" type="checkbox" id="isPublic"
                class="w-5 h-5 rounded border-border/50 bg-black/40 text-primary focus:ring-primary cursor-pointer">
              <label for="isPublic"
                class="text-sm font-bold text-gray-400 cursor-pointer uppercase tracking-tighter">Broadcast to Public
                Directory</label>
            </div>

            <div class="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-end gap-4">
              <button type="button" @click="closeModal"
                class="px-8 py-3 rounded-xl border border-border/50 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all cursor-pointer">
                Abort
              </button>
              <button type="submit" :disabled="eventsStore.isLoading"
                class="group relative px-10 py-3 bg-primary text-primary-foreground overflow-hidden rounded-xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer">
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer">
                </div>
                <span class="relative">
                  {{ eventsStore.isLoading ? 'Processing...' : (isEditing ? 'Sync Changes' : 'Initialize Event') }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

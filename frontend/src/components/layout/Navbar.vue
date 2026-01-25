<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useEventsStore } from '../../stores/events'
import { ref, computed } from 'vue'

const authStore = useAuthStore()
const eventsStore = useEventsStore()
const router = useRouter()
const searchQuery = ref('')

const filteredEvents = computed(() => {
  if (!searchQuery.value.trim()) {
    return eventsStore.events
  }
  return eventsStore.events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Emit the search query to parent
const handleSearch = () => {
  eventsStore.setSearchQuery(searchQuery.value)
}

const handleClearSearch = () => {
  searchQuery.value = ''
  eventsStore.setSearchQuery('')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="px-4 sm:px-6 md:px-8 flex justify-between items-center h-14 gap-3 sm:gap-4">
      <div class="flex items-center gap-2 sm:gap-4 min-w-0">
        <RouterLink to="/" class="items-center flex-shrink-0">
          <span
            class="text-lg sm:text-xl font-bold cursor-pointer tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            EventHub
          </span>
        </RouterLink>

        <!-- Search Bar -->
        <div class="relative flex items-center flex-1 sm:flex-none sm:w-48 md:w-64 lg:w-80 min-w-0">
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="Search..."
            class="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs sm:text-sm truncate"
          />
          <button
            v-if="searchQuery"
            @click="handleClearSearch"
            class="absolute right-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="flex items-center gap-1 sm:gap-3 flex-shrink-0">
        <div v-if="!authStore.isAuthenticated" class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <RouterLink to="/login"
            class="font-medium text-muted-foreground cursor-pointer transition-colors hover:text-primary px-2 sm:px-3 py-1 whitespace-nowrap">
            Log in
          </RouterLink>
          <RouterLink to="/signup"
            class="h-8 sm:h-9 items-center justify-center rounded-md cursor-pointer bg-primary px-2 sm:px-4 py-1 sm:py-2 font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap">
            Sign up
          </RouterLink>
        </div>

        <div v-else class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
          <RouterLink to="/profile"
            class="font-medium text-muted-foreground cursor-pointer transition-colors hover:text-primary px-2 sm:px-3 py-1 whitespace-nowrap">
            Profile
          </RouterLink>
          <button @click="handleLogout"
            class="font-medium px-2 sm:px-3 py-1 text-muted-foreground cursor-pointer transition-colors hover:text-primary whitespace-nowrap">
            Log out
          </button>
        </div>
      </div>

    </div>
  </header>
</template>

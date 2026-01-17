<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="px-8 flex justify-between h-14 items-center">
      <RouterLink to="/" class="mr-6 items-center">
        <span
          class="text-xl font-bold cursor-pointer tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          EventHub
        </span>
      </RouterLink>

      <div>
        <div v-if="!authStore.isAuthenticated" class="ml-auto items-center px-4">
          <RouterLink to="/login"
            class="text-sm font-medium text-muted-foreground cursor-pointer transition-colors hover:text-primary">
            Log in
          </RouterLink>
          <RouterLink to="/signup"
            class="h-9 items-center justify-center rounded-md cursor-pointer bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
            Sign up
          </RouterLink>
        </div>

        <div v-else class="ml-auto items-center px-4">
          <RouterLink to="/profile"
            class="text-sm font-medium text-muted-foreground cursor-pointer transition-colors hover:text-primary">
            Profile
          </RouterLink>
          <button @click="handleLogout"
            class="text-sm font-medium px-4 text-muted-foreground cursor-pointer transition-colors hover:text-primary">
            Log out
          </button>
        </div>
      </div>

    </div>
  </header>
</template>

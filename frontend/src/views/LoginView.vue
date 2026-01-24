<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleSubmit = async () => {
  const success = await authStore.login(email.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div
    class="relative flex items-center justify-center py-12 px-4 overflow-hidden min-h-[calc(100vh-4rem)] bg-background">
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <svg class="h-screen w-screen" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" class="text-blue-light" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>
    </div>

    <div class="absolute -top-24 -left-24 w-64 h-64 bg-purple/30 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute -bottom-24 -right-24 w-80 h-80 bg-blue/20 rounded-full blur-[120px] pointer-events-none"></div>

    <div
      class="relative z-10 w-full max-w-md p-8 bg-card/40 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl animate-in zoom-in-95 duration-500">
      <div class="text-center">
        <h2 class="mt-6 text-4xl font-extrabold tracking-tight text-white text-neon">
          Welcome back
        </h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Sign in to access your account
        </p>
      </div>

      <form class="py-5 flex flex-col gap-4" @submit.prevent="handleSubmit">
        <div v-if="authStore.error"
          class="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-2">
          {{ authStore.error }}
        </div>

        <div class="py-2">
          <div class="group">
            <label for="email"
              class="block text-sm font-medium text-purple-light group-focus-within:text-white transition-colors">Email
              address</label>
            <div class="mt-1 py-2">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
                class="block w-full rounded-lg border border-border/50 bg-white/5 px-4 py-3 text-white shadow-sm placeholder-muted-foreground focus:border-blue-light focus:outline-none focus:ring-2 focus:ring-blue-light/20 sm:text-sm transition-all"
                placeholder="you@example.com">
            </div>
          </div>

          <div class="group">
            <label for="password"
              class="block text-sm font-medium text-purple-light group-focus-within:text-white transition-colors">Password</label>
            <div class="mt-1 py-2">
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
                required
                class="block w-full rounded-lg border border-border/50 bg-white/5 px-4 py-3 text-white shadow-sm placeholder-muted-foreground focus:border-blue-light focus:outline-none focus:ring-2 focus:ring-blue-light/20 sm:text-sm transition-all"
                placeholder="••••••••">
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="authStore.isLoading"
            class="group relative flex w-full cursor-pointer justify-center overflow-hidden rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer">
            </div>
            <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span class="relative group-hover:text-neon transition-colors duration-300">
              {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
            </span>
          </button>
        </div>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <RouterLink to="/signup"
            class="ml-1 font-bold text-white hover:text-neon transition-all hover:scale-110 inline-block">Sign up
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

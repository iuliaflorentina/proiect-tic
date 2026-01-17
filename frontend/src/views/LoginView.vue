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
  <div class="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 p-8 bg-card rounded-xl border border-border shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Sign in to access your account
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="authStore.error" class="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {{ authStore.error }}
        </div>

        <div class="py-5">
          <div>
            <label for="email" class="block text-sm font-medium text-foreground py-2">Email address</label>
            <div class="mt-1">
              <input id="email" v-model="email" name="email" type="email" autocomplete="email" required 
                class="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" 
                placeholder="you@example.com">
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-foreground py-2">Password</label>
            </div>
            <div class="mt-1">
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password" required 
                class="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" 
                placeholder="••••••••">
            </div>
          </div>
        </div>

        <div class="w-full flex justify-center">
          <button type="submit" :disabled="authStore.isLoading"
            class="flex w-60 justify-center cursor-pointer rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
        
        <div class="text-center text-sm">
          <span class="text-muted-foreground">Don't have an account?</span>
          <RouterLink to="/signup" class="ml-1 font-medium text-primary hover:text-primary/90">Sign up</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

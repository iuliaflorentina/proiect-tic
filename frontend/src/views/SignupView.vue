<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  role: 'client',
  organizationName: ''
})

const isOrganizer = computed(() => formData.value.role === 'organizer')

const handleSubmit = async () => {
  
  const payload = {
    name: formData.value.name,
    email: formData.value.email,
    password: formData.value.password,
    role: formData.value.role,
    ...(isOrganizer.value && { organizationName: formData.value.organizationName })
  }

  const success = await authStore.signup(payload)

  if (success) {
    console.log('Registration successful')
    router.push('/login')
  }
}
</script>


<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8 p-8 bg-card rounded-xl border border-border shadow-lg">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-foreground">
          Create an account
        </h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Join EventHub to start your journey
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div v-if="authStore.error" class="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {{ authStore.error }}
        </div>

        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-foreground">Full Name</label>
            <div class="mt-1">
              <input id="name" v-model="formData.name" name="name" type="text" autocomplete="name" required 
                class="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="John Doe">
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-foreground">Email address</label>
            <div class="mt-1">
              <input id="email" v-model="formData.email" name="email" type="email" autocomplete="email" required 
                class="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" 
                placeholder="you@example.com">
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-foreground">Password</label>
            <div class="mt-1">
              <input id="password" v-model="formData.password" name="password" type="password" autocomplete="new-password" required minlength="6"
                class="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm" 
                placeholder="••••••••">
            </div>
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-foreground">Role</label>
            <div class="mt-1">
              <select id="role" v-model="formData.role" name="role" required
                class="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
                <option value="client">Client</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>
          </div>

          <div v-if="isOrganizer">
            <label for="organizationName" class="block text-sm font-medium text-foreground">Organization Name</label>
            <div class="mt-1">
              <input id="organizationName" v-model="formData.organizationName" name="organizationName" type="text" required 
                class="block w-full rounded-md border border-input bg-transparent px-3 py-2 text-foreground shadow-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="My Awesome Events Co.">
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="authStore.isLoading"
            class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="authStore.isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ authStore.isLoading ? 'Creating account...' : 'Sign up' }}
          </button>
        </div>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Already have an account?</span>
          <RouterLink to="/login" class="ml-1 font-medium text-primary hover:text-primary/90">Sign in</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>


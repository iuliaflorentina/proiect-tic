<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleBuyTicket = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  } else {
    alert('Proceed to payment...')
    // Logic for authenticated user buying ticket
  }
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Hero Section -->
    <section class="relative w-full py-20 md:py-32 lg:py-40 bg-background overflow-hidden">
        <!-- Abstract Background -->
        <div class="absolute inset-0 z-0">
          <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"></div>
          <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-700/20 rounded-full blur-[128px]"></div>
        </div>

        <div class="container relative z-10 px-4 md:px-6 mx-auto">
          <div class="flex flex-col items-center space-y-8 text-center">
            <div class="inline-flex items-center rounded-full border border-border bg-card/50 px-3 py-1 text-sm font-medium backdrop-blur-md">
              <span class="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              The Future of Event Management
            </div>
            
            <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Elevate Your <span class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Events</span>
              <br class="hidden md:block"/>
              to the Next Level
            </h1>
            
            <p class="mx-auto max-w-[800px] text-muted-foreground md:text-xl leading-relaxed">
              Create, manage, and scale your events with EventHub. The all-in-one platform designed for organizers who demand excellence and attendees who expect seamless experiences.
            </p>
            
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button @click="handleBuyTicket" class="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Buy Tickets Now
              </button>
              <button class="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Learn more
              </button>
            </div>
          </div>
        </div>
    </section>

    <!-- Popular Events Section (New) -->
    <section class="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div class="container px-4 md:px-6 mx-auto">
        <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-center">Upcoming Events</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div class="p-6 flex flex-col items-start space-y-4">
               <div class="h-40 w-full bg-muted rounded-md mb-4"></div>
               <h3 class="text-2xl font-semibold leading-none tracking-tight">Tech Conference {{ 2024 + i }}</h3>
               <p class="text-sm text-muted-foreground">Join the biggest tech conference of the year.</p>
               <button @click="handleBuyTicket" class="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                 Buy Ticket
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Features Section -->
    <section class="w-full py-20 md:py-32 bg-card/30">
      <div class="container px-4 md:px-6 mx-auto">
        <div class="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need</h2>
          <p class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
             Powerful features to help you manage your events from start to finish.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <!-- Feature 1 -->
          <div class="flex flex-col items-center space-y-4 p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div class="p-3 bg-primary/10 rounded-full text-primary">
               <!-- Icon placeholder -->
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
            </div>
            <h3 class="text-xl font-bold">Seamless Scheduling</h3>
            <p class="text-center text-muted-foreground">
              Effortlessly plan and organize your event agenda with our intuitive drag-and-drop scheduler.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="flex flex-col items-center space-y-4 p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
             <div class="p-3 bg-primary/10 rounded-full text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 class="text-xl font-bold">Attendee Management</h3>
            <p class="text-center text-muted-foreground">
              Keep track of registrations, check-ins, and attendee data in one centralized dashboard.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="flex flex-col items-center space-y-4 p-6 bg-background rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
             <div class="p-3 bg-primary/10 rounded-full text-primary">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            </div>
            <h3 class="text-xl font-bold">Real-time Analytics</h3>
            <p class="text-center text-muted-foreground">
              Gain valuable insights with live data tracking, ticket sales analysis, and engagement metrics.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

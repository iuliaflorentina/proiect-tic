<template>
  <div class="min-h-screen bg-[#0f172a] text-white p-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Buyers Evidence
          </h1>
          <p class="text-slate-400 mt-2">View all attendees for this event</p>
        </div>
        <button 
          @click="$router.back()"
          class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="buyers.length === 0" class="bg-slate-800/50 rounded-2xl p-12 text-center border border-slate-700">
        <div class="bg-slate-700/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">No buyers found</h3>
        <p class="text-slate-400">No one has purchased tickets for this event yet.</p>
      </div>

      <div v-else class="overflow-x-auto bg-slate-800/50 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-slate-700 bg-slate-800/80">
              <th class="px-6 py-4 font-semibold text-slate-300">Name</th>
              <th class="px-6 py-4 font-semibold text-slate-300">Email</th>
              <th class="px-6 py-4 font-semibold text-slate-300">Ticket Type</th>
              <th class="px-6 py-4 font-semibold text-slate-300">Quantity</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <template v-for="buyer in buyers" :key="buyer.id">
              <tr v-for="(ticket, index) in buyer.tickets" :key="buyer.id + '-' + index" class="hover:bg-slate-700/30 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-medium text-slate-100">{{ buyer.name }}</div>
                </td>
                <td class="px-6 py-4 text-slate-400">{{ buyer.email }}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                    {{ ticket.type }}
                  </span>
                </td>
                <td class="px-6 py-4 font-semibold text-slate-200">{{ ticket.quantity }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const buyers = ref([])
const isLoading = ref(true)

onMounted(async () => {
  const eventId = route.params.eventId
  buyers.value = await authStore.fetchBuyersByEvent(eventId)
  isLoading.value = false
})
</script>

<style scoped>
.bg-clip-text {
  -webkit-background-clip: text;
}
</style>

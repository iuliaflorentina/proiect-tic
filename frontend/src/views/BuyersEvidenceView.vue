<template>
  <div class="relative w-full flex justify-center py-12 min-h-screen bg-background overflow-x-hidden">

    <div class="fixed inset-0 z-0 opacity-20 pointer-events-none">
      <svg class="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="buyersDotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" class="text-blue-light" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#buyersDotPattern)" />
      </svg>
    </div>

    <div class="fixed -top-32 -left-32 w-80 h-80 bg-purple/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="fixed -bottom-32 -right-32 w-96 h-96 bg-blue/15 rounded-full blur-[140px] pointer-events-none z-0">
    </div>

    <div class="relative z-10 w-full max-w-7xl px-4 md:px-6">
      <div
        class="bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">

        <div
          class="px-8 pt-10 pb-6 md:px-12 md:pt-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
              Buyers <span class="text-primary">Evidence</span>
            </h1>
          </div>

          <button @click="$router.back()"
            class="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-white/5 px-8 text-xs font-black text-white border border-white/10 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer">
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer">
            </div>
            <span class="relative flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Returns
            </span>
          </button>
        </div>

        <div class="p-8 md:p-12">
          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 space-y-4">
            <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <p class="text-gray-400 font-black uppercase tracking-widest text-xs">Decrypting Attendee List...</p>
          </div>

          <div v-else-if="buyers.length === 0"
            class="bg-black/20 border border-dashed border-border/50 rounded-2xl p-20 text-center animate-in fade-in duration-700">
            <div class="text-6xl mb-6 opacity-30">👥</div>
            <h3 class="text-2xl font-black text-white mb-4 uppercase tracking-tight">Zero Presence Detected</h3>
            <p class="text-gray-400 font-medium">No one has secured their units for this mission yet.</p>
          </div>

          <div v-else class="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-white/10 bg-white/5">
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-light">Identity
                  </th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-light">Email</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-light text-center">
                    Ticket Type</th>
                  <th class="px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-purple-light text-right">
                    Quantity</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <template v-for="buyer in buyers" :key="buyer.id">
                  <tr v-for="(ticket, index) in buyer.tickets" :key="buyer.id + '-' + index"
                    class="group hover:bg-white/5 transition-colors">
                    <td class="px-8 py-6">
                      <div class="font-black text-white text-lg tracking-tight group-hover:text-neon transition-colors">
                        {{ buyer.name }}</div>
                    </td>
                    <td class="px-8 py-6">
                      <div class="text-gray-400 font-bold text-sm tracking-wide">{{ buyer.email }}</div>
                    </td>
                    <td class="px-8 py-6 text-center">
                      <span
                        class="inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 bg-opacity-50">
                        {{ ticket.type }}
                      </span>
                    </td>
                    <td class="px-8 py-6 text-right">
                      <span class="text-xl font-black text-white drop-shadow-sm">{{ ticket.quantity }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
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
.shadow-3xl {
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.5);
}
</style>

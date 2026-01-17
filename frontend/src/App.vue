<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
    <Navbar />
    <main class="flex-1 w-full flex flex-col">
      <RouterView />
    </main>
  </div>
</template>

<style>
</style>

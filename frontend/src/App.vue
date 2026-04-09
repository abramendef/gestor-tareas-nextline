<template>
  <v-app class="sinergia-layout">
    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

<script setup>
import Home from './pages/Home.vue'
</script>

<style>
.sinergia-layout {
  background-color: #000000 !important;
  color: #f5f5f7 !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  min-height: 100vh;
}

.v-overlay__scrim {
  background: rgba(0, 0, 0, 0.4) !important;
  backdrop-filter: blur(8px) !important;
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  border: 3px solid #000;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>

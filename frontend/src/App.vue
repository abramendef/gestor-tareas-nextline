<template>
  <v-app class="app-background">
    <v-main>
      <Home />
    </v-main>
  </v-app>
</template>

<script setup>
import Home from './pages/Home.vue'
</script>

<style>
/* Reset global de margen que ensucian la vista y configuración de fondo limpio */
body {
  margin: 0;
  padding: 0;
}
.app-background {
  background-color: #f4f6f8;
  min-height: 100vh;
}
</style>

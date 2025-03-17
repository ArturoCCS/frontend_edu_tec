<template>
  <v-app :style="{background: $vuetify.theme.themes.light.colors.primary}">
    <NavBar/>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import NavBar from './components/TheNavBar.vue';
  //
</script>

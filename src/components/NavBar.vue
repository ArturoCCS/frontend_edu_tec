<template>
  <v-app-bar
    color="#132f53"
    flat
    class="px-16"
  >
    <v-img
      src="\sin_foto.jpeg"
      cover
      max-height="50"
      max-width="50"
      min-height="50"
      min-width="50"
    />
    <v-spacer />
    <v-tabs
      v-model="tab"
      align-tabs="center"
      color="white"
    >
      <v-tab
        v-for="(link, i) in filteredLinks"
        :key="i"
        :to="link.path"
        :value="i + 1"
        class="text-none"
      >
        {{ link.name }}
      </v-tab>
      <v-tab v-if="token" href="/" class="text-none ml-16 mr-4" @click="authStore.logout()">
      Cerrar sesión
    </v-tab>
    <v-tab v-else href="/login" class="text-none ml-16 mr-4">
      Iniciar sesión
    </v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const authStore = useAuthStore();
const { token } = storeToRefs(authStore);

const links = [
  { name: "Inicio", path: "/" },
  { name: "Protected Route", path: "/protected_route", requiresAuth: true },
];

const filteredLinks = computed(() => {
  return links.filter(link => !link.requiresAuth || (link.requiresAuth && token.value));
});

const title = import.meta.env.VITE_APP_TITLE;
</script>
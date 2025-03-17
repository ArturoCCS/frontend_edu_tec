<template>
  <v-navigation-drawer
    absolute
    color="white"
    width="80"
    app
    permanent
    class="fixed-navbar"
  >
    <div>
      <v-list dense class="text-center">
        <v-list-item>
          <v-img src="/sin_foto.jpeg" width="40" height="40" class="mx-auto"></v-img>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item 
          v-for="(item, i) in filteredNavItems" 
          :key="i" 
          link 
          class="py-3"
          :to="item.logout ? null : item.path"  
          @click="handleClick(item)"
        >
          <v-tooltip location="right">
            <template v-slot:activator="{ props }">
              <v-badge 
                v-if="item.notifications > 0"
                :content="formattedNotifications(item.notifications)"
                color="red"
                offset-y="10"
                offset-x="10"
              >
                <v-icon v-bind="props" :icon="item.icon" size="23"></v-icon>
              </v-badge>
              <v-icon v-else v-bind="props" :icon="item.icon" size="23"></v-icon>
            </template>
            {{ item.name }}
          </v-tooltip>
        </v-list-item>
      </v-list>

      <v-spacer class="px-6 py-3"></v-spacer>

      <v-list-item link class="px-7 py-3">
        <v-icon icon="fa-solid fa-gear" size="23"></v-icon>
      </v-list-item>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js';
import { storeToRefs } from 'pinia';
import { computed, ref } from "vue";
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const { token } = storeToRefs(authStore);
const router = useRouter();

const navItems = ref([
  { icon: "fa-solid fa-house", notifications: 0, name: "Inicio", path: "/" }, 
  { icon: "fa-solid fa-right-to-bracket", notifications: 0, name: "Login", path: "/login", requiresGuest: true }, 
  { icon: "fa-solid fa-user", notifications: 0, name: "Protected Route", path: "/protected-route", requiresAuth: true },
  { icon: "fa-solid fa-sign-out-alt", notifications: 0, name: "Cerrar sesión", path: "/", requiresAuth: true, logout: true },
]);

const filteredNavItems = computed(() => {
  return navItems.value.filter(item => {
    if (item.requiresAuth) return token.value; 
    if (item.requiresGuest) return !token.value; 
    return true;
  });
});

const formattedNotifications = (notifications) => notifications > 99 ? '99+' : notifications;

const handleClick = (item) => {
  if (item.logout) {
    authStore.logout();
    router.push("/"); 
  } else {
    router.push(item.path); 
  }
}
</script>

<style scoped>
.fixed-navbar {
  position: fixed !important;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
}
</style>

<template>
  <v-navigation-drawer v-if="!isMobile" absolute color="white" width="60" app permanent class="fixed-navbar">
    <div>
      <v-list dense class="text-center">
        <v-list-item>
          <v-img src="/tecnm.png" width="40" height="40" class="mx-auto"></v-img>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="(item, i) in filteredNavItems" :key="i" link class="py-3"
          :to="item.logout ? null : item.path" @click="handleClick(item)">
          <v-tooltip location="right">
            <template v-slot:activator="{ props }">
              <v-badge v-if="item.notifications > 0" :content="formattedNotifications(item.notifications)" color="red"
                offset-y="10" offset-x="10">
                <v-icon v-bind="props" :icon="item.icon" size="19"></v-icon>
              </v-badge>
              <v-icon v-else v-bind="props" :icon="item.icon" size="19"></v-icon>
            </template>
            {{ item.name }}
          </v-tooltip>
        </v-list-item>
      </v-list>
      <v-spacer class="px-6 py-3"></v-spacer>
    </div>
  </v-navigation-drawer>

  <v-bottom-navigation v-else class="mobile-navbar" app fixed color="white">
    <v-btn v-for="(item, i) in filteredNavItems" :key="i" :to="item.logout ? null : item.path"
      @click="handleClick(item)" class="text-center" style="flex:1;" :aria-label="item.name">
      <v-badge v-if="item.notifications > 0" :content="formattedNotifications(item.notifications)" color="red"
        offset-y="10" offset-x="10">
        <v-icon :icon="item.icon" size="22"></v-icon>
      </v-badge>
      <v-icon v-else :icon="item.icon" size="22"></v-icon>
      <span style="font-size:0.7em;display:block;">{{ item.name }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js';
import { useUserStore } from '@/stores/userStore.js';
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const userStore = useUserStore();
const { token } = storeToRefs(authStore);
const router = useRouter();

const navItems = ref([
  { icon: "fa-solid fa-house", notifications: 0, name: "Inicio", path: "/" },
  { icon: "fa-solid fa-right-to-bracket", notifications: 0, name: "Login", path: "/login", requiresGuest: true },
  { icon: "fa-solid fa-book", notifications: 0, name: "Blog", path: "/listaBlogs", requiresAuth: true },
  { icon: "far fa-user", notifications: 0, name: "Protected Route", path: "/protected-route", requiresAuth: true, requiresPermission: "read_record" },
  { icon: "fa-solid fa-sign-out-alt", notifications: 0, name: "Cerrar sesión", path: "/", requiresAuth: true, logout: true },
]);

const filteredNavItems = computed(() => {
  return navItems.value.filter(item => {
    if (item.requiresAuth && !token.value) return false;
    if (item.requiresGuest && token.value) return false;
    if (item.requiresPermission && !userStore.permissions.includes(item.requiresPermission)) return false;
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

const isMobile = ref(window.innerWidth < 768);
function handleResize() {
  isMobile.value = window.innerWidth < 768;
}
onMounted(() => {
  window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.fixed-navbar {
  position: fixed !important;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
}

.mobile-navbar {
  position: fixed !important;
  left: 0;
  right: 0;
  bottom: 0;
  height: 64px;
  z-index: 1000;
  border-top: 1px solid #eee;
}
</style>
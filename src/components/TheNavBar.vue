<template>
  <div v-if="!isMobile">
    <v-btn v-if="!drawer" class="show-drawer-btn" style="left: -10px;" icon @click="drawer = true" variant="text">
      <v-icon size="x-large">fa-solid fa-chevron-right</v-icon>
    </v-btn>
    <v-navigation-drawer v-model="drawer" class="fixed-navbar">
      <v-btn v-if="drawer" class="show-drawer-btn" style="left: 60px;" icon @click="drawer = false" variant="text">
        <v-icon size="x-large">fa-solid fa-chevron-left</v-icon>
      </v-btn>
      <v-list-item>
        <v-img src="/tecnm.png" width="40" height="40" class="mx-auto"></v-img>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense class="text-center">
        <template v-for="(item, i) in filteredNavItems" :key="i">
          <v-menu v-if="item.children" offset-y>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                link
                class="py-3 nav-item"
                style="cursor: pointer;"
                v-sfx:nav
              >
                <v-tooltip location="right">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-icon v-bind="tooltipProps" :icon="item.icon" size="19"></v-icon>
                  </template>
                  {{ item.name }}
                </v-tooltip>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item
                v-for="(child, j) in item.children"
                :key="j"
                link
                :to="child.path"
                @click="handleClick(child)"
                class="py-3 nav-item"
                v-sfx:nav
              >
                <v-tooltip location="right">
                  <template v-slot:activator="{ props: tooltipProps }">
                    <v-icon v-bind="tooltipProps" :icon="child.icon" size="19"></v-icon>
                  </template>
                  {{ child.name }}
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-list-item
            v-else
            link
            :to="item.logout ? null : item.path"
            @click="handleClick(item)"
            class="py-3 nav-item"
            v-sfx:nav
          >
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
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
  <v-bottom-navigation v-else class="mobile-navbar" app fixed height="50">
    <template v-for="(item, i) in filteredNavItems" :key="i">
      <v-btn
        v-if="!item.children"
        :to="item.logout ? null : item.path"
        v-sfx:nav
        @click="handleClick(item)"
        class="text-center"
        style="flex:1;"
        :aria-label="item.name"
      >
        <v-badge v-if="item.notifications > 0" :content="formattedNotifications(item.notifications)" color="red"
          offset-y="10" offset-x="10">
          <v-icon :icon="item.icon" size="20"></v-icon>
        </v-badge>
        <v-icon v-else :icon="item.icon" size="20"></v-icon>
        <span style="font-size:0.7em;display:block; padding-top: 5px;">{{ item.name }}</span>
      </v-btn>
      <v-menu v-else bottom>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" v-sfx:nav class="text-center" style="flex:1;" :aria-label="item.name">
            <v-icon :icon="item.icon" size="20"></v-icon>
            <span style="font-size:0.7em;display:block; padding-top: 5px;">{{ item.name }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(child, j) in item.children"
            :key="j"
            link
            :to="child.path"
            @click="handleClick(child)"
            v-sfx:nav
          >
            <v-icon :icon="child.icon" size="19"></v-icon>
            <v-list-item-title>{{ child.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
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

const drawer = ref(false);

const navItems = ref([
  { icon: "fa-solid fa-house", notifications: 0, name: "Inicio", path: "/" },
  { icon: "fa-solid fa-right-to-bracket", notifications: 0, name: "Login", path: "/login", requiresGuest: true },
  { icon: "fa-solid fa-file", name: "Blog", path: "/listaBlogs",  requiresGuest: true},
  {
    icon: "fa-solid fa-file",
    name: "Blogs",
    children: [
      { icon: "fa-solid fa-file", name: "Blog", path: "/listaBlogs"},
      { icon: "fa-solid fa-notes-medical", name: "Creador de blogs", path: "/protected-route", requiresAuth: true, requiresPermission: "read_record"},
    ]
    ,requiresAuth: true
  },
  { icon: "fa-solid fa-book", notifications: 0, name: "Libro", path: "/listaLibros", requiresAuth: true },
  { icon: "fa-solid fa-hexagon-nodes-bolt", notifications: 0, name: "Simulador", path: "/simulador", requiresAuth: false },
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
  } else if (item.path) {
    router.push(item.path);
  }
}

const MOBILE_BREAKPOINT = 768;
const LAYOUT_SHIFT_BREAKPOINT = 1280;

const isMobile = ref(window.innerWidth < MOBILE_BREAKPOINT);
const isLayoutShifted = ref(window.innerWidth < LAYOUT_SHIFT_BREAKPOINT);

function handleResize() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  isLayoutShifted.value = window.innerWidth < LAYOUT_SHIFT_BREAKPOINT;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

</script>

<style scoped>
.fixed-navbar {
  box-shadow: none !important;
  position: fixed !important;
  left: 0;
  top: 0;
  height: 1000vh;
  z-index: 1002;
  width: 60px !important;
  min-width: 60px !important;
}

.show-drawer-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10001;
  animation: peek-animation 2.5s infinite ease-in-out;
}

.show-drawer-btn .v-icon {
  color: #9ea4dbb2;
}

@keyframes peek-animation {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(8px);
  }
}

@media (min-width: 1280px) {
  .show-drawer-btn{
    display: none;
  }
}

.nav-item .v-icon {
  color: #888888;
}

.nav-item.v-list-item--active {
  background-color: #f0f0f0;
}

.nav-item.v-list-item--active .v-icon {
  color: #000000;
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
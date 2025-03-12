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
        v-for="(link, i) in links"
        :key="i"
        :to="link.path"
        :value="i + 1"
        class="text-none"
      >
        {{ link.name }}
      </v-tab>
      <v-tab
        href="/login"
        class="text-none ml-16 mr-4"
      >
        Inicio sesión
      </v-tab>
    </v-tabs>
  </v-app-bar>
</template>

<script setup>
const links = [
  { name: "Home", path: "/" },
  { name: "Ejemplo", path: "/ejemplo" },
  { name: "Ejemplo2", path: "/ejemplo2" },
];

const title = import.meta.env.VITE_APP_TITLE;

</script>
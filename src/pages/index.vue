<template>
  <AppHeader />
  <v-container class="">
    <AreaBooks />
    <AreaVideos />
    <AreaTrabajos />
  </v-container>
  <AppFooter />
</template>

<script setup>
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AreaBooks from '@/components/AreaBooks.vue';
import AreaTrabajos from '@/components/AreaTrabajos.vue';
import AreaVideos from '@/components/AreaVideos.vue';
  //
</script>

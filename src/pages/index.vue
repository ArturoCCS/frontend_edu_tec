<template>
     <div class="bg-lattice" aria-hidden="true"></div>
    <div class="bg-symbols" aria-hidden="true">
       <img class="sym o" src="/tecnm.png" alt=""/>
    </div>
  <TheHeader />
  <TheAreaBooks />
  <TheAreaVideos/>
  <TheAreaTrabajos />
  <TheFooter />
</template>

<script setup>
import TheAreaBooks from '@/components/Home/TheAreaBooks.vue';
import TheAreaTrabajos from '@/components/Home/TheAreaTrabajos.vue';
import TheHeader from '@/components/Home/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';

</script>

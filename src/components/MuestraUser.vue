<template>
   <div class="card" >
        <div class="header">
          <div>
            <p class="name">Nombre: {{ user.nombre }}</p>
            <p class="name">Email: {{ user.email }}</p>
          </div>
        </div>

     
</div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js';

const authStore = useAuthStore();
const user = authStore.user;

</script>

<style scoped lang="scss">
.card {
  background-color: rgba(243, 244, 246, 1);
  padding: 5rem;
  margin:  5rem auto;
  max-width: 620px;
  border-radius: 10px;
  box-shadow: 0 20px 30px -20px rgba(5, 5, 5, 0.24);
  
}



.name {
  margin-top: 0.25rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  --tw-text-opacity: 1;
  color: rgba(55, 65, 81, 1);
}

.message {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  margin-top: 1rem;
  color: rgba(107, 114, 128, 1);
}
</style>
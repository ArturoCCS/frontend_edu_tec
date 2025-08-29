<template>
  <div class="confirmation-container">
    <div v-if="loading" class="loading-spinner">
      <p>Verificando el correo...</p>
    </div>

    <div v-if="message" class="success-message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style scoped>
.confirmation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.loading-spinner {
  text-align: center;
}

.success-message {
  color: green;
  font-weight: bold;
}
</style>

<script>
import { useAuthStore } from '@/stores/authStore.js';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    const loading = ref(true);
    const error = ref(null);
    const message = ref(null);

    const token = route.params.token;

    onMounted(async () => {
      try {
        const response = await authStore.confirmEmail(token);
        loading.value = false;
        message.value = response.message;

        if (response.status === 'success') {

          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          error.value = response.message;
        }
      } catch (err) {
        loading.value = false;
        error.value = 'Hubo un error al procesar la confirmación.';
      }
    });

    return {
      loading,
      error,
      message
    };
  }
};
</script>

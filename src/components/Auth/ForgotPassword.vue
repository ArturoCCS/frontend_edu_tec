<template>
  <v-row class="mt-2 mb-2" justify="center">
    <div class="form" :style="{ '--secondary': $vuetify.theme.themes.light.colors.secondary }">
      <v-form @submit.prevent="handlePasswordReset">
        <v-img class="img" src="/petirrojo.jpg" cover />

        <span v-if="mensaje" class="error-message">{{ mensaje }}</span>

        <div :class="{ 'inputForm': true, 'error': emailError }">
          <i class="icon-form fa-solid fa-envelope"></i>
          <input v-model="email" type="text" class="input" required>
          <div class="label-line">Ingrese su correo electrónico</div>
          <i v-if="emailError" class="error-icon fa-solid fa-triangle-exclamation"></i>
        </div>
        <span v-if="emailError" class="error-message">{{ emailError }}</span>

        <button class="button-submit" :style="{ color: $vuetify.theme.themes.light.colors.secondary }">Enviar enlace de recuperación</button>
      </v-form>
    </div>
  </v-row>
</template>

<script>
import { useUserStore } from '@/stores/userStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const userStore = useUserStore()
    const email = ref('')
    const mensaje = ref('')
    const emailError = ref('')
    const router = useRouter()

    const handlePasswordReset = async () => {
      emailError.value = "";
      mensaje.value = "";

      let hasError = false;

      if (!email.value) {
        emailError.value = "El correo es obligatorio.";
        hasError = true;
      }

      if (hasError) {
        return;
      }

      const response = await userStore.requestPasswordReset({ email: email.value });

      if (response.status === "error") {
        mensaje.value = response.message;
        if (response.message.includes("Correo")) {
          emailError.value = response.message;
        }
        return;
      }

      if (response.status === "success") {
        mensaje.value = response.message;
        router.push('/login');
      }
    };

    return {
      email,
      mensaje,
      emailError,
      handlePasswordReset
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/main.scss';
</style>
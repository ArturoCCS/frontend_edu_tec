<template>
  <v-row class="mt-2 mb-2" justify="center">
    <div class="form">
      <v-form @submit.prevent="handleLogin">
        <v-img class="img" src="/petirrojo.jpg" cover />

        <span v-if="mensaje" class="error-message">{{ mensaje }}</span>

        <div :class="{ 'inputForm': true, 'error': emailError }">
          <i class="icon-form fa-solid fa-envelope"></i>
          <input v-model="email" type="text" class="input" required>
          <div class="label-line">Enter your email</div>
          <i v-if="emailError" class="error-icon fa-solid fa-triangle-exclamation"></i>
        </div>
        <span v-if="emailError" class="error-message">{{ emailError }}</span>

        <div :class="{ 'inputForm': true, 'error': passwordError }">
          <i class="icon-form fa-solid fa-lock icon"></i>
          <i class="password fa-regular" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"
            @click="togglePasswordVisibility()"></i>
          <input v-model="password" :type="passwordVisible ? 'text' : 'password'" class="input" required>
          <div class="label-line">Enter your password</div>
          <i v-if="passwordError" class="error-icon fa-solid fa-triangle-exclamation"></i>
        </div>
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>


        <div class="flex-row">
          <span class="span">¿Olvidó su contraseña?</span>
        </div>

        <button class="button-submit">Iniciar sesión</button>
        <p class="p">¿No tienes una cuenta?
          <a href="/register" class="span" style="text-decoration: none;">
            Regístrate
          </a>
        </p>
        <br>
        <p class="p line">O</p>

      </v-form>

      <div class="flex-row">
        <button class="btn google" @click="withGoogle">
          <img src="../assets/google.svg" alt="">
          Google
        </button>
        <button class="btn google" @click="withMicrosoft">
          <img src="../assets/microsoft.svg" alt="">
          Microsoft
        </button>
      </div>

    </div>
  </v-row>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
    const passwordVisible = ref(false)
    const mensaje = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const router = useRouter()

    const handleLogin = async () => {
      emailError.value = "";
      passwordError.value = "";
      mensaje.value = "";

      let hasError = false;

      if (!email.value) {
        emailError.value = "El correo es obligatorio.";
        hasError = true;
      }
      if (!password.value) {
        passwordError.value = "La contraseña es obligatoria.";
        hasError = true;
      }

      if (hasError) {
        return;
      }

      const response = await authStore.login({ email: email.value, password: password.value });

      if (response.status === "error") {
        mensaje.value = response.message;

        if (response.message.includes("Correo")) {
          emailError.value = response.message;
        }
        if (response.message.includes("contraseña")) {
          passwordError.value = response.message;
        }
        return;
      }

      if (response.status === "success") {
        router.push("/protected_route");
      }
    };


    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    return {
      email,
      password,
      mensaje,
      emailError,
      passwordError,
      passwordVisible,
      togglePasswordVisibility,
      handleLogin,
      withGoogle: authStore.withGoogle,
      withMicrosoft: authStore.withMicrosoft
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/main.scss';
</style>
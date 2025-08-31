<template>
  <v-row class="mt-2 pt-2" justify="center">
    <div class="form"  :style="{ '--secondary': $vuetify.theme.themes.light.colors.secondary }">
      <v-form @submit.prevent="handleRegister" href="/login">
        <v-img class="img" src="/petirrojo.jpg" cover />

        <span v-if="mensaje" class="error-message">{{ mensaje }}</span>

        <div :class="nombreError ? 'inputForm error' : 'inputForm'">
          <i class="icon-form fa-solid fa-user"></i>
          <input v-model="nombre" type="text" class="input" required>
          <i v-if="nombreError" class="error-icon fa-solid fa-triangle-exclamation"></i>
          <div class="label-line" :class="{ active: nombre || nombreError }">
            Enter your name
          </div>
        </div>

        <span v-if="nombreError" class="error-message">{{ nombreError }}</span>

        <div :class="emailError ? 'inputForm error' : 'inputForm'">
          <i class="icon-form fa-solid fa-envelope"></i>
          <input v-model="email" type="text" class="input" required>
          <i v-if="emailError" class="error-icon fa-solid fa-triangle-exclamation"></i>
          <div class="label-line" :class="{ active: email || emailError }">Enter your email</div>

        </div>
        <span v-if="emailError" class="error-message">{{ emailError }}</span>


        <div :class="passwordError ? 'inputForm error' : 'inputForm'">
          <i class="icon-form fa-solid fa-lock icon"></i>
          <i class="password fa-regular" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"
            @click="togglePasswordVisibility()"></i>
          <input v-model="password" :type="passwordVisible ? 'text' : 'password'" class="input" required>

          <i v-if="passwordError" class="error-icon fa-solid fa-triangle-exclamation"></i>
          <div class="label-line" :class="{ active: password || passwordError }">Enter your password</div>


        </div>
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>


        <button class="button-submit" :style="{ color: $vuetify.theme.themes.light.colors.secondary }">Registrarse</button>
        <p class="p">¿Ya tienes una cuenta?
          <a href="/login" class="span" style="text-decoration: none;">
            Iniciar sesión
          </a>
        </p>
        <p class="p line">O</p>

      </v-form>
      <div class="flex-row">
        <button class="btn google" @click="withGoogle" :style="{ background: $vuetify.theme.themes.light.colors.secondary }">
          <img src="/src/assets/google.svg" alt="">
          Google
        </button>
        <button class="btn google" @click="withMicrosoft" :style="{ background: $vuetify.theme.themes.light.colors.secondary }">
          <img src="/src/assets/microsoft.svg" alt="">
          Microsoft
        </button>
      </div>
    </div>
  </v-row>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore()
    const nombre = ref('')
    const email = ref('')
    const password = ref('')
    const mensaje = ref('')
    const passwordVisible = ref(false)
    const router = useRouter()
    const nombreError = ref('')
    const emailError = ref('')
    const passwordError = ref('')

    const handleRegister = async () => {
      nombreError.value = "";
      emailError.value = "";
      passwordError.value = "";
      mensaje.value = "";

      if (!nombre.value) {
        nombreError.value = "El nombre es obligatorio.";
      }
      if (!email.value) {
        emailError.value = "El correo es obligatorio.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.value = "Correo electrónico no válido.";
      }
      if (!password.value) {
        passwordError.value = "La contraseña es obligatoria.";
      } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password.value)) {
        passwordError.value = "Debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.";
      }

      if (nombreError.value || emailError.value || passwordError.value) {
        return;
      }

      const response = await authStore.register({
        nombre: nombre.value,
        email: email.value,
        password: password.value,
      });

      if (response.status === "error") {
        mensaje.value = response.message;

        if (response.message.includes("nombre")) {
          nombreError.value = response.message;
        }
        if (response.message.includes("Correo")) {
          emailError.value = response.message;
        }
        if (response.message.includes("contraseña")) {
          passwordError.value = response.message;
        }
        return;
      }

      if (response.status === "success") {
        router.push("/login");
      }
    };


    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    return {
      nombre,
      email,
      password,
      mensaje,
      nombreError,
      emailError,
      passwordError,
      passwordVisible,
      handleRegister,
      togglePasswordVisibility,
      withGoogle: authStore.withGoogle,
      withMicrosoft: authStore.withMicrosoft
    }
  }
};

</script>

<style scoped lang="scss">
@use '@/styles/main.scss';
</style>
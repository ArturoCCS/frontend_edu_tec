<template>
  <v-row class="mt-2 mb-2" justify="center">
    <div class="form" :style="{ '--secondary': $vuetify.theme.themes.light.colors.secondary }">
      <v-form @submit.prevent="handleLogin">
        <v-img class="img" src="/petirrojo.jpg" cover />

        <span v-if="mensaje" class="error-message">{{ mensaje }}</span>

        <div class="inputForm" :class="{ error: errors.email }">
          <i class="icon-form fa-solid fa-envelope"></i>
          <input v-model="email" type="text" class="input" required>
          <div class="label-line">Enter your email</div>
          <i v-if="errors.email" class="error-icon fa-solid fa-triangle-exclamation"></i>
        </div>
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>

        <div class="inputForm" :class="{ error: errors.password }">
          <i class="icon-form fa-solid fa-lock icon"></i>
          <i class="password fa-regular" :class="passwordVisible ? 'fa-eye-slash' : 'fa-eye'"
            @click="togglePasswordVisibility"></i>
          <input v-model="password" :type="passwordVisible ? 'text' : 'password'" class="input" required>
          <div class="label-line">Enter your password</div>
          <i v-if="errors.password" class="error-icon fa-solid fa-triangle-exclamation"></i>
        </div>
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

        <div class="flex-row">
          <router-link to="/forgot-password" class="span" style="text-decoration: none;">
            ¿Olvidó su contraseña?
          </router-link>
        </div>

        <button class="button-submit" :style="{ color: $vuetify.theme.themes.light.colors.secondary }">Iniciar sesión</button>
        <p class="p">
          ¿No tienes una cuenta?
          <a href="/register" class="span" style="text-decoration: none;">Regístrate</a>
        </p>
        <p class="p line">O</p>
      </v-form>

      <div class="flex-row">
        <button class="btn google" @click="authStore.withGoogle"  :style="{ background: $vuetify.theme.themes.light.colors.secondary }">
          <img src="/src/assets/google.svg" alt=""> Google
        </button>
        <button class="btn micro" @click="authStore.withMicrosoft"  :style="{ background: $vuetify.theme.themes.light.colors.secondary }">
          <img src="/src/assets/microsoft.svg" alt=""> Microsoft
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
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const passwordVisible = ref(false)
    const mensaje = ref('')

    const errors = ref({
      email: '',
      password: ''
    })

    const validateFields = () => {
      errors.value.email = email.value ? '' : 'El correo es obligatorio.'
      errors.value.password = password.value ? '' : 'La contraseña es obligatoria.'
      return !errors.value.email && !errors.value.password
    }

    const handleLogin = async () => {
      mensaje.value = ''

      if (!validateFields()) return

      const response = await authStore.login({ email: email.value, password: password.value })

      if (response.status === 'error') {
        mensaje.value = response.message
        if (response.message.includes('Correo')) errors.value.email = response.message
        if (response.message.includes('contraseña')) errors.value.password = response.message
        return
      }

      if (response.status === 'success') {
        await authStore.checkAuth();
        router.push('/protected-route')
      }
    }

    return {
      email,
      password,
      mensaje,
      errors,
      passwordVisible,
      handleLogin,
      togglePasswordVisibility: () => (passwordVisible.value = !passwordVisible.value),
      authStore
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/main.scss';
</style>

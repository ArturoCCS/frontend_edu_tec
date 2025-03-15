<template>
  <v-row class="mt-2 mb-2" justify="center">
    <v-form class="form" @submit.prevent="handleLogin">
      <v-img class="img" src="/petirrojo.jpg" cover />

      <div class="flex-column">
        <v-label>Email</v-label>
      </div>
      <div class="inputForm">
        <input v-model="email" type="text" class="input" placeholder="Enter your Email">
      </div>

      <div class="flex-column">
        <v-label>Password</v-label>
      </div>
      <div class="inputForm">
        <input v-model="password" type="password" class="input" placeholder="Enter your Password">
      </div>

      <div class="flex-row">
        <span class="span">¿Olvidó su contraseña?</span>
      </div>

      <button class="button-submit">Iniciar sesión</button>
                <p class="p">¿No tienes una cuenta? 
                  <a href="/register" class="span" style="text-decoration: none;">Regístrate</a></p>
                <p class="p line">O</p> 

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
      <p class="p">{{ mensaje }}</p>
    </v-form>
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
    const mensaje = ref('')
    const router = useRouter()

    const handleLogin = async () => {
      const response = await authStore.login({ email: email.value, password: password.value })

      mensaje.value = response.message

      if (response.status == "success") {
        router.push('/protected_route')
      }
    }

    return {
      email,
      password,
      mensaje,
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
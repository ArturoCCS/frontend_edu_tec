<template>
  <v-row class="mt-5 pt-5" justify="center">
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
        <div>
          <input type="checkbox">
          <label>Remember me</label>
        </div>
        <span class="span">Forgot password?</span>
      </div>

      <button class="button-submit">Sign In</button>
      
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

      if (response.success) {
        router.push('/protected_route')
      }
    }

    return {
      email,
      password,
      mensaje,
      handleLogin
    }
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/main.scss';    
</style>
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
/* From Uiverse.io by micaelgomestavares */ 
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #ffffff;
  padding: 30px;
  width: 450px;
  border-radius: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.img {
  margin: 0 auto;
  width: 70px;
  height: 70px;
}
::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.form button {
  align-self: flex-end;
}

.flex-column > label {
  color: #151717;
  font-weight: 600;
}

.inputForm {
  border: 1.5px solid #ecedec;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 10px;
  transition: 0.2s ease-in-out;
}

.input {
  margin-left: 10px;
  border-radius: 10px;
  border: none;
  width: 85%;
  height: 100%;
}

.input:focus {
  outline: none;
}

.inputForm:focus-within {
  border: 1.5px solid #2d79f3;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.flex-row > div > label {
  font-size: 14px;
  color: black;
  font-weight: 400;
}

.span {
  font-size: 14px;
  margin-left: 5px;
  color: #2d79f3;
  font-weight: 500;
  cursor: pointer;
}

.button-submit {
  margin: 20px 0 10px 0;
  background-color: #151717;
  border: none;
  color: white;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  cursor: pointer;
}

.button-submit:hover {
  background-color: #252727;
}

.p {
  text-align: center;
  color: black;
  font-size: 14px;
  margin: 5px 0;
}

.btn {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  gap: 10px;
  border: 1px solid #ededef;
  background-color: white;
  cursor: pointer;
  transition: 0.2s ease-in-out;
}

.btn:hover {
  border: 1px solid #2d79f3;
  ;
}

    
</style>
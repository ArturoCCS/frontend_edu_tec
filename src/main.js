import { registerPlugins } from '@/plugins'
import axios from 'axios'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.scss'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

import { useAuthStore } from '@/stores/authStore.js'
import { useUserStore } from '@/stores/userStore.js'
const authStore = useAuthStore()
const userStore = useUserStore()
authStore.loadFromLocalStorage()
userStore.loadFromLocalStorage()

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

registerPlugins(app)
app.mount('#app')
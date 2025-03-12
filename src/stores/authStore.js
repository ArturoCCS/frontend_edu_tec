import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async register(credentials) {
      try {
        console.log(credentials)

        const response = await axios.post('http://localhost:3000/auth/register', {
          nombre: credentials.nombre,
          email: credentials.email,
          password: credentials.password,
        });

        if (response.data.status === "success") {
          localStorage.setItem('token', response.data.token);
          console.log('Token guardado en localStorage:', localStorage.getItem('token'));
          return { success: true, message: 'Registro exitoso' }
        }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error en la autenticación' }
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', credentials, {
          withCredentials: true,
        })
        
        return { success: true, message: 'Inicio de sesión exitoso' }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error en la autenticación' }
      }
    },
    withGoogle() {
      window.location.href = 'http://localhost:3000/auth/google'
    },
    withMicrosoft() {
      window.location.href = 'http://localhost:3000/auth/microsoft'
    },
    logout() {
      axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true })
        .then(() => {
          this.user = null
        })
        .catch(error => {
          console.error('Error al cerrar sesión:', error)
        })
    },
    async checkAuth() {
      try {
        const response = await axios.get('http://localhost:3000/protected_route', { withCredentials: true })
        this.user = response.data.user 
        return { success: true }
      } catch (error) {
        return { success: false }
      }
    },
  }
})

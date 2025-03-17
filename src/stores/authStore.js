import axios from 'axios';
import Cookies from "js-cookie";
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: Cookies.get("token") || null,
  }),
  actions: {
    async register(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', credentials);
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: "error", message: error.response?.data?.message || 'Error en la autenticación' };
      }
    },
    async confirmEmail(token) {
      try {
        const response = await axios.get(`http://localhost:3000/auth/confirm/${token}`);
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: 'error', message: error.response?.data?.message || 'Error al confirmar el correo' };
      }
    },
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', credentials, {
          withCredentials: true,
        });

        this.token = response.data.token;
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: "error", message: error.response?.data?.message || 'Error en la autenticación' };
      }
    },
    withGoogle() {
      window.location.href = 'http://localhost:3000/auth/google';
    },
    withMicrosoft() {
      window.location.href = 'http://localhost:3000/auth/microsoft';
    },
    async logout() {
      try {
        const response = await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
        this.user = null;
        this.token = null;
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: "error", message: error.response?.data?.message || 'Error al cerrar sesión' };
      }
    },
    async checkAuth() {
      try {
        const response = await axios.get('http://localhost:3000/auth/check-auth', { withCredentials: true });
        this.token = response.data.user.token;
        this.user = response.data.user;
        return { status: "success", message: "Usuario autenticado" };
      } catch (error) {
        this.user = null;
        this.token = null;
        return { status: "error", message: error.response?.data?.message || 'No autenticado' };
      }
    },
  }
});

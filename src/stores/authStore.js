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
    async login(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', credentials, {
          withCredentials: true,
        });

        this.token = response.data.token;
        Cookies.set("token", response.data.token, { expires: 7, secure: true, httpOnly: false });

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
        Cookies.remove("token");
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: "error", message: error.response?.data?.message || 'Error al cerrar sesión' };
      }
    },
    async checkAuth() {
      try {
        const response = await axios.get('http://localhost:3000/auth/check-auth', { withCredentials: true });
        this.user = response.data.user;
        this.token = Cookies.get("token") || null;
        return { status: "success", message: "Usuario autenticado" };
      } catch (error) {
        this.user = null;
        this.token = null;
        Cookies.remove("token");
        return { status: "error", message: error.response?.data?.message || 'No autenticado' };
      }
    },
  }
});

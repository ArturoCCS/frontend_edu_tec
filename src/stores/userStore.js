import axios from 'axios';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    permissions: []
  }),
  actions: {
    async requestPasswordReset(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/user/password-reset', credentials);
        return { status: response.data.status, message: response.data.message };
      } catch (error) {
        return { status: 'error', message: error.response?.data?.message || 'Error en la recuperación de contraseña' };
      }
    },
    async resetPassword(recoveryToken, newPassword) {
      try {
        const response = await axios.post(`http://localhost:3000/user/reset-password/${recoveryToken}`, { password: newPassword });
        return { status: response.data.status , message: response.message };
      } catch (error) {
        return { 
          status: 'error', 
          message: error.response?.data?.message || 'Error al restablecer la contraseña' 
        };
      }
    },
  async checkPermission(){
      try{
        const response = await axios.get('http://localhost:3000/plataform/protected-route', { 
          withCredentials: true 
        });
        this.permissions = response.data.permissions; 
        localStorage.setItem('permissions', JSON.stringify(this.permissions));
        return { status: response.data.status , message: response.data.message };
      } catch (error) {
        this.permissions = [];
        localStorage.removeItem('permissions');
        return { 
          status: 'error', 
          message: error.response?.data?.message || 'Error al verificar permisos' 
        };
      }
    },
    loadFromLocalStorage() {
      this.permissions = JSON.parse(localStorage.getItem('permissions')) || [];
      this.user = JSON.parse(localStorage.getItem('user')) || null;
    }
      
  }
});

import axios from 'axios';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async requestPasswordReset(credentials) {
      try {
        const response = await axios.post('http://localhost:3000/user/password-reset', credentials);
        return { status: 'success', message: response.data.message };
      } catch (error) {
        return { status: 'error', message: error.response?.data?.message || 'Error en la recuperación de contraseña' };
      }
    },
    async resetPassword(recoveryToken, newPassword) {
        try {
          const response = await axios.post(`http://localhost:3000/user/reset-password/${recoveryToken}`, { password: newPassword });
          return { status: 'success', message: 'Contraseña actualizada con éxito' };
        } catch (error) {
          return { 
            status: 'error', 
            message: error.response?.data?.message || 'Error al restablecer la contraseña' 
          };
        }
      }
      
  }
});

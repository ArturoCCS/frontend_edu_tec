<template>
    
    <v-row class="mt-4 mb-4" justify="center">
      <div class="form"  :style="{ '--secondary': $vuetify.theme.themes.light.colors.secondary }">
        <v-form @submit.prevent="handleResetPassword">
          <h2>Restablecer tu contraseña</h2>
  
          <div v-if="mensaje" :class="{'error-message': isError, 'success-message': !isError}">
            {{ mensaje }}
          </div>
  
          <div :class="{ 'inputForm': true, 'error': passwordError }">
            <i class="icon-form fa-solid fa-lock"></i>
            <input v-model="password" :type="passwordVisible ? 'text' : 'password'" class="input" required />
            <div class="label-line">Nueva contraseña</div>
            <i v-if="passwordError" class="error-icon fa-solid fa-triangle-exclamation"></i>
          </div>
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
  
          <div :class="{ 'inputForm': true, 'error': confirmPasswordError }">
            <i class="icon-form fa-solid fa-lock"></i>
            <input v-model="confirmPassword" :type="passwordVisible ? 'text' : 'password'" class="input" required />
            <div class="label-line">Confirmar nueva contraseña</div>
            <i v-if="confirmPasswordError" class="error-icon fa-solid fa-triangle-exclamation"></i>
          </div>
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
  
          <button class="button-submit" :style="{ color: $vuetify.theme.themes.light.colors.secondary }">Restablecer contraseña</button>
  
        </v-form>
      </div>
    </v-row>
  </template>
  <script>
  import { useUserStore } from '@/stores/userStore';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
  
  export default {
    props: ['recoveryToken'], 
    setup(props) {
      const password = ref('');
      const confirmPassword = ref('');
      const passwordVisible = ref(false);
      const mensaje = ref('');
      const isError = ref(false);
      const passwordError = ref('');
      const confirmPasswordError = ref('');
      const route = useRoute();
      const router = useRouter();
      const userStore = useUserStore();
      const recoveryToken = ref(props.recoveryToken || route.params.recoveryToken);
  
      onMounted(() => {
        console.log('Componente montado');
        console.log('Token de reset:', recoveryToken.value);
      });
  
      const handleResetPassword = async () => {
        console.log('Enviando formulario...');
        
        passwordError.value = '';
        confirmPasswordError.value = '';
        mensaje.value = '';
        isError.value = false;
  
        if (!password.value) {
          passwordError.value = 'La contraseña es obligatoria.';
          return;
        }
  
        if (!confirmPassword.value) {
          confirmPasswordError.value = 'Confirmar la contraseña es obligatorio.';
          return;
        }
  
        if (password.value !== confirmPassword.value) {
          confirmPasswordError.value = 'Las contraseñas no coinciden.';
          return;
        }
  
        try {
          console.log('Llamando a resetPassword...');
          const response = await userStore.resetPassword(recoveryToken.value, password.value);
          console.log('Respuesta del servidor:', response);
  
          mensaje.value = response.message;
          isError.value = response.status === 'error';
  
          if (response.status === 'success') {
            setTimeout(() => {
              router.push('/login');
            }, 2000);
          }
        } catch (error) {
          console.error('Error en resetPassword:', error);
          mensaje.value = 'Error inesperado, intenta de nuevo.';
          isError.value = true;
        }
      };
  
      return {
        password,
        confirmPassword,
        passwordVisible,
        mensaje,
        isError,
        passwordError,
        confirmPasswordError,
        handleResetPassword,
      };
    },
  };
  </script>
  
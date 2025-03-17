<template>
  <v-container>
    <h1>¡Confirmación Requerida!</h1>
    <p>Por favor, revisa tu correo electrónico para confirmar tu cuenta.</p>
    <v-btn @click="$router.push('/login')">Ir a Login</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'ConfirmationRequired'
};
</script>

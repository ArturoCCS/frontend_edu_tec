<template>
  <v-col
    cols="6"
    class="px-8"
  >
    <div class="text-subtitle-1 text-medium-emphasis">
      <v-btn
        class="text-none"
        prepend-icon="far fa-envelope"
        variant="text"
      >
        Este es un formulario de ejemplo
      </v-btn>
    </div>
    <v-row>
      <v-col cols="5">
        <v-text-field
          density="compact"
          placeholder="Enter your name"
          variant="outlined"
          color="teal-lighten-5"
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          density="compact"
          placeholder="Enter your email"
          color="teal-lighten-5"
          variant="outlined"
        />
      </v-col>
      <v-col cols="2">
        <v-btn
          class="me-2 text-none text-white"
          color="#344D43"
          prepend-icon="fas fa-paper-plane"
          variant="flat"
        >
          Share
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>
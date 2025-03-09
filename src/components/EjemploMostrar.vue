<template>
  <v-row class="mb-16 pb-16">
    <v-col cols="12">
      <v-toolbar density="compact" color="transparent">
        <v-toolbar-title>Lista de usuarios</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn> View All Posts </v-btn>
      </v-toolbar>
    </v-col>
    <template v-for="usuario in usuarios" :key="usuario.id">
      <v-col cols="12" md="4">
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            :class="{ 'on-hover': isHovering }"
            :elevation="isHovering ? 12 : 0"
            v-bind="props"
            color="transparent"
            flat
            style="border-radius: 10%"
          >
            <!-- <v-img :src="item.img" height="350px" cover> </v-img> -->
            <v-img
            src="\sin_foto.jpeg"
            height="350px" cover
            ></v-img>
            
            <v-card-title class="text-h6 d-flex flex-column">
              <p class="mt-4">
                {{ usuario.id }}
              </p>

              <div>
                <p class="ma-0 text-body-1 font-weight-bold">
                  {{ usuario.nombre }}
                </p>
              </div>
            </v-card-title>
          </v-card>
        </v-hover>
      </v-col>
    </template>
  </v-row>

</template>

<script>
import axios from "axios";

const URL_BACKEND = import.meta.env.VITE_APP_URL_BACKEND;

export default {
  data() {
    return {
      mensaje: "",
      usuarios: [],
    };
  },
  mounted() {
    // Petición al backend
    axios
      .get(`${URL_BACKEND}`)
      .then((response) => {
        this.mensaje = response.data.mensaje;
      })
      .catch((error) => {
        console.error("Error obteniendo el mensaje:", error);
      });

    // Petición para obtener usuarios
    axios
      .post(`${URL_BACKEND}/libros/mostrar`)
      .then((response) => {
        this.usuarios = response.data;
      })
      .catch((error) => {
        console.error("Error obteniendo los libros:", error);
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

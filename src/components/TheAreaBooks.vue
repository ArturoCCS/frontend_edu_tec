<template>
    <div style="height: 600px; width: 100%; background: white;">
      <div class="cuadro4" :style="{background: $vuetify.theme.themes.light.colors.primary}">

</div>
<v-row class="mt-16">
    <v-col cols="5" class="fondo">
    <h1 class="CRT ">
      Explorar los libros
    </h1>
    <h1 class="CRT">
      en la plataforma
    </h1>
    <p class="text-grey CRT">
      Podras encontrar los mejores libros. <br>
      sobre bla bla bla bla bla bla bla bla<br>
      descarga, comenta y puntua<br>
      los libros que más te gusten.
    </p>
    <v-btn
      class="text-none text-white mt-10 mr-5 CRT"
      color="black"
      min-width="92"
      rounded
    >
      Explorar
    </v-btn>
  </v-col>

  <v-col cols="6">
    <h3 class="mt-16">
      Libros destacados
    </h3>
    <v-row>
      <v-col
        v-for="(libro, i) in libros"
        :key="i"
        cols="4"
      >
        <div>
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              class="mx-auto"
              color="transparent"
              max-width="600"
              v-bind="props"
              flat
            >
              <v-img
                :src="libro.portada"
                cover
              />
              <v-expand-transition>
                <div
                  v-if="isHovering"
                  class="d-flex transition-fast-in-fast-out bg-green-lighten-2 v-card--reveal text-h2"
                  style="height: 70%"
                >
                  <v-btn
                    icon="fa-solid fa-book"
                    color="black"
                    style="z-index: 9999"
                  />
                </div>
              </v-expand-transition>

              <v-card-text class="pt-6">
                <div
                  class="font-weight-light text-grey text-h6 mb-2 text-center"
                >
                  {{ libro.views }} views
                </div>
              </v-card-text>
            </v-card>
          </v-hover>
        </div>
      </v-col>
    </v-row>
  </v-col>
</v-row>
    </div>
</template>
<script>
export default {
  data: () => ({
    model: null,
    libros: [
      { portada: "sin_foto.jpeg", views: "50" },
      { portada: "sin_foto.jpeg", views: "78" },
      { portada: "sin_foto.jpeg", views: "43" },
    ],
  }),
};
</script>
<style>
.CRT {
  margin-left: 100px;
}
.cuadro4{
    position: absolute;
    width: 100%;
    height: 250px;
    border-radius: 0 0 0 150px;
}

.fondo{
  
  margin-top: -60px;
  z-index: 100;
}
.v-card--reveal {
  align-items: end;
  bottom: 0;
  justify-content: right;
  opacity: 0.15;
  position: absolute;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
}
</style>

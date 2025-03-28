<template>
    <div style="height: 600px; width: 100%; background: white;">
      <div class="cuadro4" :style="{background: $vuetify.theme.themes.light.colors.primary}">

</div>
<v-row class="mt-16">
    <v-col cols="5" class="fondo">
    <h1 class="CRT ">
      Lorem ipsum dolor 
    </h1>
    <h1 class="CRT">
      ipsum dolor sit amet 
    </h1>
    <br>
    <p class="text-grey CRT">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit.  <br>
       Quam dolorum architecto error maiores adipisci  <br>
       provident necessitatibus deleniti quas velit, <br>
      deserunt explicabo voluptatem quo!
    </p>
    <v-btn
      class="text-none text-white mt-10 mr-5 CRT"
      color="black"
      min-width="92"
      rounded
    >
      Boton
    </v-btn>
  </v-col>

  <v-col cols="6">
    <h3 class="mt-16">
      Lorem
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
                  class="d-flex transition-fast-in-fast-out bg-black v-card--reveal text-h2"
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
    width: 96%;
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

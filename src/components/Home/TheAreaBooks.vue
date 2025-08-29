<template>
  <div style="height: 600px; width: 100%; background: white;">
    <div class="cuadro4" :style="{ background: $vuetify.theme.themes.light.colors.primary }">

    </div>
    <v-row class="mt-16">
      <v-col cols="5" class="fondo">
        <h1 class="CRT" v-motion-slide-visible-bottom>
          Libreria Virtual
        </h1>
        <br>
        <p class="text-books CRT" v-motion-slide-visible-bottom>
          Explora un catálogo que te ayuda a enriquecer tu aprendizaje, <br>
          encontrar lecturas recomendadas, organizar tus estudios y <br>
          acceder a recursos educativos de calidad en línea. <br> <br>
          <span>

            ¡Encuentra el libro que necesitas para impulsar tu formación y alcanzar tus metas!
          </span>
        </p>
      </v-col>

      <v-col cols="6" style="margin-top: 60px;">
        <v-row>
          <v-col v-for="(libro, i) in libros" :key="i" cols="4">
            <div v-motion-slide-visible-bottom>
              <v-hover v-slot="{ isHovering, props }">
                <v-card class="mx-auto" color="transparent" max-width="400" v-bind="props" flat>
                  <v-img :src="libro.portada" cover max-height="250" />
                  <v-expand-transition>
                    <div v-if="isHovering" class="d-flex transition-fast-in-fast-out  v-card--reveal text-h2"
                      style="height: 80%">
                      <v-btn icon="fa-solid fa-book" style="z-index: 9999; color: rgb(70 98 164);" />

                    </div>
                  </v-expand-transition>

                  <v-card-text class="pt-6">
                    <div class="font-weight-light text-grey text-h6 mb-2 text-center">
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
      {
        portada: "/sin_foto.jpeg",
        views: "50"
      },
      {
        portada: "/sin_foto.jpeg",
        views: "78"
      },
      {
        portada: "/sin_foto.jpeg",
        views: "43"
      },
    ],
  }),
};
</script>
<style>
.CRT {
  margin-left: 50px;
}

.cuadro4 {
  position: absolute;
  width: 96%;
  height: 250px;
  border-radius: 0 0 0 150px;
}

.fondo {

  margin-top: -60px;
  z-index: 100;
}

.v-card--reveal {
  align-items: end;
  bottom: 0;
  justify-content: right;
  opacity: 0.4;
  position: absolute;
  width: 100%;
  border-radius: 10px;
  padding: 10px;

  background: rgba(163, 187, 242, 0.696);
}

.text-books {
  font-size: 0.4m;
  font-weight: 300;
  color: #383838;
}
</style>

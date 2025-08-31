<template>
  <div style="height: 600px; width: 100%;" :style="{ background: $vuetify.theme.themes.light.colors.secondary }">
    <div class="cuadro4" :style="{ background: $vuetify.theme.themes.light.colors.primary }">

    </div>
    <v-row class="content-area-books">
      <v-col cols="6" class="text-area-books">
        <h1 class="title-area-books" v-motion-slide-visible-bottom>
          Libreria Virtual
        </h1>
        <br>
        <p class="description-area-books" v-motion-slide-visible-bottom>
          Explora un catálogo que te ayuda a enriquecer tu aprendizaje, <br>
          encontrar lecturas recomendadas, organizar tus estudios y <br>
          acceder a recursos educativos de calidad en línea. <br> <br>
          <span>

            ¡Encuentra el libro que necesitas para impulsar tu formación y alcanzar tus metas!
          </span>
        </p>
      </v-col>

      <v-col class="card-books" >
        <v-row >
          <v-col v-for="(libro, i) in libros" :key="i" cols="4">
            <div v-motion-slide-visible-bottom>
              <v-hover v-slot="{ isHovering, props }">
                <v-card class="mx-auto" color="transparent" min-width="80" v-bind="props" flat>
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

.cuadro4 {
  position: absolute;
  width: 100%;
  height: 360px;
  border-radius: 0 0 0 150px;
}

.card-books {
  margin-top: 230px;
  margin-right: 5%;
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


.title-area-books{
  font-size: clamp(1.4rem, 4vw, 2.7rem);
  font-weight: 800;
  margin-left: 50px;
  
}
.description-area-books {
  font-size: clamp(0.7rem, 2vw, 1rem);
  font-weight: 300;
  color: #383838;
  margin-left: 50px;
}

.content-area-books{
  margin-top: 64px ;
}

@media (max-width: 960px) {
  .title-area-books{
    margin-left: 40px;
  }
  .description-area-books {
    
    margin-left: 40px;
  }
  .card-books {
    margin-top: 34%;
  }
}
@media (max-width: 600px) {
 

  .title-area-books{
    margin-left: 30px;
  }
  .description-area-books{
    
    margin-left: 30px;
  }

  .content-area-books {
    flex-direction: column;
  }

  .text-area-books{
    margin-top: 80px;
    min-width: 350px;
  }
  .card-books {
    margin-left: 90px;
    margin-top: 0;
    max-width: 75%;
  }

  .pt-6 .text-h6{
    font-size: 0.8rem !important;
  }
  
}
</style>

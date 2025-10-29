<template>
  <div style="height: 700px; width: 100%;" :style="{ background: $vuetify.theme.themes.light.colors.primary }">
    <div class="cuadro4" :style="{ background: $vuetify.theme.themes.light.colors.secondary }">

    </div>
    <v-row class="content-area-books" v-motion-slide-visible-bottom>
      <v-col cols="6" class="text-area-books">
        <h1 class="title-area-books">
          Libreria  <span class="span-text">Virtual</span>
        </h1>
        <br>
        <p class="description-area-books">
          Explora y encuentra lecturas recomendadas,
           organiza tus estudios y <dr>

           </dr>accede a recursos educativos de calidad en línea. <br> <br>
          <span>

            ¡Encuentra el libro que necesitas para impulsar tu formación y alcanzar tus metas!
          </span>
        </p>

        <v-btn :to="'/listaLibros'" class="text-none text-white mt-7 btn-area-book" color="#0f2133" min-width="92" rounded >
          Explorar
        </v-btn>
      
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
  width: 80%;
  right: 0;
  height: 450px;
  border-radius: 150px 0 0 150px;
}

.card-books {
  margin-top: 330px;
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
  color: #0f2133;
  margin-top: 40px;
  font-size: clamp(1.2rem, 3vw, 3rem);
  font-weight: 800;
}
.description-area-books {
    font-size: clamp(0.4rem, 3vw, 1rem);
  color: #6f6f6f !important;
}

.btn-area-book,
.description-area-books,
.title-area-books{
  margin-left: 55%;
}

.content-area-books{
  margin-top: 64px ;
}

@media (max-width: 960px) {

  .card-books {
    margin-top: 34%;
  }
}
@media (max-width: 768px) {

  .cuadro4 {
    position: absolute;
    width: 90%;
    right: 0;
    height: 450px;
    border-radius: 150px 0 0 150px;
  }

  .content-area-books {
    flex-direction: column;
  }

  .text-area-books{
    min-width: 500px;
  }
  .card-books {
      margin-left: 20%;
      margin-top: 25px;
      max-width: 75%;
  }

  .btn-area-book,
  .description-area-books,
  .title-area-books{
    margin-left: 25%;
  }


  .pt-6 .text-h6{
    font-size: 0.8rem !important;
  }
  
}

@media (max-width: 468px) {
  .text-area-books{
    min-width: 300px;
  }
  
  .btn-area-book,
  .description-area-books,
  .title-area-books{
    margin-left: 35%;
  }
}

</style>

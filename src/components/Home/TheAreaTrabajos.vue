<template>
  <v-row class="pb-16">
    <v-col cols="6" class="col-imagenes" style="border-radius: 250px 250px 0 0;" :style="{ backgroundColor: $vuetify.theme.themes.light.colors.primary }">
      
      <v-row  v-motion-slide-visible-bottom>
        <v-col cols="8" class="img-principal">
          <v-img src="/sin_foto.jpeg" max-height="600" contain class="mt-10" />
        </v-col>
        <v-col cols="4" class="img-secundaria">
          <v-img src="/sin_foto.jpeg" max-height="200" contain class="mt-10 ml-n2" style="border-radius: 10%" />
          <v-img src="/sin_foto.jpeg" max-height="400" contain class="mt-5" style="margin-left: -120px; border-radius: 10%" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="6" class="fondo2 mb-16" :style="{ background: $vuetify.theme.themes.light.colors.secondary }">
      
      <h2 class="title-area-blogs"  v-motion-slide-visible-bottom>
        Seccion de Blogs
      </h2>
      <p class="text-grey description-area-blogs"  v-motion-slide-visible-bottom>
        Podras encontrar variedad de blogs<br>
        creados por tus maestros <br>
      </p>
      
      <div class="cuadro7"  :style="{ background: $vuetify.theme.themes.light.colors.secondary }"></div>
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.fondo2 {
  position: relative;
  z-index: 100;
}

.title-area-blogs{
  font-size: clamp(1.4rem, 4vw, 2.7rem);
  font-weight: 800;
  margin-top: -250px;
}
.description-area-blogs {
  font-size: clamp(0.7rem, 2vw, 1rem);
  font-weight: 300;
  max-width: 70%;
}

.col-imagenes {
  border-radius: 250px 250px 0 0;
  margin-top: -265px;
}

.cuadro7 {
    right: 0;
    width: 100%;
    bottom: -100px;
    height: 100px;
    z-index: -1;
    border-radius: 0 0 250px 250px;
    position: absolute;
}


@media (max-width: 960px) {

  .col-imagenes {
    border-radius: 250px 250px 0 0;
    margin-top: -165px;
  }
  .title-area-blogs{
    margin-top: -160px;
  }

  
}
@media (max-width: 600px) {
  .col-imagenes {
    border-radius: 250px 250px 0 0;
    margin-top: -165px;
  }
  .title-area-blogs{
    margin-top: -160px;
  }

  .img-principal{
    margin-left: 19px;
  }

  .img-secundaria {
    margin-left: 140px;
    margin-top: -100px;
  }

}
</style>
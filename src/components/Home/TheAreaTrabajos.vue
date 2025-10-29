<template>
  <v-row >
    <v-col cols="6" class="col-imagenes" >
      
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
    <v-col cols="6" class="fondo-area-work" style="border-radius: 35% 35% 0 0;" :style="{ backgroundColor: $vuetify.theme.themes.light.colors.secondary }">
      
      <h2 class="title-area-blogs"  v-motion-slide-visible-bottom>
        Seccion de <span class="span-text">Blogs</span>
      </h2>
      <p class="text-grey description-area-blogs"  v-motion-slide-visible-bottom>
        Podras encontrar variedad de blogs<br>
        creados por tus maestros <br>
      </p>

       <v-btn :to="'/listaBlogs'" class="text-none btn-area-blogs text-white mt-14" color="black" min-width="92" rounded v-motion-slide-visible-bottom>
          Explorar
        </v-btn>


    </v-col>
    
  </v-row>
</template>

<style scoped lang="scss">
.fondo2 {
  z-index: 100;
}

.fondo-area-work{
    z-index: 100;
    max-width: 100%;
    padding-top: 6%;
    padding-left: 10%;
}

.title-area-blogs{
  font-size: clamp(1.2rem, 4vw, 2.7rem);
  font-weight: 800;
}
.description-area-blogs {
  font-size: clamp(0.7rem, 2vw, 1rem);
  font-weight: 300;
  max-width: 70%;
}

.col-imagenes {
  border-radius: 250px 250px 0 0;
  z-index: 1;
}

.cuadro7 {
    right: 0;
    width: 100%;
    bottom: -100px;
    height: 100px;
    z-index: -1;
    border-radius: 0 0 250px 250px;
}


@media (max-width: 960px) {
  .fondo-area-work{
    width: 500px;
  }
  
}
@media (max-width: 600px) {


  .img-principal{
    margin-left: 19px;
  }

  .img-secundaria {
    margin-left: 125px;
    margin-top: -100px;
  }

  .btn-area-blogs{
    margin-top: 30px !important;
    margin-bottom: 50px;
    z-index: 100;
  }
}
</style>
<template>
  <div class="cuadro7">

  </div>
  <v-row class=" mb-16 pb-16" v-motion-slide-visible-bottom>
    <v-col cols="7">
      <v-row>
        <v-col cols="8">
          <v-img src="\sin_foto.jpeg" max-height="600" contain class="CRT mt-10" />
        </v-col>
        <v-col cols="4">
          <v-img src="\sin_foto.jpeg" max-height="200" contain class="mt-10 ml-n2" style="border-radius: 10%" />
          <v-img src="\sin_foto.jpeg" max-height="400" contain class="mt-5"
            style="margin-left: -120px; border-radius: 10%" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="5" class="fondo2">
      <h2 class="CRT mt-16">
        Seccion de Blogs
      </h2>
      <p class="text-grey CRT">
        Podras encontrar variedad de blogs<br>
        creados por tus maestros <br>
      </p>

    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
.fondo2 {
  z-index: 100;
}

.cuadro7 {
  position: absolute;
  right: 0;
  background: white;
  width: 47.3%;
  height: 400px;
  border-radius: 0 0 250px 250px;
}
</style>

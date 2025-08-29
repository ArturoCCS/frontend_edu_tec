<template>
  <div style="height: 670px; width: 100%;">
    <v-row class="texto">
      <v-col cols="6" class="CG" v-motion-slide-right>
        <p class="text-black CT title-init" style="font-weight: 800; font-size: 40px">
          Bienvenido a tu portal
        </p>

        <h1 class="text-black CT title-init" style="font-weight: 800; font-size: 40px">
          <span>educativo</span> TECNM
        </h1>
        <br>
        <p class="text-grey CT descrip-init" style="max-width: 900px;">
          Encuentra recursos actualizados, recomendaciones de lecturas herramientas para organizar tus estudios.
          Nuestro catálogo de libros educativos y blocs escolares está diseñado
          para acompañar tu proceso <br> de enseñanza y aprendizaje, brindando calidad y variedad.
        </p>
      </v-col>

      <v-col cols="6" class="CG">
        <v-col class="images">
          <div class="logo-tecnm">
            <v-img src="/tecnm.png" contain style="
              width: 20%;
              height: 20%;
              top: -20px;
              left: -95px;
              z-index: 100;
              " />
          </div>

          <div class="book-3d-wrapper" :key="bookKey" v-motion-slide-visible-right>
            <Book3D :width="260" :height="340" :thickness="48" pagesColor="#fbf8ef" edgeColor="#e8e2d4"
              coverImage="https://images.unsplash.com/photo-1711185901036-f7fd98e50bb1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              backCoverImage="" :hoverOpen="true" :interactiveTilt="true">

              <template #cover>
                <div style="display:flex; height:100%; align-items:flex-end; color:white">
                  <div>
                    <small>Autor Desconocido</small>
                  </div>
                </div>
              </template>

            </Book3D>
          </div>

          <div class="cuadro90">


          </div>
        </v-col>
      </v-col>
    </v-row>



    <div class="cuadro1"></div>
    <div class="cuadro2"></div>
    <div class="cuadro3" :style="{ background: $vuetify.theme.themes.light.colors.primary }"></div>
  </div>
</template>

<script setup>

import Book3D from '../Utils/Book3D.vue';
</script>
<script>


export default {
  data() {
    return {
      navigating: false
    }
  },
  methods: {
    exploreBooks() {
      this.navigating = true;
      setTimeout(() => {
        this.navigating = false;
      }, 1000);
    }
  }
}
</script>

<style>
@media (max-width: 960px) {
  .logo-tecnm {
    margin-left: 100px;
    margin-right: 10px;
  }

  .descrip-init {
    font-size: 12px;
  }

  .title-init {
    font-size: 27px !important;
  }
}

@media (max-width: 600px) {
  .logo-tecnm {
    display: none;
  }

  .images {
    display: none;
  }
}

.CG {
  margin-top: 50px;
}

.CT {
  margin-left: 50px;
}

.texto {
  position: absolute;
  z-index: 100;
}

.cuadro3 {
  position: absolute;
  top: 470px;
  width: 596px;
  height: 127px;
  border-radius: 500px 0 0 0;
}

.cuadro2 {
  top: 422px;
  width: 175px;
  height: 120px;
  background: #ffffff;
  z-index: 100;
}

.cuadro1 {
  top: 0px;
  width: 593px;
  height: 470px;
  background: #ffffff;
  border-radius: 0 0 150px 0;
}

.cuadro90 {
  position: absolute;
  right: 0;
  top: 300px;
  background: rgb(239 242 241);
  width: 43%;
  height: 260px;
  border-radius: 40px;
  opacity: 0.8;
  background-image: radial-gradient(#0a0e5a 0.5px, transparent 0.5px), radial-gradient(#0f1245 0.5px, #e5e5f700 0.5px);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.book-3d-wrapper {
  rotate: 5grad;
  position: relative;
  margin-top: -60px;
  margin-left: -50px;
  z-index: 50;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 960px) {
  .book-3d-wrapper {
    margin-left: 0;
    margin-top: 30px;
    min-height: 300px;
  }
}

@media (max-width: 600px) {
  .book-3d-wrapper {
    min-height: 250px;
  }
}
</style>

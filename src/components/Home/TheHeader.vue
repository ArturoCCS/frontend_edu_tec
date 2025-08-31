<template>
  <div>

    <v-row>

      <v-col cols="6" class="CG  texto" v-motion-slide-right >
        <p class="text-black title-init" >
          Bienvenido a tu portal
        </p>

        <h1 class="text-black title-init" >
          <span>educativo</span> TECNM
        </h1>
        <br>
        <p class="text-grey descrip-init" style="max-width: 900px;">
          Encuentra recursos actualizados, recomendaciones de lecturas herramientas para organizar tus estudios.
          Nuestro catálogo de libros educativos y blocs escolares está diseñado
          para acompañar tu proceso de enseñanza y aprendizaje, brindando calidad y variedad.
        </p>
      </v-col>

      <v-col  cols="6"
        class="CG">
         <v-row>
          
            <v-col cols="10">
              <div class="book-3d-wrapper" :key="bookKey" v-motion-slide-visible-right 
                  contain style="
                    left: 30%;
                    top: 12%;
                  ">
                <Book3D
                  :width="bookSize.width"
                  :height="bookSize.height"
                  :thickness="bookSize.thickness"
                  pagesColor="#fbf8ef"
                  edgeColor="#e8e2d4"
                  coverImage="/Milibro.png"
                  backCoverImage=""
                  :hoverOpen="true"
                  :interactiveTilt="true"
                    
                >
                </Book3D>
              </div>

              <div class="cuadro90">


              </div>
              </v-col>
          </v-row>
      </v-col>
    </v-row>

   



      <div class="cuadro1" :style="{ background: $vuetify.theme.themes.light.colors.secondary }">
            <v-img src="/tecnm.png" class="logo-tecnm"
            contain style="
                width: 20%;
                height: 20%;
                left: 90%;
                top: 12%;
                z-index: 100;
                " />
      </div>
      <div style="position: relative;">
        <div class="cuadro2"  :style="{ background: $vuetify.theme.themes.light.colors.secondary }"></div>
        <div class="cuadro3" :style="{ background: $vuetify.theme.themes.light.colors.primary }"></div>
      
      </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Book3D from '../Utils/Book3D.vue';

const windowWidth = ref(window.innerWidth);

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener('resize', handleResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const bookSize = computed(() => {
  if (windowWidth.value < 600) {
    return { width: 150, height: 220, thickness: 0 };
  } else if (windowWidth.value <= 960) {
    return { width: 180, height: 240, thickness: 0 };
  } else if (windowWidth.value >= 961)  {
    return { width: 260, height: 340, thickness: 0 };
  }
});
</script>
<style>
.CG {
  margin-top: 50px;
}

.CT {
  margin-left: 50px;
}

.texto {
  z-index: 100;
}

.cuadro3 {
  position: absolute;
  top: 20px;
  left: -5px;
  width: 70%;
  height: 140px;
  border-radius: 140px 0 0 0;
}

.cuadro2 {
  width: 175px;
  height: 120px;
}

.cuadro1 {
  position: absolute;
  top: 0px;
  width: 58%;
  height: 470px;
  border-radius: 0 0 150px 0;
}

.cuadro90 {
  position: absolute;
  right: 0;
  top: 300px;
  background: rgb(239 242 241);
  width: 30%;
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
  z-index: 50;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-init {
  font-size: clamp(1.4rem, 4vw, 2.7rem);
  font-weight: 800;
  
  margin-left: 50px;
}
.descrip-init {
  font-size: clamp(0.7rem, 2vw, 1rem);
  
  margin-left: 50px;
}

@media (max-width: 960px) {



  
  .logo-tecnm {
    width: 30% !important;
    left: 85% !important;
    top: 20% !important;
  } 

  .cuadro1{
    width: 68%;
  }

  .book-3d-wrapper {
    left: -10% !important;
    top: 40% !important;
  }

  .title-init {
  margin-left: 40px;
}
.descrip-init {
  margin-left: 40px;
}

}

@media (max-width: 600px) {
  /* .book-3d-wrapper {
    min-height: 250px;
    right: 50px;
    top: -450px;
  }*/
  
  .logo-tecnm {
    width: 30% !important;
    left: 85% !important;
    top: 30% !important;
  } 

  .cuadro90 {
    display: none;
  }

  
  .cuadro1{
    width: 75%;
  }

  .book-3d-wrapper {
    left: -35% !important;
    top: 65% !important;
  }

.title-init {
  margin-left: 30px;
}
.descrip-init {
  margin-left: 30px;
}



}
</style>

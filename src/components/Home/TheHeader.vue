<template>
  <div>
    
  </div>
    <v-row style="margin-bottom: 140px;">
      <v-col cols="7" class="fondo40  texto" v-motion-slide-right >
        <h1 class="title-init" >
          <span class="span-text">Comparte</span>
          <br> Conocimiento
          Crea <span class="span-text">Contenido</span>
        </h1>

        
        <br>
        <p class="descrip-init">
          Encuentra recursos creados por docentes y estudiantes.
          
          <br>No solo consume: comparte guías, resúmenes y experiencias, forma parte de esta comunidad.
        </p>
        <button>

        </button>
        <v-btn :to="'/'" class="text-none text-white mx-11 mt-10 btn-init" color="#0f2133" min-width="92" rounded v-motion-slide-visible-left>
          Explorar
        </v-btn>

        
      <div style="position: absolute;">

          <svg class="cuadro2" width="200" height="200" viewBox="0 0 200 200">
    <path d="M0,0 Q0,200 200,200 L0,200 Z" fill="white"/>
  </svg>
      
      </div>
      </v-col>
            <div style="    
    left: 105%;
    top: 30px;">
            <v-img src="/tecnm.png" class="logo-tecnm"
            contain style="
                width: 20%;
                height: 20%;
                left: 0%;
                top: 12%;
                z-index: 100;
                " />
      </div>
      <v-col  cols="5"
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

              </v-col>
          </v-row>
      </v-col>
    </v-row>
</template>

<script setup>

import { useAuthStore } from '@/stores/authStore.js';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Book3D from '../Utils/Book3D.vue';

const authStore = useAuthStore();

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

.fondo40{
  padding-top: 50px;
  top: 0px;
  width: 58%;
  height: 15.1%;
  border-radius: 0 0 150px 0;
  background: white;
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
  transform: rotate(90deg);
  margin-top: 5px;
 
}

.cuadro1 {

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
  color: #0f2133;
  font-size: clamp(1.2rem, 4.5vw, 4.7rem);
  line-height: 1.2;
  margin-left: 45px;
  font-family: "Work Sans", sans-serif;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
}
.descrip-init {
  padding-right: 130px;
  max-width: 800px;
  font-size: clamp(0.7rem, 2vw, 1rem);
  margin-left: 50px;
  line-height: 1.8;
  color: #6f6f6f !important;
}
.span-text{
  color: #241f93  !important;
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

  .title-init,
  .descrip-init {
    margin-left: 40px;
  }


}


@media (max-width: 555px) {

   
  .logo-tecnm {
    width: 30% !important;
    left: 85% !important;
    top: 30% !important;
  } 

  .cuadro2{
    width: 70%;
    margin-top: -30px;
  }
  .book-3d-wrapper {
    left: -15% !important;
    top: 40% !important;
  }

  .title-init, .descrip-init {
    margin-left: 30px;
  }
  .descrip-init {
    padding: 0;
  }

  .btn-init{
    margin-top: 30px !important;
    margin-left: 30px !important;
    z-index: 100;
  }

}

</style>

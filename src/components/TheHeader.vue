<template>
  <div style="height: 670px; width: 100%;">
  
    <v-row class="texto">
      <v-col
        cols="7"
        class="CG"
      >
    <h1 ref="animatedText" class="text-black CT"
          style="font-weight: 700; font-size: 54px">
      
      ¡Welcome!
    </h1>
        
        <br>
        <h1
          class="text-black CT"
          style="font-weight: 700; font-size: 54px"
        >
          Title
        </h1>
        <p class="text-grey CT">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore recusandae nostrum sunt molestiae atque, <br>
          quisquam modi ullam. Blanditiis dolorem dolores saepe hic assumenda! Minima qui nostrum vel et! Commodi, tempore?
        </p>
        <v-btn
          class="text-none mt-10 mr-5 CT"
          color="black"
          min-width="92"
          rounded
        >
          Lorem
        </v-btn>
        <v-btn
          class="text-none mt-10"
          color="black"
          min-width="92"
          variant="outlined"
          rounded
        >
          lorem
        </v-btn>
      </v-col>
      <v-col
        cols="8"
        class="CD"
      >
        <div
          style="
            background: url('/sin_foto.jpeg');
            top: 0;
            left: 400px;
            width: 255px;
            height: 217px;
            background-repeat: no-repeat;
            position: absolute;
            margin-left: 600px;
            margin-top: 400px;
            z-index: 100;
          "
        />
        <v-img
          src="/sin_foto.jpeg"
          max-height="500"
          contain
          style="
            top: -400px;
            left: 600px;
          "
        />
        
      </v-col>
    </v-row>
      
      <div class="cuadro1">

      </div>
      <div class="cuadro2">

      </div>
      <div class="cuadro3" :style="{background: $vuetify.theme.themes.light.colors.primary}">

      </div>

   
  </div>

</template>


<script setup>
import anime from 'animejs';
import { onMounted } from 'vue';

onMounted(() => {
  anime({
    targets: '.text-black',
    translateY: [-100, 0],
    opacity: [0, 1],
    easing: 'easeOutExpo',
    duration: 1000,
  });
});
</script>

<style>
.CG {
  margin-top: 50px;
}
.CT {
  margin-left: 50px;
}

.texto{
  position: absolute;
  z-index: 100;
}

  .cuadro3 {
    
    position: absolute;
    top: 470px;
    width: 596px;
    height: 127px;
    border-radius: 500px 0 0 0;
    -webkit-border-radius: 500px 0 0 0;
    -moz-border-radius: 500px 0 0 0;
    -ms-border-radius: 500px 0 0 0;
    -o-border-radius: 500px 0 0 0;
}
.cuadro2{
    top: 422px;
    width: 175px;
    height: 120px;
    background: #ffffff;
    z-index: 100;
  }
  
  .cuadro1{
    top: 0px;
    width: 593px;
    height: 470px;
    background: #ffffff;
    border-radius: 0 0 150px 0 ;
    -webkit-border-radius: 0 0 150px 0 ;
    -moz-border-radius: 0 0 150px 0 ;
    -ms-border-radius: 0 0 150px 0 ;
    -o-border-radius: 0 0 150px 0 ;
}
</style>

<template>

  <div style="height: 720px; width: 100%;" :style="{ background: $vuetify.theme.themes.light.colors.primary }">
    <div class="cuadro5" :style="{ background: $vuetify.theme.themes.light.colors.secondary }"></div>
    <v-row>
      <v-col cols="5" style="position: relative; z-index: 2;">

        <iframe
         v-motion-slide-visible-right 
          class="video-iframe"
          src="https://www.youtube.com/embed/g5t8XqXg8mw?si=35OteMVpegcw74lj" title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </v-col>
      <v-col cols="7" v-motion-slide-visible-bottom>
        <h1 class="title-area-videos">
          Videos <span class="span-text"> Educativos</span>
        </h1>
        <br>
        <p class="description-area-videos">
          En nuestra portal TECNM, podras acceder a recursos audiovisuales actualizados para potenciar tu aprendizaje y colaborar con la comunidad académica. 
          <br>
          <br>
          Encuentra el contenido que necesitas para tu formación, y contribuye con tus propios materiales para apoyar a otros estudiantes y educadores.
        </p>

        <v-row>
          <v-col v-for="(cho, i) in chooses" :key="i" 
          class="col-video"
          v-motion-slide-visible-left
          >
            <v-card class="mx-auto my-8" max-width="345" color="transparent" flat>
              <v-card-item>
                <v-card-title class="title-card-videos">
                  {{ cho.title }}
                </v-card-title>
              </v-card-item>

              <v-card-text class="description-card-videos">
                {{ cho.desciption }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-btn :to="'/listaBlogs'" class="text-none btn-area-video text-white mx-11" color="#0f2133" min-width="92" rounded v-motion-slide-visible-left>
          Explorar
        </v-btn>
      </v-col>
      
    </v-row>
  </div>
</template>
<script>
export default {
  data: () => ({
    model: null,
    chooses: [

      {
        title: "Blogs",
        desciption:
          "Dentro de los blogs, los docentes pueden compartir sus contenidos y visualizarlos.",
      },
      {
        title: "Explora",
        desciption:
          "Podras encontrar blogs donde mostramos más sobre las carreras",
      },
    ],
  }),
};
</script>
<style scoped lang="scss">
.icon {
  margin: 2px 1px;
}

.video-iframe{
  width: 400px; 
  height: 230px; 
  max-width: 110%;
  margin-left: 50px; 
  margin-top: 90px; 
  border-radius: 16px; 
  background: #000; 
  object-fit: cover; 
  z-index: 2; 
  position: relative;
}

.cuadro5 {
  position: absolute;
  left: 0;
  width: 40%;
  height: 450px;
  border-radius: 0 150px 150px 0;
  z-index: 1;
  pointer-events: none;
}

.title-area-videos{
  color:#0f2133;
  font-size: clamp(1.2rem, 4vw, 2.7rem);
  font-weight: 800;
  margin-left: 50px;
  
}
.description-area-videos {
  font-size: clamp(0.7rem, 2vw, 1rem);
  color: #6f6f6f;
  margin-left: 50px;
  max-width: 70%;
}

.title-card-videos{
  color:#0f2133;
  font-size: clamp(0.4rem, 4vw, 1.7rem);
  font-weight: 600;
  
}
.description-card-videos {
  font-size: clamp(0.3rem, 2vw, 1rem);
  color: #6f6f6f;
}

.col-video {
  margin-left: 35px;
}

@media (min-width: 1200px) {
  .video-iframe{
  margin-left: 30%; 
  width: 70%;
}

}
@media (max-width: 960px) {
  .title-area-videos{
    margin-left: 30px;
  }
  .description-area-videos {
    margin-left: 30px;
  }

  .video-iframe{
    
    max-height: 200px;
    margin-left: 5px; 
    margin-top: 95px; 
  }
}
@media (max-width: 600px) {
  .title-area-videos{
    margin-left: 20px;
    margin-right: 20px;
    
  }
  .description-area-videos {
    margin-left: 20px;
    margin-right: 10px;
    max-width: 180px;
  }
  .video-iframe{
    max-height: 25%;
    margin-top: 140px;
  }

  .col-video {
    margin-left: 4px;
    min-width: 190px;
  }
  .btn-area-video{
    margin-left: 21px !important;
  }
}
</style>
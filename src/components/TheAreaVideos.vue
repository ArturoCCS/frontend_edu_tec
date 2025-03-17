<template>
  
  <div style="height: 680px; width: 100%; background: white;">
  <div class="cuadro5" :style="{background: $vuetify.theme.themes.light.colors.primary}" ></div>
  <v-row>
    <v-col cols="7">
      <h1 class="CRT">
        Area de videos
      </h1>
      <p class="text-grey CRT">
        lorem ipsum, dolor sit amet consectetur <br>
        lorem ipsum, dolor sit amet consectetur adipisicing elit.
      </p>
  
      <v-row>
        <v-col
          v-for="(cho, i) in chooses"
          :key="i"
          style="
          margin-left: 85px;
        "
          cols="3"
        >
          <v-card
            class="mx-auto my-8"
            max-width="345"
            color="transparent"
            flat
          >
            <v-card-item>
              <v-icon
                :class="cho.icon"
                class="icon"
                color=""
              />
              <v-card-title>
                {{ cho.title }}
              </v-card-title>
            </v-card-item>

            <v-card-text class="text-grey">
              {{ cho.desciption }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-btn
      class="text-none text-white mt-10 mr-5 CRT"
      color="black"
      min-width="92"
      rounded
    >
      Explorar
    </v-btn>
    </v-col>
    <v-col cols="5">
      <v-img
        src="\sin_foto.jpeg"
        max-height="450"
        contain
        style="
          width: 300px;
          margin-left: -120px;
          margin-top: 70px;
        "
      />
    </v-col>
  </v-row>
  <div class="cuadro6" :style="{background: $vuetify.theme.themes.light.colors.primary}"></div>
  </div>
</template>
<script>
export default {
  data: () => ({
    model: null,
    chooses: [
      
      {
        title: "Bla bla bla",
        icon: "fa-brands fa-readme",
        desciption:
          "lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      },
      {
        title: "Bla bla bla",
        icon: "fab fa-youtube",
        desciption:
          "lorem ipsum, dolor sit amet consectetur adipisicing elit.",
      },
    ],
  }),
};
</script>
<style scoped lang="scss">
.icon {
  margin: 2px 2px;
}
.cuadro5{
  position: absolute;
  right: 0;
  width: 40%;
  height: 450px;
  border-radius: 150px 0 0 150px;
}

.cuadro6{
  margin-top: 50px;
  width: 50%;
  height: 300px;
  border-radius: 250px 250px 0 0;
}
</style>

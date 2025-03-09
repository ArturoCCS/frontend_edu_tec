<template>
  <v-row class="mt-16">
    <v-col cols="7">
      <h1 class="CRT mt-16">
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
          cols="6"
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
    </v-col>
    <v-col cols="5">
      <div
        class=""
        style="
          background: url('dots-yellow.svg');
          width: 255px;
          height: 217px;
          background-repeat: no-repeat;
          position: absolute;
          margin-left: -100px;
          margin-top: -30px;
        "
      />
      <v-img
        src="\sin_foto.jpeg"
        max-height="550"
        contain
        class="mr-12 mt-10"
      />
    </v-col>
  </v-row>
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
</style>

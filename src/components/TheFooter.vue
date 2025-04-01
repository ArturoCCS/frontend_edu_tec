<template>
  <v-footer class="">
    <v-row
      justify="center"
      no-gutters
      class="mt-16"
    >
      <v-col cols="5" />
      <v-col cols="6">
        <v-img
          src="\petirrojo.jpg"
          cover
          max-height="200"
          max-width="200"
          min-height="50"
          min-width="50"
          style="margin-top: -150px; margin-left: 50%; margin-bottom: 25px"
        />
      </v-col>
      <v-col cols="12">
        <h1 style="color: #344d43; margin-left: 40px; margin-top: -100px">{{ title }}
        </h1>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="4">
            <p class="text-grey ml-10">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum vero perspiciatis molestias dolore veniam ex, aliquid error nostrum recusandae aut, dolor quod maxime eos dignissimos animi dolorem nobis quos inventore.
            </p>
            <div>
              <div class="ml-8 mt-5">
                <v-btn
                  v-for="icon in icons"
                  :key="icon"
                  :icon="icon.icon"
                  :href="icon.link"
                  target="_blank"
                  class="mx-1"
                  color="#EFF2F1"
                />
              </div>
            </div>
          </v-col>
          <v-col cols="2">
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
          </v-col>
          <v-col cols="2">
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
          </v-col>
          <v-col cols="2">
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
          </v-col>
          <v-col cols="2">
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
            <p class="text-grey">
              Lorem ipsum
            </p>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        class="text-center mt-4"
        cols="12"
      >
        <v-divider class="mx-10" />
      </v-col>
      <v-col cols="12">
        <v-row class="my-12 px-16">
          <v-col cols="8">
            <p class="text-grey">
            </p>
          </v-col>
          <v-col cols="4">
            <p class="text-grey">
            </p>
          </v-col>
        </v-row>
      </v-col>
      <div class="px-4 py-4 bgCol text-center w-100 text-white" />
    </v-row>
  </v-footer>
</template>

<script setup>
const title = import.meta.env.VITE_APP_TITLE;
</script>
<script>
export default {
  data: () => ({
    icons: [
      {
        icon: "fab fa-facebook-f",
        link: "https://es-la.facebook.com/people/TECNM-Zit%C3%A1cuaro/100063907755710",
      },
      {
        icon: "fab fa-twitter",
        link: "https://x.com/TecNM_MX",
      },
      {
        icon: "fab fa-youtube",
        link: "https://www.youtube.com/channel/UCN7UBgypHOFEl17AoXaETJw/featured",
      }
    ],
  }),
};
</script>

  <style>
.v-footer {
  padding: 0 0 !important;
}
.bgCol {
  background-color: #eff2f1;
}
.bgTop {
  background-color: #111111;
}
.bgMidum {
  background-color: #1f1f1f;
}
</style>


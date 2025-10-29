<template>
  <v-footer class="">
    <v-row justify="center" no-gutters class="mt-16 footer-content">
      <v-col cols="5" />
      <v-col cols="6">
        <v-img src="\petirrojo.jpg" cover max-height="200" max-width="200" min-height="50" min-width="50"
          style="margin-top: -150px; margin-left: 50%; margin-bottom: 25px; z-index: 200;" />
      </v-col>
      <v-col cols="12">
        <h1 style=" margin-left: 40px; margin-top: -100px">{{ title }}
        </h1>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="6">
            <div class="text-grey ml-10">
              <h3>Dirección</h3>
              Av. Tecnológico No. 186 Manzanillos C.P. 61534, H. Zitácuaro, Michoacán, México.

              <br>
              <br>
              <h3>Contacto</h3>


              Email: dir_zitacuaro@tecnm.mx

              Tel. (715) 690-9001

              www.tecnm.mx

              zitacuaro.tecnmx.mx
            </div>
            <div>
              <div class="ml-8 mt-10 footer-icons">
                <v-btn v-for="icon in icons" :key="icon" :icon="icon.icon" :href="icon.link" target="_blank" color="#232323"
                  class="mx-1" :style="{ color: $vuetify.theme.themes.light.colors.primary }" />
              </div>
            </div>
          </v-col>
      
        </v-row>
      </v-col>
      <v-col class="text-center mt-4" cols="12">
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
 
      <div :style="{ '--primary': $vuetify.theme.themes.light.colors.primary }" class="px-4 py-4 bgCol text-center w-100 text-white" />
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
  background-color: var(--primary);
}

.bgTop {
  background-color: #111111;
}

.bgMidum {
  background-color: #1f1f1f;
}

.footer-icons {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
}

@media (max-width: 600px) {
  .footer-content {
    padding-top: 50px;
  }
  .footer-icons {
    justify-content: flex-start;
    gap: 6px;
  }
}
</style>

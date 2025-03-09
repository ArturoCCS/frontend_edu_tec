<template>
  <v-row class="mb-16 pb-16">
    <v-col cols="12">
      <v-row class="px-16 mt-16">
        <v-col cols="4" v-for="(mode, i) in moders" :key="i">
          <v-card color="transparent" flat class="mx-auto">
            <v-row>
              <v-col cols="4">
                <div
                  class="bg-green-lighten-2 rounded-lg mx-auto"
                  style="
                    height: 120px;
                    width: 120px;
                    margin-top: 10px;
                    opacity: 0.4;
                  "
                >
                  <v-img :src="mode.avatar" cover> </v-img>
                </div>
              </v-col>
              <v-col cols="8">
                <v-card-item>
                  <div>
                    <div class="text-h6 mb-1">
                      {{ mode.title }}
                    </div>
                    <div class="text-caption">
                      {{ mode.obs }} {{ mode.obs1 }}
                    </div>
                  </div>
                </v-card-item>
                <v-card-actions>
                  <v-btn> Read More </v-btn>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    model: null,
    moders: [
      {
        title: "Nordic Chair",
        avatar: "sin_foto.jpeg",
        obs: "Donec facilisis quam ut purus rutrum",
        obs1: "lobortis. Donec vitae ",
      },
      {
        title: "Kruzo Aero Chair",
        avatar: "sin_foto.jpeg",
        obs: "Donec facilisis quam ut purus rutrum",
        obs1: "lobortis. Donec vitae ",
      },
      {
        title: "Ergonomic Chair",
        avatar: "sin_foto.jpeg",
        obs: "Donec facilisis quam ut purus rutrum",
        obs1: "lobortis. Donec vitae ",
      },
    ],
  }),
};
</script>
<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.6;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>

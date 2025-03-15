<template>
  <div style="height: 611px; width: 100%; background-color: #132f53">
    <NavBar />
    <v-row>
      <v-col
        cols="5"
        class="CG"
      >
        <h1
          class="text-white CT"
          style="font-weight: 700; font-size: 54px"
        >
          Text
        </h1>
        <br>
        <h1
          class="text-white CT"
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
          color="white"
          min-width="92"
          variant="outlined"
          rounded
        >
          lorem
        </v-btn>
      </v-col>
      <v-col
        cols="7"
        class="CD"
      >
        <div
          style="
            background: url('dots-light.svg');
            width: 255px;
            height: 217px;
            background-repeat: no-repeat;
            position: absolute;
            margin-left: 500px;
            margin-top: 50px;
          "
        />
        <v-img
          src="/sin_foto.jpeg"
          max-height="500"
          contain
          class="mb-n16 mr-10"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import NavBar from './NavBar.vue';
</script>

<script>
export default {
  data: () => ({
    tab: null,
  }),
};
</script>

<style>
.CG {
  margin-top: 100px;
}
.CT {
  margin-left: 150px;
}
</style>

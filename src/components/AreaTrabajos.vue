<template>
  <v-row class="mt-16 mb-16 pb-16">
    <v-col cols="7">
      <v-row>
        <v-col cols="8">
          <div
            class=""
            style="
              background: url('dots-green.svg');
              width: 255px;
              height: 217px;
              background-repeat: no-repeat;
              position: absolute;
              margin-left: 0px;
              margin-top: -30px;
            "
          />
          <v-img
            src="\sin_foto.jpeg"
            max-height="600"
            contain
            class="CRT mt-10"
          />
        </v-col>
        <v-col cols="4">
          <v-img
            src="\sin_foto.jpeg"
            max-height="200"
            contain
            class="mt-10 ml-n2"
            style="border-radius: 10%"
          />
          <v-img
            src="\sin_foto.jpeg"
            max-height="400"
            contain
            class="mt-5"
            style="margin-left: -120px; border-radius: 10%"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="5">
      <h2 class="CRT mt-16">
        Area de trabajos
      </h2>
      <p class="text-grey CRT">
        Crea diferentes espacios de trabajo<br>
        personales o en equipo<br>
      </p>
      <v-row>
        <v-col cols="6">
          <v-row class="mt-6">
            <v-col cols="2">
              <v-icon
                class="far fa-circle"
                size="x-small"
              />
            </v-col>
            <v-col cols="10">
              <p class="text-grey">
                Gestiona tareas<br>
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row class="mt-6">
            <v-col cols="2">
              <v-icon
                class="far fa-circle"
                size="x-small"
              />
            </v-col>
            <v-col cols="10">
              <p class="text-grey">
                Asigna tareas<br>
                dapibus malesuada
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row class="">
            <v-col cols="2">
              <v-icon
                class="far fa-circle"
                size="x-small"
              />
            </v-col>
            <v-col cols="10">
              <p class="text-grey">
                Bla bla<br>
                bla bal
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <v-row class="">
            <v-col cols="2">
              <v-icon
                class="far fa-circle"
                size="x-small"
              />
            </v-col>
            <v-col cols="10">
              <p class="text-grey">
                Bla bla<br>
                bla bal
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-btn
        class="text-none text-white mt-10 mr-5 CRT"
        color="black"
        min-width="92"
        rounded
      >
        Explore
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>

</script>

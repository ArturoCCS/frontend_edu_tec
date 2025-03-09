<template>
  <v-row class="mt-16">
    <v-col cols="5">
      <h1 class="CRT mt-16">Explorar los libros</h1>
      <h1 class="CRT">en la plataforma</h1>
      <p class="text-grey CRT">
        Podras encontrar los mejores libros. <br />
        sobre bla bla bla bla bla bla bla bla<br />
        descarga, comenta y puntua<br />
        los libros que más te gusten.
      </p>
      <v-btn
        class="text-none text-white mt-10 mr-5 CRT"
        color="black"
        min-width="92"
        rounded
      >
        Explorar
      </v-btn>
    </v-col>
    <v-col cols="7">
      
      
      <h3 class="mt-16">Libros destacados</h3>
      <v-row>
        <v-col cols="4" v-for="(cli, i) in clients" :key="i">
          <div>
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                class="mx-auto"
                color="transparent"
                max-width="600"
                v-bind="props"
                flat
              >
                <v-img :src="cli.avatar" cover> </v-img>
                <v-expand-transition>
                  <div
                    v-if="isHovering"
                    class="d-flex transition-fast-in-fast-out bg-green-lighten-2 v-card--reveal text-h2"
                    style="height: 70%"
                  >
                    <v-btn
                      icon="fa-solid fa-book"
                      color="black"
                      style="z-index: 9999"
                    ></v-btn>
                  </div>
                </v-expand-transition>

                <v-card-text class="pt-6">
                  <h5 class="text-h5 font-weight mb-2 text-center">
                    {{ cli.title }}
                  </h5>
                  <div
                    class="font-weight-light text-grey text-h6 mb-2 text-center"
                  >
                    {{ cli.views }} views
                  </div>

                  
                </v-card-text>
              </v-card>
            </v-hover>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    model: null,
    clients: [
      { title: "Nombre Libro 1", avatar: "sin_foto.jpeg", views: "50" },
      { title: "Nombre Libro 2", avatar: "sin_foto.jpeg", views: "78" },
      { title: "Nombre Libro 3", avatar: "sin_foto.jpeg", views: "43" },
    ],
  }),
};
</script>
<style>
.CRT {
  margin-left: 100px;
}
.v-card--reveal {
  align-items: end;
  bottom: 0;
  justify-content: right;
  opacity: 0.15;
  position: absolute;
  width: 100%;
  border-radius: 10px;
  padding: 10px;
}
</style>

<template>
  <h1>{{ title }}</h1>
  <div
    v-for="(nombreVariable, i) in comentarios"
    :key="i"
  >
    <p class="color">
      {{ nombreVariable.parrafo }}
    </p>
  </div>
  <Prueba />
  <EjemploMostrar />
</template>

<script setup>
const title = import.meta.env.VITE_NOMBRE_APP;

</script>

<script>
export default {
    data(){
        return {
            comentarios : [
                {
                    parrafo: '1 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
                },
                {
                    parrafo: '2 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
                },
                {
                    parrafo: '3 Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
                },
            ]
        }
    }
}
</script>

<style scoped lang="scss">
.color{
    color: red;
}
</style>
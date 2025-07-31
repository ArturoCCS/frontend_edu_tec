<template>
    <div v-if="blog" class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">{{ blog.Titulo }}</h1>
      <p class="mb-6">{{ blog.Descripcion }}</p>
      
      <!-- Contenedor principal con flexbox -->
      <div class="flex">
        <!-- Panel izquierdo con capítulos -->
        <div class="w-1/4 p-4 bg-gray-100 shadow-lg rounded-lg">
          <h2 class="text-xl font-semibold mb-4">Capítulos</h2>
          <ul class="space-y-4">
            <!-- Lista de capítulos -->
            <li v-for="capitulo in capitulos" :key="capitulo.ID_Capitulo">
              <button
                @click="seleccionarCapitulo(capitulo)"
                class="text-left w-full py-2 px-4 rounded hover:bg-gray-200 focus:outline-none"
              >
                {{ capitulo.Titulo }}
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Contenido central -->
        <div class="w-3/4 p-4 ml-4 bg-white shadow-lg rounded-lg">
          <div v-if="blog.Tipo === 'simple'">
            <!-- Mostrar contenido de blog simple -->
            <h2 class="text-2xl font-semibold mb-4">Contenido del Blog</h2>
            <p>{{ blog.Contenido }}</p>
          </div>
  
          <!-- Mostrar contenido para el tipo 'documentacion' -->
          <div v-else-if="blog.Tipo === 'documentacion'">
            <h2 class="text-2xl font-semibold mb-4">Contenido del Capítulo</h2>
  
            <!-- Mostrar las secciones del capítulo seleccionado -->
            <div v-if="capituloSeleccionado">
              <h3 class="text-xl font-semibold">{{ capituloSeleccionado.Titulo }}</h3>
              <p>{{ capituloSeleccionado.Descripcion }}</p>
  
              <div v-for="seccion in capituloSeleccionado.secciones" :key="seccion.ID_Seccion">
                <h4 class="text-lg font-semibold">{{ seccion.Titulo }}</h4>
                <p>{{ seccion.Contenido }}</p>
              </div>
            </div>
  
            <!-- Mensaje si no se ha seleccionado un capítulo -->
            <div v-else>
              <p class="text-gray-500">Selecciona un capítulo para ver su contenido.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const blog = ref(null)
  const capitulos = ref([])
  const capituloSeleccionado = ref(null)
  
  onMounted(async () => {
    try {
      // Obtener el blog por ID
      const { data } = await axios.get(`http://localhost:3000/plataform/${route.params.id}`)
      blog.value = data
  
      // Obtener capítulos si es un blog de documentación
      if (blog.value.Tipo === 'documentacion') {
        const { data: capitulosData } = await axios.get(`http://localhost:3000/plataform/${route.params.id}/capitulos`)
        capitulos.value = capitulosData
  
        // Obtener secciones de cada capítulo
        for (const capitulo of capitulos.value) {
          const { data: seccionesData } = await axios.get(`http://localhost:3000/plataform/capitulos/${capitulo.ID_Capitulo}/secciones`)
          capitulo.secciones = seccionesData
        }
      }
    } catch (err) {
      console.error('Error al cargar el blog:', err)
    }
  })
  
  // Función para seleccionar un capítulo y cargar su contenido
  const seleccionarCapitulo = (capitulo) => {
    capituloSeleccionado.value = capitulo
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  
  button:hover {
    background-color: #f3f4f6;
  }
  
  button:focus {
    outline: none;
    background-color: #e5e7eb;
  }
  </style>
  
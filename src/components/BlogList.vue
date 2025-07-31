<template>
    <div class="p-4 max-w-3xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Listado de Blogs</h2>
      <div v-for="blog in blogs" :key="blog.ID_Blog" class="border rounded p-3 mb-3">
        <h3 class="text-lg font-semibold">{{ blog.Titulo }}</h3>
        <p>{{ blog.Descripcion }}</p>
        <p class="text-sm text-gray-500">Tipo: {{ blog.Tipo }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
import { onMounted, ref } from 'vue'
  
  const blogs = ref([])
  
  onMounted(async () => {
    const res = await axios.get('http://localhost:3000/plataform/')
    blogs.value = res.data
  })
  </script>
  
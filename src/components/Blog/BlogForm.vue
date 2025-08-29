<template>
  <div class="max-w-2xl mx-auto p-4">
    <h2 class="text-xl font-bold mb-4">Crear Blog</h2>
    <form @submit.prevent="crearBlog">
      <input v-model="titulo" type="text" placeholder="Título" required />
      <textarea v-model="descripcion" placeholder="Descripción" required></textarea>
      <select v-model="tipo" required>
        <option value="simple">Blog Simple</option>
        <option value="documentacion">Documentación</option>
      </select>
      <button type="submit" class="btn btn-primary">Guardar</button>
    </form>
  </div>

  <div class="mt-8">
    <h2>Crear Capítulo</h2>
    <form @submit.prevent="crearCapitulo">
      <input v-model="tituloCapitulo" type="text" placeholder="Título Capítulo" required />
      <textarea v-model="descripcionCapitulo" placeholder="Descripción Capítulo" required></textarea>
      <input type="number" v-model="ordenCapitulo" placeholder="Orden" required />
      <select v-model="idBlog" @change="obtenerCapitulos" required>
        <option v-for="blog in blogs" :key="blog.ID_Blog" :value="blog.ID_Blog">{{ blog.Titulo }}</option>
      </select>
      <button type="submit">Crear Capítulo</button>
    </form>


    <h2>Crear Sección</h2>
    <form @submit.prevent="crearSeccion">
      <input v-model="tituloSeccion" type="text" placeholder="Título Sección" required />
      <textarea v-model="contenidoSeccion" placeholder="Contenido" required></textarea>
      <input type="number" v-model="ordenSeccion" placeholder="Orden" required />
      <select v-model="idCapitulo" @change="obtenerSecciones" required>
        <option v-for="capitulo in capitulos" :key="capitulo.ID_Capitulo" :value="capitulo.ID_Capitulo">{{
          capitulo.Titulo }}</option>
      </select>
      <button type="submit">Crear Sección</button>
    </form>

  </div>
</template>

<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'

const titulo = ref('')
const descripcion = ref('')
const tipo = ref('simple')

const tituloCapitulo = ref('')
const descripcionCapitulo = ref('')
const ordenCapitulo = ref(1)
const idBlog = ref('')

const tituloSeccion = ref('')
const contenidoSeccion = ref('')
const ordenSeccion = ref(1)
const idCapitulo = ref('')

const blogs = ref([])
const capitulos = ref([])

const obtenerBlogs = async () => {
  try {
    const response = await axios.get('http://localhost:3000/plataform/')
    blogs.value = response.data
  } catch (err) {
    console.error('Error al obtener blogs:', err)
  }
}

const obtenerCapitulos = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/capitulos/${idBlog.value}`)
    capitulos.value = response.data
  } catch (err) {
    console.error('Error al obtener capítulos:', err)
  }
}

const crearBlog = async () => {
  try {
    await axios.post('http://localhost:3000/plataform/', {
      Titulo: titulo.value,
      Descripcion: descripcion.value,
      Tipo: tipo.value
    })
    titulo.value = ''
    descripcion.value = ''
    tipo.value = 'simple'
    alert('Blog creado')
    obtenerBlogs()
  } catch (err) {
    console.error(err)
    alert('Error al crear blog')
  }
}

const crearCapitulo = async () => {
  try {
    await axios.post(`http://localhost:3000/plataform/${idBlog.value}/capitulos`, {
      Titulo: tituloCapitulo.value,
      Descripcion: descripcionCapitulo.value,
      Orden: ordenCapitulo.value
    });

    tituloCapitulo.value = ''
    descripcionCapitulo.value = ''
    ordenCapitulo.value = 1
    alert('Capítulo creado')
    obtenerCapitulos()
  } catch (err) {
    console.error('Error al crear capítulo:', err)
    alert('Error al crear capítulo')
  }
}

const crearSeccion = async () => {
  try {
    await axios.post(`http://localhost:3000/plataform/capitulos/${idCapitulo.value}/secciones`, {
      Titulo: tituloSeccion.value,
      Contenido: contenidoSeccion.value,
      Orden: ordenSeccion.value
    });
    tituloSeccion.value = ''
    contenidoSeccion.value = ''
    ordenSeccion.value = 1
    alert('Sección creada')
  } catch (err) {
    console.error('Error al crear sección:', err)
    alert('Error al crear sección')
  }
}

onMounted(() => {
  obtenerBlogs()
})
</script>
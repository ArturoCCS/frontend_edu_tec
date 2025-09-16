<template>
  <div v-if="blog" class="paper-sheet">

    <aside v-if="blog.Tipo === 'documentacion'" class="sidebar-nav">
      <SidebarNav :capitulos="capitulos" :capituloSeleccionado="capituloSeleccionado"
        @capituloSeleccionado="seleccionarCapitulo" />
      <ThemeSwitcher />
    </aside>
    <main class="blog-main">
      <BlogContent :blog="blog" :capitulo="capituloSeleccionado" :capitulos="capitulos" @navigate="handleNavigate" />
    </main>
    <aside class="page-sidebar">
      <PageSidebar :secciones="capituloSeleccionado?.secciones || []" />
    </aside>

  </div>
</template>

<script setup>
import BlogContent from '@/components/Blog/View/BlogContent.vue'
import PageSidebar from '@/components/Blog/View/PageSidebar.vue'
import SidebarNav from '@/components/Blog/View/SidebarNav.vue'
import ThemeSwitcher from '@/components/Blog/View/ThemeSwitcher.vue'

import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const blog = ref(null)
const capitulos = ref([])
const capituloSeleccionado = ref(null)

onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/plataform/${route.params.id}`)
    blog.value = data

    const { data: capitulosData } = await axios.get(`http://localhost:3000/plataform/${route.params.id}/capitulos`)
    capitulos.value = capitulosData

    for (const capitulo of capitulos.value) {
      const { data: seccionesData } = await axios.get(`http://localhost:3000/plataform/capitulos/${capitulo.ID_Capitulo}/secciones`)
      capitulo.secciones = seccionesData
    }

    if (blog.value.Tipo === 'documentacion') {
      if (capitulos.value.length > 0) {
        capituloSeleccionado.value = capitulos.value[0]
      }
    } else if (blog.value.Tipo === 'simple') {
      if (capitulos.value.length > 0) {
        capituloSeleccionado.value = capitulos.value[0]

      }
    }
  } catch (err) {
    console.error('Error al cargar el blog:', err)
  }
})

function handleNavigate(id) {
  const cap = capitulos.value.find(c => c.ID_Capitulo === id)
  if (cap) capituloSeleccionado.value = cap
}

const seleccionarCapitulo = (capitulo) => {
  capituloSeleccionado.value = capitulo
}
</script>
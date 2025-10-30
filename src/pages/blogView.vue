<template>
  <div v-if="blog" class="paper-sheet">

    <aside v-if="blog.Tipo === 'documentacion'" class="sidebar-nav">
      <SidebarNav :capitulos="capitulos" :capituloSeleccionado="capituloSeleccionado"
        @capituloSeleccionado="seleccionarCapitulo" />
      <ThemeSwitcher />
    </aside>

    <main class="blog-main" style="padding: 17.5px 19.5px;">
      <BlogContent :blog="blog" :capitulo="capituloSeleccionado" :capitulos="capitulos" @navigate="handleNavigate" />
    </main>

    <aside class="page-sidebar">
      <PageSidebar :secciones="capituloSeleccionado?.secciones || []" />
    </aside>
<!-- 
    <ChatbotWidget
      :blog="blog"
      :capitulos="capitulos"
      :capitulo="capituloSeleccionado"
    /> -->
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
const VITE_APP_URL_BACKEND = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:3000';

onMounted(async () => {
  try {
    const blogId = route.params.id; 
    const { data } = await axios.get(`${VITE_APP_URL_BACKEND}/plataform/${blogId}`)
    blog.value = data

    const { data: capitulosData } = await axios.get(`${VITE_APP_URL_BACKEND}/plataform/${blogId}/capitulos`)
    capitulos.value = capitulosData

    for (const capitulo of capitulos.value) {
      const { data: seccionesData } = await axios.get(`${VITE_APP_URL_BACKEND}/plataform/capitulos/${capitulo.ID_Capitulo}/secciones`)
      capitulo.secciones = seccionesData
    }

    if (blog.value.Tipo === 'documentacion' || blog.value.Tipo === 'simple') {
      if (capitulos.value.length > 0) {
        capituloSeleccionado.value = capitulos.value[0]
      }
    }
  } catch (err) {
    console.error('Error al cargar el blog:', err)
    blog.value = null; 
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
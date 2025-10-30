import { api } from '@/lib/api'
import { defineStore } from 'pinia'
const VITE_APP_URL_BACKEND = import.meta.env.VITE_APP_URL_BACKEND

function parseEdjs(data) {
  if (!data) return null
  if (typeof data === 'object') {
    if (Array.isArray(data.blocks)) return data
    if (data.content) return parseEdjs(data.content)
  }
  if (typeof data === 'string') {
    let s = data.trim()
    try {
      let x = JSON.parse(s)
      if (typeof x === 'string') {
        try {
          x = JSON.parse(x)
        } catch {}
      }
      if (x && typeof x === 'object' && Array.isArray(x.blocks)) return x
    } catch {
      if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.slice(1, -1)
        try {
          const x = JSON.parse(s)
          if (x && typeof x === 'object' && Array.isArray(x.blocks)) return x
        } catch {}
      }
    }
  }
  return null
}

export const useBlogReadStore = defineStore('blogRead', {
  state: () => ({
    nodesByBlog: new Map(),
    metaByBlog: new Map(),
    loading: false,
    error: null
  }),
  getters: {
    chapters: (state) => (blogId) => {
      const nodes = state.nodesByBlog.get(String(blogId)) || []
      return nodes
        .filter(n => n.type === 'chapter' && (n.parent_id === null || n.parent_id === undefined))
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    },
    sectionsByChapter: (state) => (blogId, chapterId) => {
      const nodes = state.nodesByBlog.get(String(blogId)) || []
      return nodes
        .filter(n => n.parent_id == chapterId && n.type === 'section')
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    },
    nodeById: (state) => (blogId, nodeId) => {
      const nodes = state.nodesByBlog.get(String(blogId)) || []
      return nodes.find(n => String(n.id_node) === String(nodeId)) || null
    }
  },
  actions: {
    async fetchNodes(blogId) {
      this.loading = true
      this.error = null

      try {
        const meta = await api.get(`${VITE_APP_URL_BACKEND}/api/blogs/${blogId}`)
        this.metaByBlog.set(String(blogId), meta.data || {})
      } catch {}

      try {
        const { data } = await api.get(`${VITE_APP_URL_BACKEND}/api/blogs/${blogId}/nodes`)
        const raw = Array.isArray(data) ? data : []
        const mapped = raw.map(n => {
          const id_node = n.id_node ?? n.ID_Seccion ?? n.ID_Capitulo ?? n.id
          const blog_id = n.blog_id ?? n.ID_Blog ?? n.blogId
          const parent_id = (n.parent_id ?? n.ID_Capitulo ?? null)
          const type = n.type ?? (n.ID_Seccion ? 'section' : 'chapter')
          const title = n.title ?? n.Titulo ?? ''
          const rawContent = n.content ?? n.ContenidoJson ?? n.Contenido ?? null
          const contentObj = parseEdjs(rawContent)
          return {
            id_node,
            blog_id,
            parent_id,
            type,
            title,
            slug: n.slug ?? null,
            contentRaw: rawContent ?? null,
            content: contentObj,
            order_index: n.order_index ?? n.Orden ?? 0,
            path: n.path ?? '',
            depth: n.depth ?? 0,
            is_published: n.is_published ?? 1
          }
        })
        this.nodesByBlog.set(String(blogId), mapped)
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || 'Error al cargar nodos'
        this.nodesByBlog.set(String(blogId), [])
      } finally {
        this.loading = false
      }
    }
  }
})
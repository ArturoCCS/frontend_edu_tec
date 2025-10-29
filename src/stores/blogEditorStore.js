import { api } from '@/lib/api';
import { defineStore } from 'pinia';

function ensureEdjsObject(val) {
  if (!val) return { time: Date.now(), blocks: [] }
  if (typeof val === 'string') {
    try { const obj = JSON.parse(val); if (obj && typeof obj === 'object') return obj } catch {}
    return { time: Date.now(), blocks: [] }
  }
  return val
}

async function createNodeApi(blogId, payload) {
  const { data } = await api.post(`/api/blogs/${blogId}/nodes`, payload)
  return data
}

export const useBlogEditorStore = defineStore('blogEditor', {
  state: () => ({ creating: false, error: null }),
  actions: {
    async createBlogWithNodes({ titulo, descripcion, tipo, id_usuario, capitulos, tree, visibilidad = 'publico', publicado = true, careers = [], subjects = [], topics = [], tags = [] }) {
      this.creating = true
      this.error = null
      try {
        const { data: created } = await api.post('/api/blogs', {
          Titulo: titulo,
          Descripcion: descripcion,
          Tipo: tipo,
          id_usuario,
          Visibilidad: visibilidad,
          Es_Publicado: publicado,
          careers,
          subjects,
          topics,
          tags
        })
        const blogId = created?.ID_Blog || created?.id || created?.ID
        if (!blogId) throw new Error('No se obtuvo ID del blog')

        if (Array.isArray(tree) && tree.length) {
          async function saveNode(node, parentId = null, order_index = 0) {
            if (node.type === 'folder') {
              const createdFolder = await createNodeApi(blogId, {
                parent_id: parentId,
                type: 'folder',
                title: node.titulo || node.title || 'Carpeta',
                slug: null,
                content: null,
                order_index,
                is_published: 1
              })
              const folderId = createdFolder?.id_node || createdFolder?.id
              for (let i = 0; i < (node.children?.length || 0); i++) {
                await saveNode(node.children[i], folderId, i)
              }
              return
            }
            if (node.type === 'chapter') {
              const capData = JSON.stringify(ensureEdjsObject(node.contenido))
              const createdChapter = await createNodeApi(blogId, {
                parent_id: parentId,
                type: 'chapter',
                title: node.titulo || 'Capítulo',
                slug: null,
                content: capData,
                order_index,
                is_published: 1
              })
              const chapterId = createdChapter?.id_node || createdChapter?.id
              for (let j = 0; j < (node.secciones?.length || 0); j++) {
                const sec = node.secciones[j]
                const secData = JSON.stringify(ensureEdjsObject(sec.data))
                await createNodeApi(blogId, {
                  parent_id: chapterId,
                  type: 'section',
                  title: sec.titulo || 'Sección',
                  slug: null,
                  content: secData,
                  order_index: j,
                  is_published: 1
                })
              }
              return
            }
          }
          for (let i = 0; i < tree.length; i++) {
            await saveNode(tree[i], null, i)
          }
        } else if (Array.isArray(capitulos) && capitulos.length) {
          for (let i = 0; i < capitulos.length; i++) {
            const cap = capitulos[i]
            const capData = JSON.stringify(ensureEdjsObject(cap.contenido))
            const c = await createNodeApi(blogId, {
              parent_id: null,
              type: 'chapter',
              title: cap.titulo || '',
              slug: null,
              content: capData,
              order_index: i,
              is_published: 1
            })
            const chapterNodeId = c?.id_node || c?.id
            for (let j = 0; j < (cap.secciones?.length || 0); j++) {
              const sec = cap.secciones[j]
              const secData = JSON.stringify(ensureEdjsObject(sec.data))
              await createNodeApi(blogId, {
                parent_id: chapterNodeId,
                type: 'section',
                title: sec.titulo || '',
                slug: null,
                content: secData,
                order_index: j,
                is_published: 1
              })
            }
          }
        }

        return { blogId }
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || 'Error al crear el blog'
        throw e
      } finally { this.creating = false }
    }
  }
})
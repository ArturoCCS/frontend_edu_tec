import { api } from '@/lib/api';
import { defineStore } from 'pinia';
const VITE_APP_URL_BACKEND = import.meta.env.VITE_APP_URL_BACKEND

export const useSectionsStore = defineStore('sections', {
  state: () => ({ sections: [], q: '', loading: false, error: null }),
  actions: {
    async fetchSections(params = {}) {
      this.loading = true; this.error = null
      try {
        const q = params.q ?? this.q ?? ''
        const { data } = await api.get(`${VITE_APP_URL_BACKEND}/api/blogs/sections`, { params: { q } })
        this.sections = Array.isArray(data) ? data.map(sec => ({
          key: sec.key,
          title: sec.title,
          items: Array.isArray(sec.items) ? sec.items : []
        })) : []
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || 'Error al cargar secciones'
        this.sections = []
      } finally { this.loading = false }
    },
    setQuery(q) { this.q = q || '' },
    clear() { this.sections = []; this.q = ''; this.error = null }
  }
})
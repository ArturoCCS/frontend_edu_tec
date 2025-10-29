import { api } from '@/lib/api';
import { defineStore } from 'pinia';

export const useSectionsStore = defineStore('sections', {
  state: () => ({ sections: [], q: '', loading: false, error: null }),
  actions: {
    async fetchSections(params = {}) {
      this.loading = true; this.error = null
      try {
        const q = params.q ?? this.q ?? ''
        const { data } = await api.get('/api/blogs/sections', { params: { q } })
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
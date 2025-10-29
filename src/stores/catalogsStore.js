import { api } from '@/lib/api';
import { defineStore } from 'pinia';

export const useCatalogsStore = defineStore('catalogs', {
  state: () => ({ loading: false, error: null, careers: [], subjects: [], topics: [] }),
  actions: {
    async fetchAll() {
      this.loading = true; this.error = null
      try {
        const { data } = await api.get('/api/catalog/catalogs')
        this.careers = Array.isArray(data?.careers) ? data.careers : []
        this.subjects = Array.isArray(data?.subjects) ? data.subjects : []
        this.topics = Array.isArray(data?.topics) ? data.topics : []
      } catch (e) {
        this.error = e?.response?.data?.error || e?.message || 'Error al cargar catálogos'
        this.careers = []; this.subjects = []; this.topics = []
      } finally { this.loading = false }
    }
  }
})
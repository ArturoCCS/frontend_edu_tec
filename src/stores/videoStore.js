import axios from 'axios';
import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
const VITE_APP_URL_BACKEND = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:3000';

export const useVideoStore = defineStore('videoStore', {
  state: () => ({
    videos: [],
  }),
  actions: {
    async fetchVideos() {
      try {
        const userEmail = useAuthStore().user.email;
        const response = await axios.get(`${VITE_APP_URL_BACKEND}/plataform?userEmail=${encodeURIComponent(userEmail)}`, { withCredentials: true });
        this.videos = response.data || [];
      } catch (error) {
        console.error("❌ Error al cargar videos:", error);
      }
    },

    async addVideo(newVideo) {
      try {
        newVideo.user_email = useAuthStore().user.email;
        const response = await axios.post(`${VITE_APP_URL_BACKEND}/plataform/`, { data: newVideo }, { withCredentials: true });
        this.videos.push(response.data);
      } catch (error) {
        console.error("Error al agregar el video:", error);
      }
    },

    async deleteVideo(documentId) {
      try {
        await axios.delete(`${VITE_APP_URL_BACKEND}/plataform/${documentId}`, { withCredentials: true });
        this.videos = this.videos.filter(video => video.documentId !== documentId);
      } catch (error) {
        console.error("❌ Error al eliminar el video:", error.response?.data || error.message);
      }
    }
  }
});

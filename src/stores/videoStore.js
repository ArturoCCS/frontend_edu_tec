import axios from 'axios';
import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

export const useVideoStore = defineStore('videoStore', {
  state: () => ({
    videos: [],
  }),
  actions: {
    async fetchVideos() {
      try {
        const userEmail = useAuthStore().user.email;
        const response = await axios.get(`http://localhost:3000/plataform?userEmail=${encodeURIComponent(userEmail)}`, { withCredentials: true });
        this.videos = response.data || [];
      } catch (error) {
        console.error("❌ Error al cargar videos:", error);
      }
    },

    async addVideo(newVideo) {
      try {
        newVideo.user_email = useAuthStore().user.email;
        const response = await axios.post('http://localhost:3000/plataform/', { data: newVideo }, { withCredentials: true });
        this.videos.push(response.data);
      } catch (error) {
        console.error("Error al agregar el video:", error);
      }
    },

    async deleteVideo(documentId) {
      try {
        await axios.delete(`http://localhost:3000/plataform/${documentId}`, { withCredentials: true });
        this.videos = this.videos.filter(video => video.documentId !== documentId);
      } catch (error) {
        console.error("❌ Error al eliminar el video:", error.response?.data || error.message);
      }
    }
  }
});

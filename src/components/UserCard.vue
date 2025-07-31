<template>
  <div class="admin-dashboard">
    <h1>Panel de Administración</h1>
    <div class="add-video-form">
      <h2>Agregar Nuevo Video</h2>
      <form @submit.prevent="addVideo">
        <input v-model="newVideo.title" placeholder="Título" required />
        <textarea v-model="newVideo.description" placeholder="Descripción" required></textarea>
        <input v-model="newVideo.url" placeholder="URL del Video" required />
        <button type="submit">Agregar Video</button>
      </form>
    </div>

    <h2>Lista de Videos</h2>
    <div v-if="videos.length > 0">
      <div v-for="video in videos" :key="video.documentId" class="video-card">
        <h3>{{ video.title }}</h3>
        <p>{{ video.description }}</p>
        <div v-if="isYouTubeUrl(video.url)">
          <iframe
            width="560"
            height="315"
            :src="getYouTubeEmbedUrl(video.url)"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
        <div v-else>
          <a :href="video.url" target="_blank">Ver Video</a>
        </div>
        <button @click="editVideo(video)">Editar</button>
        <button @click="deleteVideo(video.documentId)">Eliminar</button>
      </div>
    </div>
    <p v-else>No hay videos disponibles.</p>
  </div>
</template>

<script>
import { useVideoStore } from '@/stores/videoStore';
import { storeToRefs } from 'pinia'; // 📌 Importar storeToRefs
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const videoStore = useVideoStore();
    const { videos } = storeToRefs(videoStore); // 📌 Hacer videos reactivo
    const newVideo = ref({ title: '', description: '', url: '' });

    onMounted(async () => {
      await videoStore.fetchVideos(); // 📌 Asegurar que se ejecuta correctamente
    });

    const addVideo = async () => {
      await videoStore.addVideo(newVideo.value);
      newVideo.value = { title: '', description: '', url: '' };
    };

    const deleteVideo = async (documentId) => {
      await videoStore.deleteVideo(documentId);
    };

    return {
      videos,
      newVideo,
      addVideo,
      deleteVideo,
      isYouTubeUrl(url) {
        return /youtube\.com\/watch\?v=/.test(url) || /youtube\.com\/embed\//.test(url);
      },
      getYouTubeEmbedUrl(url) {
        const videoId = url.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
      }
    };
  }
};
</script>

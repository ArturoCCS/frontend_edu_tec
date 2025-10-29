<template>
  <div class="coming-soon">
    <svg class="animated-svg" width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" stroke="#fff" stroke-width="4" fill="none" />
      <circle
        cx="60"
        cy="60"
        r="40"
        stroke="#5173b8"
        stroke-width="2"
        fill="none"
        :style="{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }"
      />
    </svg>
    <h3>¡Próximamente!</h3>
    <p>Estamos creando algo increíble.<br>Vuelve pronto.</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const dashArray = 2 * Math.PI * 40;
const dashOffset = ref(dashArray);

onMounted(() => {
  let progress = 0;
  const animate = () => {
    progress += 1;
    dashOffset.value = dashArray - (progress / 100) * dashArray;
    if (progress < 100) requestAnimationFrame(animate);
  };
  animate();
});
</script>

<style scoped>
.coming-soon {
  min-height: 100vh;
  background: linear-gradient(135deg, #04173d 0%, #5173b8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  text-align: center;
}

.animated-svg {
  margin-bottom: 2rem;
  animation: fadeIn 1s;
}


p {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #fff;
  color: #fff;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

button:hover {
  background: #fff;
  color: #282c34;
}
</style>
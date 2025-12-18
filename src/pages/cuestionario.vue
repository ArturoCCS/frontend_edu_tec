<template>
  <v-card max-width="900" class="mx-auto my-10" elevation="2">
    <v-card-title class="text-h5 font-weight-bold text-center py-6 bg-primary text-white">
      Cuestionario Psicosocial
    </v-card-title>

    <v-card-text class="pa-6">
      <v-alert type="info" variant="tonal" class="mb-6">
        <div class="text-h6 mb-2">Instrucciones</div>
        <p>Responde cada afirmación usando la siguiente escala:</p>
        <ul>
          <li><strong>1:</strong> Totalmente en desacuerdo</li>
          <li><strong>2:</strong> En desacuerdo</li>
          <li><strong>3:</strong> Neutral</li>
          <li><strong>4:</strong> De acuerdo</li>
          <li><strong>5:</strong> Totalmente de acuerdo</li>
        </ul>
      </v-alert>

      <v-form ref="formRef" v-model="isValid">
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="text-subtitle-1">
            Sección {{ currentPage }} de {{ sections.length }}
          </div>
          <div class="d-flex align-center" style="gap: 8px;">
            <v-btn variant="text" color="primary" @click="prevPage" :disabled="currentPage === 1 || loading">
              Anterior
            </v-btn>
            <v-btn variant="text" color="primary" @click="nextPage" :disabled="currentPage === sections.length || loading">
              Siguiente
            </v-btn>
          </div>
        </div>

        <v-divider class="my-6"></v-divider>

        <div v-if="currentSection" class="mb-6">
          <div v-for="(question, qIndex) in currentSection.questions" :key="qIndex" class="mb-6">
            <div class="text-body-1 mb-2">
              {{ qIndex + 1 }}. {{ question.text }}
            </div>

            <v-radio-group
              v-model="answers[currentPage - 1][qIndex]"
              :rules="[v => v !== null || 'Esta pregunta es obligatoria']"
              inline
              hide-details="auto"
              color="primary"
            >
              <v-radio
                v-for="option in likertScale"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                color="primary"
                class="custom-radio"
                :disabled="loading"
              />
            </v-radio-group>
          </div>
        </div>

        <v-divider class="my-6"></v-divider>
        <v-pagination
          v-if="sections.length > 1"
          v-model="currentPage"
          :length="sections.length"
          class="mb-4 pagination-contrast"
        />

        <div class="d-flex justify-space-between">
          <div class="d-flex" style="gap: 8px;">
            <v-btn color="secondary" variant="outlined" @click="resetForm" :disabled="loading">
              Reiniciar
            </v-btn>
            <v-btn color="secondary" variant="tonal" @click="shuffleSections" :disabled="loading">
              Mezclar preguntas
            </v-btn>
          </div>

          <v-btn
            v-if="currentPage === sections.length"
            color="primary"
            size="large"
            :disabled="!isFormComplete || loading"
            @click="submitForm"
          >
            {{ loading ? 'Guardando...' : 'Calcular Resultados' }}
          </v-btn>
        </div>
      </v-form>

      <v-dialog v-model="showResults" max-width="800" persistent>
        <v-card>
          <v-card-title class="text-h5 bg-success">
            Resultados del Cuestionario
          </v-card-title>
          <v-card-text class="pa-6">
            <div v-for="(result, index) in results" :key="index" class="mb-4">
              <div class="d-flex justify-space-between align-center mb-2">
                <span class="text-h6">Sección {{ index + 1 }}</span>
                <v-chip :color="getScoreColor(result.average)" size="large">
                  {{ result.average.toFixed(2) }} / 5.0
                </v-chip>
              </div>
              <v-progress-linear
                :model-value="(result.average / 5) * 100"
                :color="getScoreColor(result.average)"
                height="12"
                rounded
              />
              <div class="text-caption mt-1 text-grey">
                Puntaje total: {{ result.total }} / {{ result.maxScore }}
              </div>
            </div>

            <v-alert type="info" variant="tonal" class="mt-6">
              <strong>Interpretación:</strong>
              <ul class="mt-2">
                <li>1.0 - 2.0: Nivel bajo</li>
                <li>2.1 - 3.0: Nivel medio-bajo</li>
                <li>3.1 - 4.0: Nivel medio-alto</li>
                <li>4.1 - 5.0: Nivel alto</li>
              </ul>
            </v-alert>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="outlined" @click="cerrarResultados">
              Revisar Respuestas
            </v-btn>
            <v-btn color="primary" @click="downloadResults">
              Descargar Resultados
            </v-btn>
            <v-btn color="primary" @click="irAReticula">
              Ir a la Retícula
            </v-btn>
            <v-btn color="error" variant="tonal" @click="rehacerCuestionario">
              Rehacer cuestionario
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { PsychAPI } from '@/services/api';
import { useAuthStore } from '@/stores/authStore.js';
import { useUserStore } from '@/stores/userStore.js';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const isValid = ref(false);
const formRef = ref(null);

const showResults = ref(false);
const results = ref([]);

const currentPage = ref(1);
const loading = ref(false);

const STORAGE_KEYS = {
  page: 'questionnaire_page',
  answers: 'questionnaire_answers',
  show: 'questionnaire_show_results',
  results: 'questionnaire_results',
  saved: 'questionnaire_server_saved',
};

const likertScale = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
];

const sections = [
  { title: 'Autoeficacia Académica',
    questions: [
      { text: 'Puedo organizar mi tiempo eficientemente para realizar mis tareas escolares.', inverted: false },
      { text: 'Me siento capaz de superar los desafíos académicos que se presentan.', inverted: false },
      { text: 'Cuando tengo dificultades escolares, sé buscar ayuda adecuada.', inverted: false },
      { text: 'Confío en mi habilidad para aprender nuevos temas en la escuela.', inverted: false },
      { text: 'Me considero capaz de obtener buenas calificaciones si me lo propongo.', inverted: false },
      { text: 'Me cuesta organizar mi tiempo para estudiar.', inverted: true },
      { text: 'Siento que no tengo suficiente capacidad para enfrentar retos escolares.', inverted: true },
      { text: 'No sé a quién recurrir cuando tengo problemas escolares.', inverted: true },
      { text: 'Dudo de mi habilidad para aprender cosas nuevas en la escuela.', inverted: true },
      { text: 'Creo que no puedo obtener buenas calificaciones, aunque lo intente.', inverted: true },
    ] },
  { title: 'Neuroticismo (Emocionalidad)',
    questions: [
      { text: 'Me siento ansioso/a ante los exámenes o tareas importantes.', inverted: false },
      { text: 'Me desanimo fácilmente ante dificultades académicas.', inverted: false },
      { text: 'A menudo siento estrés por asuntos escolares.', inverted: false },
      { text: 'Suelo preocuparme por si fracaso en la escuela.', inverted: false },
      { text: 'Me cuesta controlar mis emociones negativas relacionadas con el estudio.', inverted: false },
      { text: 'Me siento tranquilo/a durante los exámenes o tareas importantes.', inverted: true },
      { text: 'Mantengo el ánimo ante las dificultades académicas.', inverted: true },
      { text: 'Rara vez me siento estresado/a por asuntos escolares.', inverted: true },
      { text: 'No suelo preocuparme por fracasar en la escuela.', inverted: true },
      { text: 'Suelo manejar bien mis emociones negativas sobre el estudio.', inverted: true },
    ] },
  { title: 'Conciencia (Responsabilidad y Organización)',
    questions: [
      { text: 'Soy organizado/a con mis materiales y deberes escolares.', inverted: false },
      { text: 'Siempre entrego mis trabajos y tareas a tiempo.', inverted: false },
      { text: 'Me esfuerzo por cumplir con todas mis responsabilidades escolares.', inverted: false },
      { text: 'Planifico mis actividades académicas antes de realizarlas.', inverted: false },
      { text: 'Soy persistente ante los retos escolares.', inverted: false },
      { text: 'Soy desorganizado/a con mis materiales y deberes escolares.', inverted: true },
      { text: 'Suelo retrasar mis trabajos y tareas.', inverted: true },
      { text: 'Me cuesta cumplir con mis responsabilidades escolares.', inverted: true },
      { text: 'No suelo planificar mis actividades antes de realizarlas.', inverted: true },
      { text: 'Me rindo fácilmente ante los retos escolares.', inverted: true },
    ] },
  { title: 'Extraversión (Sociabilidad)',
    questions: [
      { text: 'Participo activamente en clase y con mis compañeros.', inverted: false },
      { text: 'Me agrada trabajar en equipo en actividades escolares.', inverted: false },
      { text: 'Me resulta fácil comunicarme con profesores y compañeros.', inverted: false },
      { text: 'Disfruto socializando en el entorno escolar.', inverted: false },
      { text: 'Prefiero compartir mis dudas académicas con otros.', inverted: false },
      { text: 'Prefiero no participar en clase ni con compañeros.', inverted: true },
      { text: 'Me incomoda trabajar en equipo en la escuela.', inverted: true },
      { text: 'Me cuesta comunicarme con profesores y compañeros.', inverted: true },
      { text: 'Prefiero no socializar en el entorno escolar.', inverted: true },
      { text: 'Prefiero resolver mis dudas académicas por mí mismo.', inverted: true },
    ] },
  { title: 'Honestidad/Humildad',
    questions: [
      { text: 'Actúo con sinceridad en mi relación con profesores y compañeros.', inverted: false },
      { text: 'Evito hacer trampa en exámenes y tareas.', inverted: false },
      { text: 'Reconozco mis errores o limitaciones académicas sin problema.', inverted: false },
      { text: 'Muestro modestia en mis logros escolares.', inverted: false },
      { text: 'Es importante para mí ser justo/a en mi desempeño escolar.', inverted: false },
      { text: 'Prefiero no ser sincero/a con profesores y compañeros.', inverted: true },
      { text: 'Hago trampa en exámenes o tareas ocasionalmente.', inverted: true },
      { text: 'Me cuesta admitir mis errores o limitaciones académicas.', inverted: true },
      { text: 'Me gusta presumir mis logros escolares.', inverted: true },
      { text: 'No me importa la justicia en mi desempeño escolar.', inverted: true },
    ] },
  { title: 'Apertura a la experiencia',
    questions: [
      { text: 'Me interesa aprender cosas nuevas, aunque sean difíciles.', inverted: false },
      { text: 'Disfruto explorar diferentes formas de resolver problemas escolares.', inverted: false },
      { text: 'Soy curioso/a respecto a asignaturas poco conocidas.', inverted: false },
      { text: 'Estoy dispuesto/a a cambiar de método si uno no funciona.', inverted: false },
      { text: 'Me gusta participar en proyectos o actividades innovadoras en la escuela.', inverted: false },
      { text: 'Prefiero no aprender cosas nuevas, especialmente si son difíciles.', inverted: true },
      { text: 'Me incomoda explorar diferentes formas de abordar problemas escolares.', inverted: true },
      { text: 'No me interesa asignaturas poco conocidas.', inverted: true },
      { text: 'Prefiero no cambiar de método, aunque no funcione.', inverted: true },
      { text: 'Evito actividades o proyectos innovadores en la escuela.', inverted: true },
    ] },
  { title: 'Amabilidad',
    questions: [
      { text: 'Ayudo a mis compañeros cuando lo necesitan en temas escolares.', inverted: false },
      { text: 'Respeto las opiniones y formas de aprender de los demás.', inverted: false },
      { text: 'Soy paciente con quienes tienen dificultades académicas.', inverted: false },
      { text: 'Me gusta colaborar para que el grupo tenga éxito.', inverted: false },
      { text: 'Evito conflictos en el entorno escolar.', inverted: false },
      { text: 'Evito ayudar a mis compañeros en temas escolares.', inverted: true },
      { text: 'Desestimo las opiniones y formas de aprender de los demás.', inverted: true },
      { text: 'Soy impaciente con quienes tienen dificultades académicas.', inverted: true },
      { text: 'Prefiero no colaborar en grupo.', inverted: true },
      { text: 'Provoco conflictos en el entorno escolar.', inverted: true },
    ] },
  { title: 'Autoconcepto Académico',
    questions: [
      { text: 'Me considero una persona capaz en el ámbito escolar.', inverted: false },
      { text: 'Creo que puedo aprender cualquier materia si me lo propongo.', inverted: false },
      { text: 'Tengo confianza en mis capacidades para el estudio.', inverted: false },
      { text: 'Me siento valioso/a como estudiante.', inverted: false },
      { text: 'Pienso que mis profesores reconocen mi esfuerzo académico.', inverted: false },
      { text: 'Dudo de mi capacidad en el ámbito escolar.', inverted: true },
      { text: 'Creo que no puedo aprender cualquier materia, aunque lo intente.', inverted: true },
      { text: 'Tengo poca confianza en mis capacidades para el estudio.', inverted: true },
      { text: 'No me siento valioso/a como estudiante.', inverted: true },
      { text: 'Siento que mis profesores no reconocen mi esfuerzo académico.', inverted: true },
    ] },
  { title: 'Situación Socioeconómica',
    questions: [
      { text: 'Cuento con acceso a internet confiable en casa.', inverted: false },
      { text: 'Tengo computadora, tablet o celular propio para estudiar.', inverted: false },
      { text: 'Dispongo de un lugar tranquilo y adecuado para estudiar en casa.', inverted: false },
      { text: 'En mi hogar no hay dificultades económicas graves.', inverted: false },
      { text: 'Mis padres o responsables tienen estudios universitarios.', inverted: false },
      { text: 'No tengo que trabajar para ayudar económicamente en casa.', inverted: false },
      { text: 'En casa me apoyan para continuar con mis estudios.', inverted: false },
      { text: 'Compartimos el espacio de vivienda con pocas personas (menos de 4).', inverted: false },
      { text: 'No cuento con acceso a internet confiable en casa.', inverted: true },
      { text: 'No tengo computadora, tablet o celular propio para estudiar.', inverted: true },
      { text: 'No dispongo de un lugar adecuado para estudiar en casa.', inverted: true },
      { text: 'En mi hogar hay dificultades económicas graves.', inverted: true },
      { text: 'Mis padres o responsables no tienen estudios universitarios.', inverted: true },
      { text: 'Tengo que trabajar para ayudar económicamente en casa.', inverted: true },
      { text: 'En casa no me apoyan para continuar con mis estudios.', inverted: true },
      { text: 'Compartimos el espacio de vivienda con muchas personas (más de 4).', inverted: true },
    ] },
];

const answers = ref(sections.map(section => Array(section.questions.length).fill(null)));
const currentSection = computed(() => sections[currentPage.value - 1] || null);
const totalQuestions = computed(() => sections.reduce((total, section) => total + section.questions.length, 0));
const answeredQuestions = computed(() => answers.value.reduce((t, arr) => t + arr.filter(a => a !== null).length, 0));
const isFormComplete = computed(() => answeredQuestions.value === totalQuestions.value);
const calculateScore = (value, inverted) => (inverted ? 6 - value : value);
const prevPage = () => { if (currentPage.value > 1 && !loading.value) currentPage.value--; };
const nextPage = () => { if (currentPage.value < sections.length && !loading.value) currentPage.value++; };

const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};
const shuffleSections = () => {
  sections.forEach(section => shuffleArray(section.questions));
  answers.value = sections.map(section => Array(section.questions.length).fill(null));
  currentPage.value = 1;
};

const submitForm = async () => {
  results.value = sections.map((section, sectionIndex) => {
    let total = 0;
    section.questions.forEach((question, qIndex) => {
      const answer = answers.value[sectionIndex][qIndex];
      total += calculateScore(answer, question.inverted);
    });
    const average = total / section.questions.length;
    const maxScore = section.questions.length * 5;
    return { total, maxScore, average };
  });
  showResults.value = true;

  try {
    loading.value = true;

    if (!userStore.user) {
      await authStore.checkAuth();
    }
    const id_usuario = userStore.user?.id_usuario;
    if (!id_usuario) {
      alert('No se pudo identificar al usuario. Inicia sesión nuevamente.');
      router.push('/login');
      return;
    }

    const resp = await PsychAPI.submit(id_usuario, answers.value);

    const final = resp?.final_estado || resp?.data?.final_estado;
    if (final) {
      localStorage.setItem('psych_final_estado', JSON.stringify(final));
    }
    localStorage.setItem(STORAGE_KEYS.saved, 'true');
    localStorage.removeItem(STORAGE_KEYS.show);
    localStorage.removeItem(STORAGE_KEYS.results);

    showResults.value = false;
    router.push({ name: 'Reticula', query: { from: 'cuestionario' } });
  } catch (e) {
    const status = e?.response?.status;
    const data = e?.response?.data;
    localStorage.setItem(STORAGE_KEYS.saved, 'false');

    if (status === 401) {
      alert('Tu sesión no está activa. Inicia sesión nuevamente.');
      router.push('/login');
    } else if (status === 404) {
      alert('Endpoint no encontrado: /api/psych/submit. Verifica montaje en backend.');
    } else if (status === 400) {
      alert(`Datos inválidos al guardar: ${data?.error || 'answers invalid'}`);
    } else {
      alert(`Error al guardar (${status || 'sin código'}). Revisa consola.`);
    }
    console.error('Psych submit error:', status, data, e);
  } finally {
    loading.value = false;
  }
};

function cerrarResultados() {
  showResults.value = false;
  localStorage.removeItem(STORAGE_KEYS.show);
}
function irAReticula() { router.push({ name: 'Reticula' }); }
function rehacerCuestionario() {
  currentPage.value = 1;
  answers.value = sections.map(section => Array(section.questions.length).fill(null));
  results.value = [];
  showResults.value = false;

  localStorage.removeItem(STORAGE_KEYS.page);
  localStorage.removeItem(STORAGE_KEYS.answers);
  localStorage.removeItem(STORAGE_KEYS.results);
  localStorage.removeItem(STORAGE_KEYS.show);
  localStorage.removeItem(STORAGE_KEYS.saved);
}

onMounted(() => {
  try {
    const savedPage = localStorage.getItem(STORAGE_KEYS.page);
    const savedAnswers = localStorage.getItem(STORAGE_KEYS.answers);
    const savedShow = localStorage.getItem(STORAGE_KEYS.show);
    const savedResults = localStorage.getItem(STORAGE_KEYS.results);
    const serverSaved = localStorage.getItem(STORAGE_KEYS.saved);

    if (savedPage) {
      const p = parseInt(savedPage, 10);
      if (!Number.isNaN(p) && p >= 1 && p <= sections.length) currentPage.value = p;
    }
    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers);
      const ok = Array.isArray(parsed) && parsed.length === sections.length &&
        parsed.every((arr, idx) => Array.isArray(arr) && arr.length === sections[idx].questions.length);
      if (ok) answers.value = parsed;
    }
    if (savedShow === 'true' && savedResults && serverSaved === 'true') {
      const parsedRes = JSON.parse(savedResults);
      if (Array.isArray(parsedRes)) {
        results.value = parsedRes;
        showResults.value = true;
      } else {
        localStorage.removeItem(STORAGE_KEYS.show);
      }
    } else {
      showResults.value = false;
      localStorage.removeItem(STORAGE_KEYS.show);
    }
  } catch (e) {
    console.warn('No se pudo restaurar el progreso:', e);
  }
});

watch(currentPage, (p) => localStorage.setItem(STORAGE_KEYS.page, String(p)));
watch(answers, (val) => {
  try { localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(val)); } catch (e) { console.warn('No se pudo guardar respuestas:', e); }
}, { deep: true });
watch(showResults, (v) => localStorage.setItem(STORAGE_KEYS.show, v ? 'true' : 'false'));
watch(results, (val) => {
  try { localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(val)); } catch (e) { console.warn('No se pudo guardar resultados:', e); }
}, { deep: true });

const getScoreColor = (score) => {
  if (score <= 2.0) return 'error';
  if (score <= 3.0) return 'warning';
  if (score <= 4.0) return 'info';
  return 'success';
};

const downloadResults = () => {
  let text = 'RESULTADOS DEL CUESTIONARIO PSICOSOCIAL\n\n';
  text += 'Fecha: ' + new Date().toLocaleString() + '\n\n';
  results.value.forEach((result, idx) => {
    text += `Sección ${idx + 1}\n`;
    text += `Puntaje: ${result.total}/${result.maxScore}\n`;
    text += `Promedio: ${result.average.toFixed(2)}/5.0\n\n`;
  });
  const blob = new Blob([text], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'resultados_cuestionario.txt'; a.click();
  window.URL.revokeObjectURL(url);
};
</script>

<style scoped>
.v-radio-group {
  display: flex;
  gap: 0.5rem;
}

.pagination-contrast :deep(.v-pagination__item),
.pagination-contrast :deep(.v-pagination__prev),
.pagination-contrast :deep(.v-pagination__next) {
  background-color: #e5e5e5 ;
  color: #000000 ;
  border-radius: 8px;
}

.pagination-contrast :deep(.v-pagination__item--is-active) {
  background-color: #0b1c9e !important;
  color: #fff !important;
}

.pagination-contrast :deep(.v-pagination__item--active .v-btn__content) {
  color: #fff !important;
}

.custom-radio :deep(.v-selection-control__wrapper) {
  color: #1124cf !important;           
}

.custom-radio :deep(.v-selection-control--dirty .v-selection-control__wrapper) {
  color: #1124cf !important;           
}
.custom-radio :deep(.v-selection-control--dirty .v-selection-control__input + .v-selection-control__wrapper .v-icon) {
  color: #1124cf !important;
}

.custom-radio :deep(.v-label) {
  color: #000;
  font-weight: 500;
}
.custom-radio :deep(.v-selection-control--dirty .v-label) {
  color: #1124cf !important;
  font-weight: 600;
}

.custom-radio :deep(.v-selection-control:hover .v-selection-control__wrapper),
.custom-radio :deep(.v-selection-control:hover .v-label) {
  color: #1a33ff !important;
}

.custom-radio :deep(.v-selection-control__input:focus-visible + .v-selection-control__wrapper) {
  outline: 2px solid #1124cf !important;
  outline-offset: 2px;
  border-radius: 999px;
}
</style>
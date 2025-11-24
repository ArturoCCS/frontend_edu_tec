<template>
  <v-container class="py-8">
    <v-card max-width="900" class="mx-auto" elevation="3">
      <v-card-title class="text-h5 font-weight-bold text-center py-6 bg-primary text-white">
        Cuestionario Psicosocial de Variables Predictoras del Riesgo Académico
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Instrucciones -->
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

        <!-- Formulario -->
        <v-form ref="form" v-model="valid">
          <!-- Progreso -->
          <v-progress-linear
            :model-value="progress"
            color="primary"
            height="8"
            class="mb-6"
          ></v-progress-linear>
          <div class="text-center text-caption mb-4">
            Progreso: {{ answeredQuestions }}/{{ totalQuestions }} preguntas respondidas
          </div>

          <!-- Secciones del cuestionario -->
          <div v-for="(section, sectionIndex) in sections" :key="sectionIndex">
            <v-divider class="my-6"></v-divider>
            <div class="text-h5 font-weight-bold mb-4" style="color: #000000;">
              {{ section.title }}
            </div>

            <div v-for="(question, qIndex) in section.questions" :key="qIndex" class="mb-6">
              <div class="text-body-1 mb-2">
                {{ qIndex + 1 }}. {{ question.text }}
              </div>
              
              <v-radio-group
                v-model="answers[sectionIndex][qIndex]"
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
                ></v-radio>
              </v-radio-group>
            </div>
          </div>

          <!-- Botones de acción -->
          <v-divider class="my-6"></v-divider>
          <div class="d-flex justify-space-between">
            <v-btn
              color="secondary"
              variant="outlined"
              @click="resetForm"
            >
              Reiniciar
            </v-btn>
            <v-btn
              color="primary"
              size="large"
              :disabled="!isFormComplete"
              @click="submitForm"
            >
              Calcular Resultados
            </v-btn>
          </div>
        </v-form>

        <!-- Resultados -->
        <v-dialog v-model="showResults" max-width="800" persistent>
          <v-card>
            <v-card-title class="text-h5 bg-success">
              Resultados del Cuestionario
            </v-card-title>
            <v-card-text class="pa-6">
              <div v-for="(result, index) in results" :key="index" class="mb-4">
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="text-h6">{{ result.title }}</span>
                  <v-chip :color="getScoreColor(result.average)" size="large">
                    {{ result.average.toFixed(2) }} / 5.0
                  </v-chip>
                </div>
                <v-progress-linear
                  :model-value="(result.average / 5) * 100"
                  :color="getScoreColor(result.average)"
                  height="12"
                  rounded
                ></v-progress-linear>
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
              <v-btn color="primary" variant="outlined" @click="showResults = false">
                Revisar Respuestas
              </v-btn>
              <v-btn color="primary" @click="downloadResults">
                Descargar Resultados
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

const valid = ref(false);
const form = ref(null);
const showResults = ref(false);
const results = ref([]);

const likertScale = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
];

const sections = [
  {
    title: 'Autoeficacia Académica',
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
    ]
  },
  {
    title: 'Neuroticismo (Emocionalidad)',
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
    ]
  },
  {
    title: 'Conciencia (Responsabilidad y Organización)',
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
    ]
  },
  {
    title: 'Extraversión (Sociabilidad)',
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
    ]
  },
  {
    title: 'Honestidad/Humildad',
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
    ]
  },
  {
    title: 'Apertura a la experiencia',
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
    ]
  },
  {
    title: 'Amabilidad',
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
    ]
  },
  {
    title: 'Autoconcepto Académico',
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
    ]
  },
  {
    title: 'Situación Socioeconómica',
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
    ]
  }
];

// Inicializar respuestas
const answers = ref(sections.map(section => 
  Array(section.questions.length).fill(null)
));

// Calcular total de preguntas
const totalQuestions = computed(() => {
  return sections.reduce((total, section) => total + section.questions.length, 0);
});

// Calcular preguntas respondidas
const answeredQuestions = computed(() => {
  return answers.value.reduce((total, sectionAnswers) => {
    return total + sectionAnswers.filter(answer => answer !== null).length;
  }, 0);
});

// Calcular progreso
const progress = computed(() => {
  return (answeredQuestions.value / totalQuestions.value) * 100;
});

// Verificar si el formulario está completo
const isFormComplete = computed(() => {
  return answeredQuestions.value === totalQuestions.value;
});

// Función para calcular puntaje (con inversión)
const calculateScore = (value, inverted) => {
  return inverted ? 6 - value : value;
};

// Enviar formulario y calcular resultados
const submitForm = () => {
  results.value = sections.map((section, sectionIndex) => {
    let total = 0;
    section.questions.forEach((question, qIndex) => {
      const answer = answers.value[sectionIndex][qIndex];
      total += calculateScore(answer, question.inverted);
    });
    
    const average = total / section.questions.length;
    const maxScore = section.questions.length * 5;
    
    return {
      title: section.title,
      total: total,
      maxScore: maxScore,
      average: average
    };
  });
  
  showResults.value = true;
};

// Reiniciar formulario
const resetForm = () => {
  answers.value = sections.map(section => 
    Array(section.questions.length).fill(null)
  );
  results.value = [];
  showResults.value = false;
};

// Obtener color según puntaje
const getScoreColor = (score) => {
  if (score <= 2.0) return 'error';
  if (score <= 3.0) return 'warning';
  if (score <= 4.0) return 'info';
  return 'success';
};

// Descargar resultados
const downloadResults = () => {
  let text = 'RESULTADOS DEL CUESTIONARIO PSICOSOCIAL\n\n';
  text += 'Fecha: ' + new Date().toLocaleString() + '\n\n';
  
  results.value.forEach(result => {
    text += `${result.title}\n`;
    text += `Puntaje: ${result.total}/${result.maxScore}\n`;
    text += `Promedio: ${result.average.toFixed(2)}/5.0\n\n`;
  });
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resultados_cuestionario.txt';
  a.click();
  window.URL.revokeObjectURL(url);
};
</script>

<style scoped>
.v-radio-group {
  display: flex;
  gap: 0.5rem;
}

/* Mejorar visibilidad de los radio buttons */
.custom-radio :deep(.v-selection-control__wrapper) {
  color: #1976d2;
}

.custom-radio :deep(.v-selection-control--dirty .v-selection-control__wrapper) {
  color: #1976d2;
}

.custom-radio :deep(.v-label) {
  color: #000;
  font-weight: 500;
}
</style>
<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" md="3">
        <ProgressSidebar
          :porcentaje-avance="porcentajeAvance"
          :creditos-obtenidos="creditosObtenidos"
          :total-creditos="totalCreditos"
          :promedio-general="promedioGeneral"
          :materias-aprobadas-count="materiasAprobadas.length"
          :materias-disponibles-count="materiasDisponibles.length"
          :materias-bloqueadas-count="materiasBloqueadas.length"
          @agregar-materia="dialogAgregarMateria = true"
          @ver-historial="dialogHistorial = true"
          @cerrar-semestre="dialogCerrarSemestre = true"
          @reiniciar="reiniciarProgreso"
          @agregar-especial="abrirAgregarEspecial"
        />
      </v-col>

      <v-col cols="12" md="9">
        <v-card elevation="3" class="mb-4">
          <v-card-title class="bg-primary text-white d-flex justify-space-between align-center">
            <div>
              <v-icon class="mr-2">mdi-view-grid</v-icon>
              Retícula Curricular - Ingeniería en Sistemas Computacionales
            </div>
            <v-btn-toggle v-model="vistaActual" mandatory>
              <v-btn value="grid" size="small"><v-icon>mdi-view-grid</v-icon></v-btn>
              <v-btn value="list" size="small"><v-icon>mdi-view-list</v-icon></v-btn>
            </v-btn-toggle>
          </v-card-title>
          <v-card-text class="pa-4">
            <ReticulaGrid
              :vista="vistaActual"
              :get-materias-por-semestre="getMateriasPorSemestre"
              :get-estado-materia="getEstadoMateria"
              :get-semestre-color="getSemestreColor"
              :materias-cursadas="materiasCursadas"
              :ya-aprobada-en-historial="yaAprobadaEnHistorial"
              @abrir-detalle="abrirDetalleMateria"
            />
          </v-card-text>
        </v-card>

        <SimLayout
          :history="simHistory"
          :final-estado="simFinalEstado"
          :resumen="simResumen"
          :active-week="activeWeek"
          :playing="playing"
          :speed="speed"
          @play="start()"
          @pause="pause()"
          @set-week="setWeek"
          @set-speed="setSpeed"
          @open-history="showHistoryDrawer = true"
        />
      </v-col>
    </v-row>

    <SubjectDetailDialog
      v-model="dialogDetalle"
      :materia="materiaSeleccionada"
      :materias-cursadas="materiasCursadas"
      :ya-aprobada-en-historial="yaAprobadaEnHistorial"
      :puede-ser-cursada="puedeSerCursada"
      @eliminar="eliminarMateria"
      @agregar-calificacion="abrirAgregarCalificacion"
    />

    <AddCourseDialog
      v-model="dialogAgregarMateria"
      :materias-disponibles="materiasDisponibles"
      v-model:materia-id="nuevaMateriaId"
      v-model:calificacion="nuevaCalificacion"
      @confirm="agregarMateriaCursada"
    />

    <CloseSemesterDialog
      v-model="dialogCerrarSemestre"
      :materias-aprobadas-count="materiasAprobadas.length"
      :materias-reprobadas-count="materiasReprobadas.length"
      :materias-cursadas-count="Object.keys(materiasCursadas).length"
      :promedio-general="promedioGeneral"
      v-model:nombre-semestre="nombreSemestreCerrar"
      @confirm="cerrarSemestreActual"
    />

    <HistoryDialog
      v-model="dialogHistorial"
      :historial="historialSemestres"
    />
  </v-container>
</template>

<script setup>
import { useReticula } from '@/composables/useReticula';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import AddCourseDialog from './AddCourseDialog.vue';
import CloseSemesterDialog from './CloseSemesterDialog.vue';
import HistoryDialog from './HistoryDialog.vue';
import ProgressSidebar from './ProgressSidebar.vue';
import ReticulaGrid from './ReticulaGrid.vue';
import SubjectDetailDialog from './SubjectDetailDialog.vue';

import SimLayout from '@/components/Sim/SimLayout.vue';

const {
  vistaActual, dialogDetalle, dialogAgregarMateria, dialogHistorial, dialogCerrarSemestre,
  materiaSeleccionada, nuevaMateriaId, nuevaCalificacion, nombreSemestreCerrar,
  materiasCursadas, historialSemestres,
  totalCreditos, materiasAprobadas, materiasReprobadas, materiasDisponibles, materiasBloqueadas,
  creditosObtenidos, porcentajeAvance, promedioGeneral,
  getMateriasPorSemestre, puedeSerCursada, getEstadoMateria, yaAprobadaEnHistorial, getSemestreColor,
  abrirDetalleMateria, abrirAgregarCalificacion, abrirAgregarEspecial,
  agregarMateriaCursada, eliminarMateria, cerrarSemestreActual, reiniciarProgreso,
} = useReticula();

const simHistory = ref([]);
const simFinalEstado = ref(null);
const simResumen = ref([]);
const activeWeek = ref(0);
const playing = ref(false);
const speed = ref(1);
let timer = null;

const maxWeek = computed(() => (simHistory.value.length ? Math.max(...simHistory.value.map(h => h.week)) : 0));

const loadMock = async () => {
  const data = await import('@/mock/simulation-example.json');
  simHistory.value = data.default.history;
  simFinalEstado.value = data.default.finalEstado;
  simResumen.value = data.default.resumen;
};

const tick = () => {
  if (!playing.value) return;
  if (activeWeek.value >= maxWeek.value) {
    playing.value = false;
    return;
  }
  activeWeek.value += 1;
};

const start = () => {
  playing.value = true;
  clearInterval(timer);
  timer = setInterval(tick, Math.max(300, 1200 / speed.value));
};
const pause = () => {
  playing.value = false;
  clearInterval(timer);
};
const setSpeed = (v) => {
  speed.value = v;
  if (playing.value) start();
};
const setWeek = (w) => activeWeek.value = w;

onMounted(loadMock);
onBeforeUnmount(() => clearInterval(timer));
</script>
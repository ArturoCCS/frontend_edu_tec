<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" class="d-flex justify-end align-center" style="gap:8px;">
        <v-btn color="primary" class="mb-4" :disabled="seleccionadasIds.length === 0 || loading" @click="iniciarSimulacion">
          <v-icon class="mr-2">mdi-play</v-icon>
          Simular semestre
        </v-btn>
        <v-btn color="secondary" variant="outlined" class="mb-4" @click="$router.push({ name: 'Cuestionario' })">
          Rehacer cuestionario
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-card elevation="3" class="sticky-panel">
          <v-card-title class="bg-primary text-white d-flex align-center" style="gap:8px;">
            <v-icon>mdi-school</v-icon>
            Retícula y selección
          </v-card-title>

          <v-card-text>
            <v-alert v-if="loading" type="info" variant="tonal" class="mb-3">
              Cargando materias desde la base de datos…
            </v-alert>
            <v-alert v-else-if="error" type="error" variant="tonal" class="mb-3">
              No se pudieron cargar las materias. {{ error }}
            </v-alert>

            <div class="mb-4">
              <div class="text-h6 mb-2">Resumen de selección</div>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>
                    <v-chip color="primary" size="small" class="mr-2">{{ seleccionadasIds.length }}</v-chip>
                    Materias seleccionadas
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-chip color="info" size="small" class="mr-2">{{ totalCreditosSeleccion }}</v-chip>
                    Créditos totales
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>

            <v-divider class="my-4"></v-divider>

            <v-btn block color="secondary" variant="outlined" @click="limpiarSeleccion" :disabled="loading">
              <v-icon class="mr-2">mdi-broom</v-icon>
              Limpiar selección
            </v-btn>
            <v-btn block color="primary" class="mt-2" :disabled="seleccionadasIds.length === 0 || loading" @click="iniciarSimulacion">
              <v-icon class="mr-2">mdi-play</v-icon>
              Simular semestre
            </v-btn>

            <v-alert type="info" variant="tonal" class="mt-4">
              Selecciona materias por semestre según la retícula. La cantidad de unidades por materia se lee de la base de datos.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <v-card elevation="3">
          <v-card-title class="bg-primary text-white d-flex justify-space-between align-center">
            <div class="d-flex align-center" style="gap:8px;">
              <v-icon>mdi-view-grid</v-icon>
              Retícula Curricular - ISC
            </div>
            <v-btn-toggle v-model="vistaActual" mandatory>
              <v-btn value="grid" size="small">
                <v-icon>mdi-view-grid</v-icon>
              </v-btn>
              <v-btn value="list" size="small">
                <v-icon>mdi-view-list</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-alert v-if="!loading && materiasData.length === 0" type="warning" variant="tonal">
              No hay materias para mostrar. Verifica que /api/subjects devuelva datos y que los códigos estén mapeados a semestre.
            </v-alert>

            <div v-if="vistaActual === 'grid'" class="reticula-grid">
              <div v-for="sem in 9" :key="sem" class="semestre-column">
                <div class="semestre-header" :style="{ background: getSemestreColor(sem) }">
                  <v-icon class="mr-2" color="white">mdi-school</v-icon>
                  Semestre {{ sem }}
                </div>
                <div class="materias-container">
                  <div
                    v-for="materia in getMateriasPorSemestre(sem)"
                    :key="materia.code"
                    :class="['materia-card', { 'seleccionada': seleccionadasMap[materia.code] }]"
                    @click="toggleSeleccion(materia)"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="materia-codigo">{{ materia.code }}</div>
                        <div class="materia-nombre">{{ materia.nombre }}</div>
                        <div class="materia-creditos">
                          <v-icon size="12">mdi-star</v-icon>
                          {{ materia.creditos }} créditos
                          <v-chip size="x-small" class="ml-2" variant="outlined">{{ materia.unidades?.length || 0 }}U</v-chip>
                        </div>
                      </div>
                      <v-checkbox
                        v-model="seleccionadasMap[materia.code]"
                        :true-value="true"
                        :false-value="false"
                        density="compact"
                        hide-details
                        color="secondary"
                        @click.stop="toggleSeleccion(materia)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <v-expansion-panels>
                <v-expansion-panel v-for="sem in 9" :key="sem">
                  <v-expansion-panel-title>
                    <div class="d-flex justify-space-between align-center w-100">
                      <span class="font-weight-bold">Semestre {{ sem }}</span>
                      <v-chip size="small">
                        {{ getMateriasPorSemestre(sem).length }} materias
                      </v-chip>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-list>
                      <v-list-item
                        v-for="materia in getMateriasPorSemestre(sem)"
                        :key="materia.code"
                        @click="toggleSeleccion(materia)"
                      >
                        <template v-slot:prepend>
                          <v-checkbox
                            v-model="seleccionadasMap[materia.code]"
                            :true-value="true"
                            :false-value="false"
                            density="compact"
                            hide-details
                            color="secondary"
                            @click.stop="toggleSeleccion(materia)"
                          />
                        </template>
                        <v-list-item-title>{{ materia.nombre }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ materia.code }} · {{ materia.unidades?.length || 0 }} unidades
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { PsychAPI, SimulationAPI, SubjectsAPI, UserAPI } from '@/services/api';
import { computed, onMounted, ref } from 'vue';

const loading = ref(false);
const error = ref('');

const materiasBD = ref([]);

const creditosMap = {
  CALCULO_DIF: 5, FUND_PROG: 5, TALLER_ETICA: 4, MAT_DISCRETA: 5, TALLER_ADMIN: 4, DES_SUST: 5,
  CALCULO_INT: 5, POO: 5, CONT_FIN: 4, QUIMICA: 5, PROB_EST: 5, ALGEBRA_LIN: 4,
  CALC_VEC: 5, ED: 5, CULT_EMP: 4, INV_OP: 4, FUND_INV: 5, FISICA_GRAL: 5,
  ECU_DIF: 5, MET_NUM: 4, TOP_AV_PROG: 4, FUND_BD: 3, GRAFICACION: 4, PEAD: 4,
  LENG_AUT: 5, FUND_TELE: 4, TALLER_BD: 4, SIST_OPER: 4, SIMULACION: 4, ARQ_COMP: 3,
  LENG_AUT_II: 5, REDES: 5, ADM_BD: 4, TALLER_SIST: 4, FUND_ISW: 4, LENG_INTERF: 4,
  LOG_FUNC: 4, CONM_ENR: 4, ADM_RED: 4, PROG_WEB: 5, TALLER_INV_I: 3, SIS_PROG: 5,
  IA: 4, ING_SOFT: 6, 'SCG-1009': 6, TALLER_INV_II: 3, 'MCD-2103': 5, 'MCD-2105': 5,
  'MCD-2104': 5, 'MCD-2101': 5, 'MCD-2102': 5, RESIDENCIA: 10,
};

const materiasData = computed(() => materiasBD.value.map(s => ({
  code: s.code,
  nombre: s.nombre,
  creditos: creditosMap[s.code] || 0,
  unidades: s.unidades || [],
  semestre: guessSemesterByCode(s.code),
})));

function guessSemesterByCode(code) {
  const map = {
    CALCULO_DIF: 1, FUND_PROG: 1, TALLER_ETICA: 1, MAT_DISCRETA: 1, TALLER_ADMIN: 1, DES_SUST: 1,
    CALCULO_INT: 2, POO: 2, CONT_FIN: 2, QUIMICA: 2, PROB_EST: 2, ALGEBRA_LIN: 2,
    CALC_VEC: 3, ED: 3, CULT_EMP: 3, INV_OP: 3, FUND_INV: 3, FISICA_GRAL: 3,
    ECU_DIF: 4, MET_NUM: 4, TOP_AV_PROG: 4, FUND_BD: 4, GRAFICACION: 4, PEAD: 4,
    LENG_AUT: 5, FUND_TELE: 5, TALLER_BD: 5, SIST_OPER: 5, SIMULACION: 5, ARQ_COMP: 5,
    LENG_AUT_II: 6, REDES: 6, ADM_BD: 6, TALLER_SIST: 6, FUND_ISW: 6, LENG_INTERF: 6,
    LOG_FUNC: 7, CONM_ENR: 7, ADM_RED: 7, PROG_WEB: 7, TALLER_INV_I: 7, SIS_PROG: 7,
    IA: 8, ING_SOFT: 8, 'SCG-1009': 8, TALLER_INV_II: 8, 'MCD-2103': 8, 'MCD-2105': 8,
    'MCD-2104': 9, 'MCD-2101': 9, 'MCD-2102': 9, RESIDENCIA: 9,
  };
  return map[code] || 1;
}

const vistaActual = ref('grid');
const seleccionadasMap = ref({});
const seleccionadasIds = computed(() => Object.keys(seleccionadasMap.value).filter(k => seleccionadasMap.value[k]));

function toggleSeleccion(materia) {
  seleccionadasMap.value[materia.code] = !seleccionadasMap.value[materia.code];
}
function limpiarSeleccion() {
  seleccionadasMap.value = {};
  localStorage.removeItem('reticula_selection');
}

const totalCreditosSeleccion = computed(() => {
  return materiasData.value
    .filter(m => seleccionadasMap.value[m.code])
    .reduce((sum, m) => sum + (m.creditos || 0), 0);
});

const getMateriasPorSemestre = (semestre) => materiasData.value.filter(m => m.semestre === semestre);

const getSemestreColor = (semestre) => {
  const colores = [
    'linear-gradient(135deg, #2C5AA0 0%, #1E3A5F 100%)',
    'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    'linear-gradient(135deg, #059669 0%, #047857 100%)',
    'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)',
    'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
    'linear-gradient(135deg, #475569 0%, #334155 100%)',
  ];
  return colores[semestre - 1];
};

onMounted(async () => {
  loading.value = true;
  error.value = '';
  try {
    const me = await UserAPI.me().catch(() => null);
    const careerId = me?.id_career || me?.career_id;
    let subjects = [];
    try {
      subjects = await SubjectsAPI.list(careerId);
    } catch (e1) {
      console.warn('SubjectsAPI.list con career_id falló, probando sin filtro:', e1);
      subjects = await SubjectsAPI.list();
    }
    materiasBD.value = Array.isArray(subjects) ? subjects : [];
    console.log('[Retícula] Materias cargadas:', materiasBD.value.length);
  } catch (e) {
    console.error('No se pudieron cargar materias desde backend:', e);
    error.value = e?.response?.data?.error || e?.message || 'Error desconocido';
    materiasBD.value = [];
  } finally {
    loading.value = false;
  }
});
async function iniciarSimulacion() {
  const selectedCodes = seleccionadasIds.value;
  if (!selectedCodes.length) {
    alert('Selecciona al menos una materia para simular');
    return;
  }

  const materiasSeleccionadas = materiasData.value.filter(m => selectedCodes.includes(m.code));

  const semesterConfig = {
    weeks: 16,
    materias: materiasSeleccionadas.map(m => ({
      id: m.code,
      nombre: m.nombre,
      unidades: Math.max(1, (m.unidades?.length || 0)),
      difDocente_tri: { min: 0.2, moda: 0.5, max: 0.9 },
    })),
  };

  let me = null;
  try { me = await UserAPI.me(); } catch {}
  const id_usuario = me?.id_usuario || me?.id || null;

  let latest = null;
  try { latest = await PsychAPI.latest(id_usuario); } catch {}
  const profile = (latest && typeof latest.final_estado === 'object' && Object.keys(latest.final_estado).length > 0)
    ? latest.final_estado
    : null;

  if (!profile) {
    if (!confirm('No encontramos tu perfil psicosocial guardado. ¿Deseas simular de todos modos sin perfil?')) {
      alert('Ve al Cuestionario, completa y guarda tu perfil antes de simular.');
      return;
    }
  }

  try {
    const resultado = await SimulationAPI.simulate(profile || {}, semesterConfig, {});

    const totalesPorMateria = materiasSeleccionadas.reduce((acc, m) => {
      acc[m.code] = m.unidades?.length || 0;
      return acc;
    }, {});
    const namesMap = materiasSeleccionadas.reduce((acc, m) => { acc[m.code] = m.nombre; return acc; }, {});
    const unitNamesMap = materiasSeleccionadas.reduce((acc, m) => {
      acc[m.code] = {};
      (m.unidades || []).forEach(u => { acc[m.code][u.unidad_index] = u.nombre; });
      return acc;
    }, {});

    localStorage.setItem('reticula_selection', JSON.stringify(selectedCodes));
    localStorage.setItem('simulator_history', JSON.stringify(resultado.history));
    localStorage.setItem('simulator_resumen', JSON.stringify(resultado.resumen || []));
    localStorage.setItem('simulator_final_estado', JSON.stringify(profile || {}));
    localStorage.setItem('simulator_selection', JSON.stringify(materiasSeleccionadas));
    localStorage.setItem('simulator_totales_materia', JSON.stringify(totalesPorMateria));
    localStorage.setItem('simulator_names_map', JSON.stringify(namesMap));
    localStorage.setItem('simulator_unit_names', JSON.stringify(unitNamesMap));

    window.location.assign('/simulador/');
  } catch (e) {
    const status = e?.response?.status;
    const msg = e?.response?.data?.error || e?.message || 'Error desconocido';
    console.error('Simulate error:', e);
    alert(`Error al simular (${status || 'sin código'}): ${msg}`);
  }
}
</script>

<style scoped>
.sticky-panel {
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}
.reticula-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
}
.semestre-column {
  min-width: 240px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
}
.semestre-column:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  border-color: #CBD5E1;
}
.semestre-header {
  color: white;
  padding: 18px;
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
}
.materias-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #FAFBFC;
  min-height: 400px;
}
.materia-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
}
.materia-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}
.materia-card.seleccionada {
  border-color: #3B82F6;
  background: linear-gradient(135deg, #ffffff 0%, #EFF6FF 100%);
}
.materia-codigo {
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.materia-nombre {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.4;
  min-height: 42px;
  color: #0F172A;
}
.materia-creditos {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}
@media (max-width: 960px) {
  .reticula-grid {
    grid-template-columns: 1fr;
  }
}
</style>
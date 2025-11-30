<template>
  <v-container fluid class="pa-4">
    <v-row>
      <!-- Panel lateral izquierdo -->
      <v-col cols="12" md="3">
        <v-card elevation="3" class="sticky-panel">
          <v-card-title class="bg-primary text-white">
            <v-icon class="mr-2">mdi-school</v-icon>
            Mi Progreso Académico
          </v-card-title>
          
          <v-card-text>
            <!-- Resumen de avance -->
            <div class="mb-4">
              <div class="text-h6 mb-2">Avance General</div>
              <v-progress-linear
                :model-value="porcentajeAvance"
                color="primary"
                height="25"
                rounded
              >
                <template v-slot:default>
                  <strong>{{ porcentajeAvance.toFixed(1) }}%</strong>
                </template>
              </v-progress-linear>
            </div>

            <!-- Créditos -->
            <v-row class="mb-4">
              <v-col cols="6">
                <v-card color="success" dark>
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ creditosObtenidos }}</div>
                    <div class="text-caption">Créditos</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card color="info" dark>
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ totalCreditos }}</div>
                    <div class="text-caption">Total</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Promedio -->
            <v-card class="mb-4" color="primary" dark>
              <v-card-text class="text-center">
                <div class="text-h3">{{ promedioGeneral }}</div>
                <div class="text-subtitle-1">Promedio General</div>
              </v-card-text>
            </v-card>

            <!-- Estadísticas por semestre -->
            <div class="mb-4">
              <div class="text-h6 mb-2">Materias por Estado</div>
              <v-list dense>
                <v-list-item>
                  <v-list-item-title>
                    <v-chip color="success" size="small" class="mr-2">
                      {{ materiasAprobadas.length }}
                    </v-chip>
                    Aprobadas
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-chip color="info" size="small" class="mr-2">
                      {{ materiasDisponibles.length }}
                    </v-chip>
                    Disponibles
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    <v-chip color="grey" size="small" class="mr-2">
                      {{ materiasBloqueadas.length }}
                    </v-chip>
                    Bloqueadas
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </div>

            <!-- Botones de acción -->
            <v-divider class="my-4"></v-divider>
            
            <!-- Actividades Especiales -->
            <div class="mb-4">
              <div class="text-subtitle-2 font-weight-bold mb-2">Actividades Especiales</div>
              
              <!-- Actividades Complementarias -->
              <v-card 
                class="mb-2 pa-2" 
                :color="materiasCursadas['ACT-COMP'] ? 'success' : 'orange-lighten-5'"
                variant="outlined"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-body-2 font-weight-bold">
                      Actividades Complementarias
                      <v-chip size="x-small" color="orange" class="ml-2">5 créditos</v-chip>
                    </div>
                    <div class="text-caption text-grey-darken-1">
                      Culturales o deportivas (Semestres 1-6)
                    </div>
                  </div>
                  <v-btn
                    v-if="!materiasCursadas['ACT-COMP']"
                    size="small"
                    color="orange"
                    @click="abrirAgregarEspecial('ACT-COMP')"
                  >
                    Agregar
                  </v-btn>
                  <v-icon v-else color="success">mdi-check-circle</v-icon>
                </div>
              </v-card>

              <!-- Servicio Social -->
              <v-card 
                class="mb-2 pa-2" 
                :color="materiasCursadas['SERVICIO-SOCIAL'] ? 'success' : 'blue-lighten-5'"
                variant="outlined"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-body-2 font-weight-bold">
                      Servicio Social
                      <v-chip size="x-small" color="blue" class="ml-2">10 créditos</v-chip>
                    </div>
                    <div class="text-caption text-grey-darken-1">
                      480 horas (Semestres 7-8)
                    </div>
                  </div>
                  <v-btn
                    v-if="!materiasCursadas['SERVICIO-SOCIAL']"
                    size="small"
                    color="blue"
                    @click="abrirAgregarEspecial('SERVICIO-SOCIAL')"
                  >
                    Agregar
                  </v-btn>
                  <v-icon v-else color="success">mdi-check-circle</v-icon>
                </div>
              </v-card>

              <!-- Residencia Profesional -->
              <v-card 
                class="mb-2 pa-2" 
                :color="materiasCursadas['RESIDENCIA'] ? 'success' : 'grey-lighten-4'"
                variant="outlined"
              >
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-body-2 font-weight-bold">
                      Residencia Profesional
                      <v-chip size="x-small" color="grey" class="ml-2">10 créditos</v-chip>
                    </div>
                    <div class="text-caption text-grey-darken-1">
                      Semestre 9
                    </div>
                  </div>
                  <v-btn
                    v-if="!materiasCursadas['RESIDENCIA']"
                    size="small"
                    color="grey"
                    @click="abrirAgregarEspecial('RESIDENCIA')"
                  >
                    Agregar
                  </v-btn>
                  <v-icon v-else color="success">mdi-check-circle</v-icon>
                </div>
              </v-card>
            </div>

            <v-btn block color="primary" class="mb-2" @click="dialogAgregarMateria = true">
              <v-icon class="mr-2">mdi-plus</v-icon>
              Agregar Materia Cursada
            </v-btn>
            <v-btn block color="secondary" variant="outlined" @click="dialogHistorial = true">
              <v-icon class="mr-2">mdi-history</v-icon>
              Ver Historial Académico
            </v-btn>
            <v-btn block color="warning" variant="outlined" class="mt-2" @click="dialogCerrarSemestre = true">
              <v-icon class="mr-2">mdi-archive</v-icon>
              Cerrar Semestre Actual
            </v-btn>
            <v-btn block color="secondary" variant="outlined" @click="reiniciarProgreso">
              <v-icon class="mr-2">mdi-refresh</v-icon>
              Reiniciar Todo
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Retícula principal -->
      <v-col cols="12" md="9">
        <v-card elevation="3">
          <v-card-title class="bg-primary text-white d-flex justify-space-between align-center">
            <div>
              <v-icon class="mr-2">mdi-view-grid</v-icon>
              Retícula Curricular - Ingeniería en Sistemas Computacionales
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
            <!-- Vista de cuadrícula -->
            <div v-if="vistaActual === 'grid'" class="reticula-grid">
              <div v-for="sem in 9" :key="sem" class="semestre-column">
                <div class="semestre-header">
                  Semestre {{ sem }}
                </div>
                <div class="materias-container">
                  <div
                    v-for="materia in getMateriasPorSemestre(sem)"
                    :key="materia.id"
                    :class="['materia-card', getEstadoMateria(materia.id)]"
                    @click="abrirDetalleMateria(materia)"
                  >
                    <div class="materia-codigo">{{ materia.id }}</div>
                    <div class="materia-nombre">{{ materia.nombre }}</div>
                    <div class="materia-creditos">{{ materia.creditos }} créditos</div>
                    <v-icon v-if="materiasCursadas[materia.id]" class="materia-check">
                      mdi-check-circle
                    </v-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- Vista de lista -->
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
                        :key="materia.id"
                        @click="abrirDetalleMateria(materia)"
                        :class="getEstadoMateria(materia.id)"
                      >
                        <template v-slot:prepend>
                          <v-icon v-if="materiasCursadas[materia.id]" color="success">
                            mdi-check-circle
                          </v-icon>
                          <v-icon v-else-if="puedeSerCursada(materia.id)" color="info">
                            mdi-circle-outline
                          </v-icon>
                          <v-icon v-else color="grey">
                            mdi-lock
                          </v-icon>
                        </template>
                        <v-list-item-title>{{ materia.nombre }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ materia.id }} - {{ materia.creditos }} créditos
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

    <!-- Diálogo de detalles de materia -->
    <v-dialog v-model="dialogDetalle" max-width="600">
      <v-card v-if="materiaSeleccionada">
        <v-card-title :style="{ backgroundColor: materiaSeleccionada.color, color: 'white' }">
          {{ materiaSeleccionada.nombre }}
        </v-card-title>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="6">
              <div class="text-caption">Código</div>
              <div class="text-h6">{{ materiaSeleccionada.id }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Créditos</div>
              <div class="text-h6">{{ materiaSeleccionada.creditos }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Horas Teoría</div>
              <div class="text-h6">{{ materiaSeleccionada.horas.teoria }}</div>
            </v-col>
            <v-col cols="6">
              <div class="text-caption">Horas Práctica</div>
              <div class="text-h6">{{ materiaSeleccionada.horas.practica }}</div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <!-- Requisitos -->
          <div v-if="materiaSeleccionada.requisitos.length > 0" class="mb-4">
            <div class="text-subtitle-1 font-weight-bold mb-2">Requisitos:</div>
            <v-chip
              v-for="req in materiaSeleccionada.requisitos"
              :key="req"
              size="small"
              class="mr-2 mb-2"
              :color="materiasCursadas[req] ? 'success' : 'grey'"
            >
              {{ req }}
              <v-icon v-if="materiasCursadas[req]" end>mdi-check</v-icon>
            </v-chip>
          </div>
          <div v-else class="mb-4">
            <v-alert type="info" density="compact">
              Esta materia no tiene requisitos previos
            </v-alert>
          </div>

          <!-- Estado actual -->
          <v-alert
            v-if="materiasCursadas[materiaSeleccionada.id]?.calificacion >= 70"
            type="success"
            density="compact"
            class="mb-4"
          >
            Materia APROBADA - Calificación: {{ materiasCursadas[materiaSeleccionada.id].calificacion }}
          </v-alert>
          <v-alert
            v-else-if="materiasCursadas[materiaSeleccionada.id]?.calificacion < 70"
            type="error"
            density="compact"
            class="mb-4"
          >
            Materia REPROBADA - Calificación: {{ materiasCursadas[materiaSeleccionada.id].calificacion }}
            <div class="text-caption mt-1">Necesitas mínimo 70 para aprobar y desbloquear las siguientes materias</div>
          </v-alert>
          <v-alert
            v-else-if="puedeSerCursada(materiaSeleccionada.id)"
            type="info"
            density="compact"
            class="mb-4"
          >
            ✓ Puedes cursar esta materia (requisitos cumplidos)
          </v-alert>
          <v-alert v-else type="warning" density="compact" class="mb-4">
            ⚠ Debes aprobar (≥70) los requisitos previos primero
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="materiasCursadas[materiaSeleccionada.id]"
            color="error"
            variant="outlined"
            @click="eliminarMateria(materiaSeleccionada.id)"
          >
            Eliminar
          </v-btn>
          <v-btn
            v-else-if="puedeSerCursada(materiaSeleccionada.id)"
            color="success"
            variant="elevated"
            @click="abrirAgregarCalificacion(materiaSeleccionada)"
          >
            Marcar como Cursada
          </v-btn>
          <v-btn variant="text" @click="dialogDetalle = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para agregar materia cursada -->
    <v-dialog v-model="dialogAgregarMateria" max-width="500">
      <v-card>
        <v-card-title class="bg-primary text-white">
          Agregar Materia Cursada
        </v-card-title>
        <v-card-text class="pt-4">
          <v-select
            v-model="nuevaMateriaId"
            :items="materiasDisponibles"
            item-title="nombre"
            item-value="id"
            label="Selecciona una materia"
            :hint="`${materiasDisponibles.length} materias disponibles para cursar`"
            persistent-hint
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:prepend>
                  <v-chip size="small" :color="item.raw.color" class="mr-2">
                    {{ item.raw.id }}
                  </v-chip>
                </template>
              </v-list-item>
            </template>
          </v-select>

          <v-text-field
            v-model.number="nuevaCalificacion"
            label="Calificación (0-100)"
            type="number"
            min="0"
            max="100"
            class="mt-4"
            hint="Calificación mínima para aprobar: 70"
            persistent-hint
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogAgregarMateria = false">Cancelar</v-btn>
          <v-btn
            color="primary"
            :disabled="!nuevaMateriaId || nuevaCalificacion < 0 || nuevaCalificacion > 100"
            @click="agregarMateriaCursada"
          >
            Agregar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Diálogo para cerrar semestre -->
    <v-dialog v-model="dialogCerrarSemestre" max-width="600">
      <v-card>
        <v-card-title class="bg-warning">
          <v-icon class="mr-2">mdi-archive</v-icon>
          Cerrar Semestre Actual
        </v-card-title>
        <v-card-text class="pt-4">
          <v-alert type="info" density="compact" class="mb-4">
            Al cerrar el semestre, todas tus materias actuales se guardarán en el historial 
            y podrás comenzar un nuevo periodo limpio.
          </v-alert>

          <div class="mb-4">
            <div class="text-h6 mb-2">Resumen del Semestre Actual</div>
            <v-row>
              <v-col cols="6">
                <v-card color="primary" dark>
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ materiasAprobadas.length }}</div>
                    <div class="text-caption">Materias Cursadas</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card color="success" dark>
                  <v-card-text class="text-center">
                    <div class="text-h4">{{ promedioGeneral }}</div>
                    <div class="text-caption">Promedio</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <v-text-field
            v-model="nombreSemestreCerrar"
            label="Nombre del semestre (ej: Semestre 1 - 2024A)"
            placeholder="Semestre 1"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogCerrarSemestre = false">Cancelar</v-btn>
          <v-btn 
            color="warning" 
            @click="cerrarSemestreActual"
            :disabled="!nombreSemestreCerrar || materiasAprobadas.length === 0"
          >
            Guardar y Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de historial académico -->
    <v-dialog v-model="dialogHistorial" max-width="900" scrollable>
      <v-card>
        <v-card-title class="bg-primary text-white">
          <v-icon class="mr-2">mdi-history</v-icon>
          Historial Académico
        </v-card-title>
        <v-card-text class="pa-4" style="max-height: 70vh;">
          <div v-if="historialSemestres.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-history</v-icon>
            <div class="text-h6 text-grey mt-4">No hay semestres guardados</div>
            <div class="text-caption text-grey">
              Cuando cierres tu primer semestre, aparecerá aquí
            </div>
          </div>

          <v-expansion-panels v-else>
            <v-expansion-panel
              v-for="(semestre, index) in historialSemestres"
              :key="index"
            >
              <v-expansion-panel-title>
                <div class="d-flex justify-space-between align-center w-100 pr-4">
                  <div>
                    <span class="font-weight-bold">{{ semestre.nombre }}</span>
                    <v-chip size="small" class="ml-2">{{ semestre.materias.length }} materias</v-chip>
                  </div>
                  <div>
                    <v-chip color="success" size="small">
                      Promedio: {{ semestre.promedio }}
                    </v-chip>
                  </div>
                </div>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-simple-table density="compact">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Materia</th>
                        <th>Créditos</th>
                        <th>Calificación</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="materia in semestre.materias" :key="materia.id">
                        <td>{{ materia.id }}</td>
                        <td>{{ materia.nombre }}</td>
                        <td>{{ materia.creditos }}</td>
                        <td>
                          <v-chip 
                            size="small" 
                            :color="materia.calificacion >= 70 ? 'success' : 'error'"
                          >
                            {{ materia.calificacion }}
                          </v-chip>
                        </td>
                        <td>
                          <v-chip 
                            size="small" 
                            :color="materia.calificacion >= 70 ? 'success' : 'error'"
                          >
                            {{ materia.calificacion >= 70 ? 'Aprobada' : 'Reprobada' }}
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-divider class="my-2"></v-divider>
                <div class="text-caption text-grey">
                  Guardado el: {{ new Date(semestre.fecha).toLocaleDateString() }}
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialogHistorial = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { materiasData, getTotalCreditos } from '@/data/reticula.js';

const vistaActual = ref('grid');
const dialogDetalle = ref(false);
const dialogAgregarMateria = ref(false);
const dialogHistorial = ref(false);
const dialogCerrarSemestre = ref(false);
const materiaSeleccionada = ref(null);
const nuevaMateriaId = ref(null);
const nuevaCalificacion = ref(100);
const nombreSemestreCerrar = ref('');

// Estructura: { 'ACF-0901': { calificacion: 95, fecha: '2024-01-15' }, ... }
const materiasCursadas = ref({});

// Historial de semestres cerrados
const historialSemestres = ref([]);

// Totales
const totalCreditos = getTotalCreditos();

// Obtener materias por semestre
const getMateriasPorSemestre = (semestre) => {
  return materiasData.filter(m => m.semestre === semestre);
};

// Verificar si una materia puede ser cursada (requisitos cumplidos)
const puedeSerCursada = (materiaId) => {
  const materia = materiasData.find(m => m.id === materiaId);
  if (!materia) return false;
  
  // Si ya está cursada, no puede ser cursada de nuevo
  if (materiasCursadas.value[materiaId]) return false;
  
  // Verificar que todos los requisitos estén cumplidos Y aprobados (calificación >= 70)
  return materia.requisitos.every(req => {
    const cursada = materiasCursadas.value[req];
    return cursada && cursada.calificacion >= 70;
  });
};

// Obtener estado visual de la materia
const getEstadoMateria = (materiaId) => {
  const cursada = materiasCursadas.value[materiaId];
  if (cursada && cursada.calificacion >= 70) return 'aprobada';
  if (cursada && cursada.calificacion < 70) return 'reprobada';
  if (puedeSerCursada(materiaId)) return 'disponible';
  return 'bloqueada';
};

// Materias aprobadas (calificación >= 70)
const materiasAprobadas = computed(() => {
  return materiasData.filter(m => {
    const cursada = materiasCursadas.value[m.id];
    return cursada && cursada.calificacion >= 70;
  });
});

// Materias reprobadas (calificación < 70)
const materiasReprobadas = computed(() => {
  return materiasData.filter(m => {
    const cursada = materiasCursadas.value[m.id];
    return cursada && cursada.calificacion < 70;
  });
});

// Materias disponibles para cursar
const materiasDisponibles = computed(() => {
  return materiasData.filter(m => puedeSerCursada(m.id));
});

// Materias bloqueadas
const materiasBloqueadas = computed(() => {
  return materiasData.filter(m => 
    !materiasCursadas.value[m.id] && !puedeSerCursada(m.id)
  );
});

// Créditos obtenidos
const creditosObtenidos = computed(() => {
  return materiasAprobadas.value.reduce((total, m) => total + m.creditos, 0);
});

// Porcentaje de avance
const porcentajeAvance = computed(() => {
  return (creditosObtenidos.value / totalCreditos) * 100;
});

// Promedio general
const promedioGeneral = computed(() => {
  const calificaciones = Object.values(materiasCursadas.value);
  if (calificaciones.length === 0) return '0.00';
  
  const suma = calificaciones.reduce((total, m) => total + m.calificacion, 0);
  return (suma / calificaciones.length).toFixed(2);
});

// Abrir detalle de materia
const abrirDetalleMateria = (materia) => {
  materiaSeleccionada.value = materia;
  dialogDetalle.value = true;
};

// Abrir diálogo para agregar calificación
const abrirAgregarCalificacion = (materia) => {
  dialogDetalle.value = false;
  nuevaMateriaId.value = materia.id;
  dialogAgregarMateria.value = true;
};

// Abrir agregar actividad especial
const abrirAgregarEspecial = (materiaId) => {
  nuevaMateriaId.value = materiaId;
  nuevaCalificacion.value = 100; // Siempre aprobadas
  dialogAgregarMateria.value = true;
};

// Agregar materia cursada
const agregarMateriaCursada = () => {
  if (!nuevaMateriaId.value || nuevaCalificacion.value < 0 || nuevaCalificacion.value > 100) {
    return;
  }
  
  materiasCursadas.value[nuevaMateriaId.value] = {
    calificacion: nuevaCalificacion.value,
    fecha: new Date().toISOString().split('T')[0]
  };
  
  // Reiniciar valores
  nuevaMateriaId.value = null;
  nuevaCalificacion.value = 100;
  dialogAgregarMateria.value = false;
};

// Eliminar materia
const eliminarMateria = (materiaId) => {
  delete materiasCursadas.value[materiaId];
  dialogDetalle.value = false;
};

// Cerrar semestre actual y guardar en historial
const cerrarSemestreActual = () => {
  if (materiasAprobadas.value.length === 0) return;
  
  // Crear registro del semestre
  const semestreData = {
    nombre: nombreSemestreCerrar.value,
    fecha: new Date().toISOString(),
    promedio: promedioGeneral.value,
    materias: materiasAprobadas.value.map(m => ({
      id: m.id,
      nombre: m.nombre,
      creditos: m.creditos,
      calificacion: materiasCursadas.value[m.id].calificacion
    }))
  };
  
  // Agregar al historial
  historialSemestres.value.push(semestreData);
  
  // Limpiar materias cursadas actuales
  materiasCursadas.value = {};
  nombreSemestreCerrar.value = '';
  dialogCerrarSemestre.value = false;
  
  // Mostrar mensaje de éxito
  alert(`Semestre "${semestreData.nombre}" guardado exitosamente. Promedio: ${semestreData.promedio}`);
};

// Reiniciar progreso
const reiniciarProgreso = () => {
  if (confirm('¿Estás seguro de que quieres reiniciar TODO tu progreso? Esto borrará también tu historial de semestres.')) {
    materiasCursadas.value = {};
    historialSemestres.value = [];
  }
};
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px;
}

.semestre-column {
  min-width: 200px;
}

.semestre-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px 8px 0 0;
  font-size: 16px;
}

.materias-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 0 0 8px 8px;
  min-height: 400px;
}

.materia-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.materia-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.materia-card.aprobada {
  border-left-color: #4CAF50;
  background: linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%);
}

.materia-card.disponible {
  border-left-color: #2196F3;
  background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
}

.materia-card.reprobada {
  border-left-color: #f44336;
  background: linear-gradient(135deg, #ffffff 0%, #ffebee 100%);
  opacity: 0.85;
}

.materia-card.bloqueada {
  border-left-color: #9E9E9E;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  opacity: 0.7;
}

.materia-codigo {
  font-size: 11px;
  font-weight: bold;
  color: #666;
  margin-bottom: 4px;
}

.materia-nombre {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.3;
  min-height: 36px;
}

.materia-creditos {
  font-size: 11px;
  color: #888;
}

.materia-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #4CAF50;
  font-size: 20px;
}

@media (max-width: 960px) {
  .reticula-grid {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div>
    <div class="d-flex align-center mb-2">
      <v-icon class="mr-2">mdi-table</v-icon>
      <span class="text-subtitle-2">Resumen por materia</span>
    </div>
    <v-simple-table density="compact" v-if="resumen?.length">
      <template #default>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Aprobadas</th>
            <th>Totales</th>
            <th>Avance</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in resumen" :key="row.materiaId">
            <td>{{ displayName(row.materiaId) }}</td>
            <td>{{ row.aprobadas }}</td>
            <td>{{ row.totales }}</td>
            <td style="min-width: 180px;">
              <v-progress-linear
                :model-value="row.pct * 100"
                height="10"
                rounded
                :color="row.pct >= 0.7 ? 'success' : row.pct >= 0.4 ? 'warning' : 'error'"
              >
                <template #default>{{ (row.pct * 100).toFixed(1) }}%</template>
              </v-progress-linear>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div v-else class="text-caption text-grey">Sin datos</div>
  </div>
</template>

<script setup>
const props = defineProps({
  resumen: { type: Array, default: () => [] },
  namesMap: { type: Object, default: () => ({}) }
});
function displayName(id) { return props.namesMap[id] || String(id).replace(/_/g, ' '); }
</script>
import { computed, ref, unref } from 'vue';

export function useSimulationMapping(historyRef, totalUnidadesPorMateria) {
  const activeWeek = ref(0);

  const materiaUnidadStates = computed(() => {
    const history = unref(historyRef) || [];
    const map = {};
    const materias = new Set();
    history.forEach(w => w.eventos.forEach(ev => materias.add(ev.materiaId)));

    materias.forEach(m => {
      map[m] = {};
      for (let u = 0; u < totalUnidadesPorMateria; u++) {
        map[m][u] = { status: 'future' };
      }
    });

    history.forEach(sem => {
      sem.eventos.forEach(ev => {
        if (!map[ev.materiaId]) map[ev.materiaId] = {};
        const current = map[ev.materiaId][ev.unidadIndex] || { status: 'future' };
        if (ev.week <= activeWeek.value) {
          if (ev.paso) current.status = 'passed';
          else if (ev.scoreFinal >= 0.5) current.status = 'risk';
          else current.status = 'failed';
        } else {
          current.status = 'future';
        }
        current.score = ev.week <= activeWeek.value ? ev.scoreFinal : undefined;
        current.detalle = ev.week <= activeWeek.value ? ev.detalle : undefined;
        current.week = ev.week;
        map[ev.materiaId][ev.unidadIndex] = current;
      });
    });

    materias.forEach(m => {
      Object.entries(map[m]).forEach(([unidadIndex, cell]) => {
        if (cell.status === 'future') {
          const anyPastEvent = history.some(h => h.week <= activeWeek.value && h.eventos.some(e => e.materiaId === m));
          if (anyPastEvent && activeWeek.value > 0) {
            cell.status = 'pending';
          }
        }
      });
    });

    return map;
  });

  const progresoMaterias = computed(() => {
    const map = materiaUnidadStates.value;
    return Object.entries(map).map(([materiaId, unidadesMap]) => {
      const total = Object.keys(unidadesMap).length;
      const aprobadas = Object.values(unidadesMap).filter(u => u.status === 'passed').length;
      return { materiaId, aprobadas, total, pct: total === 0 ? 0 : aprobadas / total };
    });
  });

  return {
    activeWeek,
    materiaUnidadStates,
    progresoMaterias
  };
}
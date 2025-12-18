export const materiasData = [

  {
    id: 'ACF-0901',
    nombre: 'Cálculo Diferencial',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 1,
    requisitos: [],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'AED-1285',
    nombre: 'Fundamentos de Programación',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 1,
    requisitos: [],
    area: 'programacion',
    color: '#2196F3'
  },
  {
    id: 'ACA-0907',
    nombre: 'Taller de Ética',
    creditos: 4,
    horas: { teoria: 1, practica: 4 },
    semestre: 1,
    requisitos: [],
    area: 'sociohumanisticas',
    color: '#9C27B0'
  },
  {
    id: 'AEF-1041',
    nombre: 'Matemáticas Discretas',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 1,
    requisitos: [],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'SCH-1024',
    nombre: 'Taller de Administración',
    creditos: 4,
    horas: { teoria: 1, practica: 3 },
    semestre: 1,
    requisitos: [],
    area: 'administracion',
    color: '#FF9800'
  },
  {
    id: 'ACD-0908',
    nombre: 'Desarrollo Sustentable',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 1,
    requisitos: [],
    area: 'sociohumanisticas',
    color: '#9C27B0'
  },

  {
    id: 'ACF-0902',
    nombre: 'Cálculo Integral',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 2,
    requisitos: ['ACF-0901'],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'AED-1286',
    nombre: 'Programación Orientada a Objetos',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 2,
    requisitos: ['AED-1285'],
    area: 'programacion',
    color: '#2196F3'
  },
  {
    id: 'AEC-1008',
    nombre: 'Contabilidad Financiera',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 2,
    requisitos: [],
    area: 'administracion',
    color: '#FF9800'
  },
  {
    id: 'AEC-1058',
    nombre: 'Química',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 2,
    requisitos: [],
    area: 'ciencias_basicas',
    color: '#00BCD4'
  },
  {
    id: 'ACF-0903',
    nombre: 'Álgebra Lineal',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 2,
    requisitos: [],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'AEF-1052',
    nombre: 'Probabilidad y Estadística',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 2,
    requisitos: [],
    area: 'matematicas',
    color: '#4CAF50'
  },

  {
    id: 'ACF-0904',
    nombre: 'Cálculo Vectorial',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 3,
    requisitos: ['ACF-0902'],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'AED-1026',
    nombre: 'Estructura de Datos',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 3,
    requisitos: ['AED-1286', 'AEF-1041'],
    area: 'programacion',
    color: '#2196F3'
  },
  {
    id: 'SCC-1005',
    nombre: 'Cultura Empresarial',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 3,
    requisitos: [],
    area: 'administracion',
    color: '#FF9800'
  },
  {
    id: 'SCC-1013',
    nombre: 'Investigación de Operaciones',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 3,
    requisitos: [],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'ACC-0906',
    nombre: 'Fundamentos de Investigación',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 3,
    requisitos: [],
    area: 'investigacion',
    color: '#FFC107'
  },
  {
    id: 'SCF-1006',
    nombre: 'Física General',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 3,
    requisitos: [],
    area: 'ciencias_basicas',
    color: '#00BCD4'
  },

  {
    id: 'ACF-0905',
    nombre: 'Ecuaciones Diferenciales',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 4,
    requisitos: ['ACF-0904'],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'SCC-1017',
    nombre: 'Métodos Numéricos',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 4,
    requisitos: [],
    area: 'matematicas',
    color: '#4CAF50'
  },
  {
    id: 'SCD-1027',
    nombre: 'Tópicos Avanzados de Programación',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 4,
    requisitos: ['AED-1026'],
    area: 'programacion',
    color: '#2196F3'
  },
  {
    id: 'AEF-1031',
    nombre: 'Fundamentos de Base de Datos',
    creditos: 5,
    horas: { teoria: 3, practica: 2 },
    semestre: 4,
    requisitos: ['AEF-1041'],
    area: 'bases_datos',
    color: '#E91E63'
  },
  {
    id: 'SCC-1010',
    nombre: 'Graficación',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 4,
    requisitos: [],
    area: 'programacion',
    color: '#2196F3'
  },
  {
    id: 'SCD-1018',
    nombre: 'Principios Eléctricos y Aplicaciones Digitales',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 4,
    requisitos: ['SCF-1006'],
    area: 'hardware',
    color: '#FF5722'
  },

  {
    id: 'SCD-1015',
    nombre: 'Lenguajes y Autómatas I',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 5,
    requisitos: ['AED-1026'],
    area: 'teoria_computacion',
    color: '#3F51B5'
  },
  {
    id: 'AEC-1034',
    nombre: 'Fundamentos de Telecomunicaciones',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 5,
    requisitos: ['SCD-1018'],
    area: 'redes',
    color: '#009688'
  },
  {
    id: 'SCA-1025',
    nombre: 'Taller de Base de Datos',
    creditos: 4,
    horas: { teoria: 0, practica: 4 },
    semestre: 5,
    requisitos: ['AEF-1031'],
    area: 'bases_datos',
    color: '#E91E63'
  },
  {
    id: 'AEC-1061',
    nombre: 'Sistemas Operativos',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 5,
    requisitos: [],
    area: 'sistemas',
    color: '#607D8B'
  },
  {
    id: 'SCD-1022',
    nombre: 'Simulación',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 5,
    requisitos: ['AEF-1031'],
    area: 'programacion',
    color: '#2196F3'
  },
  {
    id: 'SCD-1003',
    nombre: 'Arquitectura de Computadoras',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 5,
    requisitos: ['SCD-1018'],
    area: 'hardware',
    color: '#FF5722'
  },

  {
    id: 'SCD-1016',
    nombre: 'Lenguajes y Autómatas II',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 6,
    requisitos: ['SCD-1015'],
    area: 'teoria_computacion',
    color: '#3F51B5'
  },
  {
    id: 'SCD-1021',
    nombre: 'Redes de Computadoras',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 6,
    requisitos: ['AEC-1034'],
    area: 'redes',
    color: '#009688'
  },
  {
    id: 'SCB-1001',
    nombre: 'Administración de Base de Datos',
    creditos: 5,
    horas: { teoria: 1, practica: 4 },
    semestre: 6,
    requisitos: ['SCA-1025'],
    area: 'bases_datos',
    color: '#E91E63'
  },
  {
    id: 'SCA-1026',
    nombre: 'Taller de Sistemas Operativos',
    creditos: 4,
    horas: { teoria: 0, practica: 4 },
    semestre: 6,
    requisitos: ['AEC-1061'],
    area: 'sistemas',
    color: '#607D8B'
  },
  {
    id: 'SCC-1007',
    nombre: 'Fundamentos de Ingeniería de Software',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 6,
    requisitos: [],
    area: 'ingenieria_software',
    color: '#795548'
  },
  {
    id: 'SCC-1014',
    nombre: 'Lenguajes de Interfaz',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 6,
    requisitos: ['SCD-1003'],
    area: 'programacion',
    color: '#2196F3'
  },

  {
    id: 'SCC-1019',
    nombre: 'Programación Lógica y Funcional',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 7,
    requisitos: ['SCD-1016'],
    area: 'programacion',
    color: '#2196F3'
  },
  {
    id: 'SCD-1004',
    nombre: 'Conmutación y Enrutamiento en Redes de Datos',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 7,
    requisitos: ['SCD-1021'],
    area: 'redes',
    color: '#009688'
  },
  {
    id: 'AEB-1055',
    nombre: 'Programación Web',
    creditos: 5,
    horas: { teoria: 1, practica: 4 },
    semestre: 7,
    requisitos: ['SCB-1001'],
    area: 'web',
    color: '#673AB7'
  },
  {
    id: 'MCD-2103',
    nombre: 'Introducción a la Ingeniería de Datos',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 7,
    requisitos: [],
    area: 'especialidad',
    color: '#000000'
  },
  {
    id: 'SCD-1011',
    nombre: 'Ingeniería de Software',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 7,
    requisitos: ['SCC-1007'],
    area: 'ingenieria_software',
    color: '#795548'
  },
  {
    id: 'SCC-1023',
    nombre: 'Sistemas Programables',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 7,
    requisitos: ['SCC-1014'],
    area: 'hardware',
    color: '#FF5722'
  },
  {
    id: 'ACA-0909',
    nombre: 'Taller de Investigación I',
    creditos: 4,
    horas: { teoria: 0, practica: 4 },
    semestre: 7,
    requisitos: [],
    area: 'investigacion',
    color: '#FFC107'
  },

  {
    id: 'SCC-1012',
    nombre: 'Inteligencia Artificial',
    creditos: 4,
    horas: { teoria: 2, practica: 2 },
    semestre: 8,
    requisitos: ['SCC-1019'],
    area: 'ia',
    color: '#8BC34A'
  },
  {
    id: 'SCA-1002',
    nombre: 'Administración de Redes',
    creditos: 4,
    horas: { teoria: 0, practica: 4 },
    semestre: 8,
    requisitos: ['SCD-1004'],
    area: 'redes',
    color: '#009688'
  },
  {
    id: 'ACA-0910',
    nombre: 'Taller de Investigación II',
    creditos: 4,
    horas: { teoria: 0, practica: 4 },
    semestre: 8,
    requisitos: ['ACA-0909'],
    area: 'investigacion',
    color: '#FFC107'
  },
  {
    id: 'MCD-2101',
    nombre: 'Programación Front End',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 8,
    requisitos: ['MCD-2103'],
    area: 'especialidad',
    color: '#000000'
  },
  {
    id: 'SCG-1009',
    nombre: 'Gestión de Proyectos de Software',
    creditos: 6,
    horas: { teoria: 3, practica: 3 },
    semestre: 8,
    requisitos: ['SCD-1011'],
    area: 'ingenieria_software',
    color: '#795548'
  },
  {
    id: 'MCD-2102',
    nombre: 'Programación Back End',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 8,
    requisitos: ['AEB-1055'],
    area: 'especialidad',
    color: '#000000'
  },

  {
    id: 'MCD-2104',
    nombre: 'Implementación de Aplicaciones de Cómputo Móvil',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 9,
    requisitos: [],
    area: 'especialidad',
    color: '#000000'
  },
  {
    id: 'MCD-2105',
    nombre: 'Internet de las Cosas',
    creditos: 5,
    horas: { teoria: 2, practica: 3 },
    semestre: 9,
    requisitos: [],
    area: 'especialidad',
    color: '#000000'
  },
  {
    id: 'RESIDENCIA',
    nombre: 'Residencia Profesional',
    creditos: 10,
    horas: { teoria: 0, practica: 0 },
    semestre: 9,
    requisitos: [],
    area: 'residencia',
    color: '#9E9E9E'
  },

  {
    id: 'ACT-COMP',
    nombre: 'Actividades Complementarias',
    creditos: 5,
    horas: { teoria: 0, practica: 0 },
    semestre: 0,
    requisitos: [],
    area: 'complementarias',
    color: '#FFA726',
    tipo: 'flexible',
    descripcion: 'Actividades culturales o deportivas. Se recomienda completar en los primeros 6 semestres.'
  },

  {
    id: 'SERVICIO-SOCIAL',
    nombre: 'Servicio Social',
    creditos: 10,
    horas: { teoria: 0, practica: 0 },
    semestre: 0,
    requisitos: [],
    area: 'servicio_social',
    color: '#42A5F5',
    tipo: 'flexible',
    descripcion: 'Se realiza entre el 7mo y 8vo semestre. Equivale a 480 horas de servicio.'
  }
];

export const areasInfo = {
  matematicas: { nombre: 'Matemáticas', color: '#4CAF50' },
  programacion: { nombre: 'Programación', color: '#2196F3' },
  sociohumanisticas: { nombre: 'Socio-humanísticas', color: '#9C27B0' },
  administracion: { nombre: 'Administración', color: '#FF9800' },
  ciencias_basicas: { nombre: 'Ciencias Básicas', color: '#00BCD4' },
  investigacion: { nombre: 'Investigación', color: '#FFC107' },
  bases_datos: { nombre: 'Bases de Datos', color: '#E91E63' },
  hardware: { nombre: 'Hardware', color: '#FF5722' },
  teoria_computacion: { nombre: 'Teoría de la Computación', color: '#3F51B5' },
  redes: { nombre: 'Redes', color: '#009688' },
  sistemas: { nombre: 'Sistemas', color: '#607D8B' },
  ingenieria_software: { nombre: 'Ingeniería de Software', color: '#795548' },
  web: { nombre: 'Desarrollo Web', color: '#673AB7' },
  especialidad: { nombre: 'Especialidad', color: '#000000' },
  ia: { nombre: 'Inteligencia Artificial', color: '#8BC34A' },
  residencia: { nombre: 'Residencia', color: '#9E9E9E' },
  complementarias: { nombre: 'Actividades Complementarias', color: '#FFA726' },
  servicio_social: { nombre: 'Servicio Social', color: '#42A5F5' }
};

export const getTotalCreditos = () => {
  return materiasData.reduce((total, materia) => total + materia.creditos, 0);
};

export const getMateriasByArea = (area) => {
  return materiasData.filter(materia => materia.area === area);
};

export const getRequisitosCumplidos = (materiaId, materiasCursadas) => {
  const materia = materiasData.find(m => m.id === materiaId);
  if (!materia) return false;
  
  return materia.requisitos.every(req => materiasCursadas.includes(req));
};
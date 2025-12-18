import axios from 'axios';

const BASE = import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: true,
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }
}

const saved = localStorage.getItem('auth_token');
if (saved) setToken(saved);

export const PsychAPI = {
  latest: (id_usuario) => {
    const url = id_usuario ? `/psych/latest?id_usuario=${id_usuario}` : `/psych/latest`;
    return api.get(url).then(r => r.data);
  },
  submit: (id_usuario, answers) => api.post('/psych/submit', { id_usuario, answers }).then(r => r.data),
};

export const SimulationAPI = {
  simulate: (profile, semesterConfig, options = {}) =>
    api.post('/simulate/simulate', { profile, semesterConfig, options }).then(r => r.data),
  montecarlo: (n, profile, semesterConfig, options = {}, includeRuns = false) =>
    api.post('/simulate/montecarlo', { n, profile, semesterConfig, options, includeRuns }).then(r => r.data),
};

export const SubjectsAPI = {
  list: (careerId) => {
    const url = (careerId !== undefined && careerId !== null)
      ? `/subjects?career_id=${careerId}`
      : `/subjects`;
    return api.get(url).then(r => r.data);
  },
  get: (id_subject) => api.get(`/subjects/${id_subject}`).then(r => r.data),
};

export const UserAPI = {
  me: () => axios.get(`${BASE}/auth/check-auth`, { withCredentials: true }).then(r => r.data?.user || null),
};

export default api;
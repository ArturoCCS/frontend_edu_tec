import { PsychAPI } from '@/services/api';

export async function requirePsychProfile(to, from, next) {
  try {
    const latest = await PsychAPI.latest();
    if (!latest) return next({ name: 'Cuestionario' });
    return next();
  } catch {
    return next({ path: '/login' });
  }
}
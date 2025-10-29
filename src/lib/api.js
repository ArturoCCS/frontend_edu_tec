import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL_BACKEND || 'http://localhost:3000',
  withCredentials: true
})

let bearerToken = null
export function setAuthToken(token) {
  bearerToken = token
}
api.interceptors.request.use((config) => {
  if (bearerToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${bearerToken}`
  }
  return config
})
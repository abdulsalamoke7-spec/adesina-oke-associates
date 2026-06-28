import axios from 'axios'

const api = axios.create({
  baseURL: 'https://adesina-oke-associates.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ao_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// If token expires, clear it and redirect to home
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ao_token')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api

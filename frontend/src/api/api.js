import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

export const fetchKPISummary          = () => api.get('kpis/summary/')
export const fetchProviderBenchmark   = () => api.get('providers/benchmark/')
export const fetchNPSBreakdown        = () => api.get('nps/breakdown/')
export const fetchServiceSatisfaction = () => api.get('providers/satisfaction/')
export const fetchRegionalSatisfaction= () => api.get('regions/satisfaction/')
export const fetchComplaintCategories = () => api.get('complaints/categories/')
export const fetchComplaintResolution = () => api.get('complaints/resolution/')
export const fetchChurnSegments       = () => api.get('customers/churn-segments/')
export const fetchSpendDistribution   = () => api.get('customers/spend-distribution/')

export default api
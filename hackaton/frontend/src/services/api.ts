import axios from 'axios'

// Use relative URL - Vite dev server will proxy /api requests to backend
const API_BASE = '/api'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Documents API
export const documentsApi = {
  getAll: () => api.get('/documents'),
  get: (id: string) => api.get(`/documents/${id}`),
  create: (data: { title: string; content?: any[] }) => api.post('/documents', data),
  update: (id: string, data: { title?: string; content?: any[] }) => api.put(`/documents/${id}`, data),
  delete: (id: string) => api.delete(`/documents/${id}`),
}

// Tables API
export const tablesApi = {
  getAll: () => api.get('/tables'),
  get: (id: string) => api.get(`/tables/${id}`),
  createRecord: (tableId: string, data: Record<string, any>) => 
    api.post(`/tables/${tableId}/records`, data),
  updateRecord: (tableId: string, recordId: string, data: Record<string, any>) => 
    api.put(`/tables/${tableId}/records/${recordId}`, data),
  deleteRecord: (tableId: string, recordId: string) => 
    api.delete(`/tables/${tableId}/records/${recordId}`),
}

// AI API
export const aiApi = {
  generate: (prompt: string, context?: string) => 
    api.post('/ai/generate', { prompt, context }),
  suggest: (content: string, type?: string) => 
    api.post('/ai/suggest', { content, type }),
  summarize: (content: string) => 
    api.post('/ai/summarize', { content }),
}

// Search API
export const searchApi = {
  search: (query: string) => api.get(`/search?q=${encodeURIComponent(query)}`),
}
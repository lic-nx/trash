import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Documents API
export const documentsApi = {
  getAll: () => api.get('/api/documents'),
  get: (id: string) => api.get(`/api/documents/${id}`),
  create: (data: { title: string; content?: any[] }) => api.post('/api/documents', data),
  update: (id: string, data: { title?: string; content?: any[] }) => api.put(`/api/documents/${id}`, data),
  delete: (id: string) => api.delete(`/api/documents/${id}`),
}

// Tables API
export const tablesApi = {
  getAll: () => api.get('/api/tables'),
  get: (id: string) => api.get(`/api/tables/${id}`),
  createRecord: (tableId: string, data: Record<string, any>) => 
    api.post(`/api/tables/${tableId}/records`, data),
  updateRecord: (tableId: string, recordId: string, data: Record<string, any>) => 
    api.put(`/api/tables/${tableId}/records/${recordId}`, data),
  deleteRecord: (tableId: string, recordId: string) => 
    api.delete(`/api/tables/${tableId}/records/${recordId}`),
}

// AI API
export const aiApi = {
  generate: (prompt: string, context?: string) => 
    api.post('/api/ai/generate', { prompt, context }),
  suggest: (content: string, type?: string) => 
    api.post('/api/ai/suggest', { content, type }),
  summarize: (content: string) => 
    api.post('/api/ai/summarize', { content }),
}

// Search API
export const searchApi = {
  search: (query: string) => api.get(`/api/search?q=${encodeURIComponent(query)}`),
}
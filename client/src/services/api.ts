import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Courses API
export const coursesApi = {
  getAll: () => api.get('/courses'),
  getById: (id: number) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: number, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
  addLesson: (courseId: number, data: any) => api.post(`/courses/${courseId}/lessons`, data),
  completeLesson: (courseId: number, lessonId: number, completed: boolean) => 
    api.put(`/courses/${courseId}/lessons/${lessonId}/complete`, { completed }),
};

// Projects API
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getById: (id: number) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: number, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  updateProgress: (id: number, progress: number) => api.put(`/projects/${id}/progress`, { progress }),
};

// Tasks API
export const tasksApi = {
  getAll: (params?: any) => api.get('/tasks', { params }),
  getById: (id: number, params?: any) => api.get(`/tasks/${id}`, { params }),
  create: (data: any) => api.post('/tasks', data),
  update: (id: number, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: number) => api.delete(`/tasks/${id}`),
  toggle: (id: number) => api.put(`/tasks/${id}/toggle`),
  addSubtask: (parentId: number, data: any) => api.post(`/tasks/${parentId}/subtasks`, data),
};

// Notes API
export const notesApi = {
  getAll: (params?: any) => api.get('/notes', { params }),
  getById: (id: number) => api.get(`/notes/${id}`),
  create: (data: any) => api.post('/notes', data),
  update: (id: number, data: any) => api.put(`/notes/${id}`, data),
  delete: (id: number) => api.delete(`/notes/${id}`),
  getAllTags: () => api.get('/notes/tags/all'),
};

// Journal API
export const journalApi = {
  getAll: (params?: any) => api.get('/journal', { params }),
  getById: (id: number) => api.get(`/journal/${id}`),
  getByDate: (date: string) => api.get(`/journal/date/${date}`),
  create: (data: any) => api.post('/journal', data),
  update: (id: number, data: any) => api.put(`/journal/${id}`, data),
  delete: (id: number) => api.delete(`/journal/${id}`),
  getWeeklyInsights: (startDate: string, endDate: string) => 
    api.get('/journal/insights/weekly', { params: { startDate, endDate } }),
};

// Knowledge API
export const knowledgeApi = {
  getAll: (params?: any) => api.get('/knowledge', { params }),
  getById: (id: number) => api.get(`/knowledge/${id}`),
  create: (data: any) => api.post('/knowledge', data),
  update: (id: number, data: any) => api.put(`/knowledge/${id}`, data),
  delete: (id: number) => api.delete(`/knowledge/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/knowledge/${id}/status`, { status }),
  getAllTags: () => api.get('/knowledge/tags/all'),
};

// Flashcards API
export const flashcardsApi = {
  getAllDecks: () => api.get('/flashcards/decks'),
  getDeckById: (id: number) => api.get(`/flashcards/decks/${id}`),
  createDeck: (data: any) => api.post('/flashcards/decks', data),
  updateDeck: (id: number, data: any) => api.put(`/flashcards/decks/${id}`, data),
  deleteDeck: (id: number) => api.delete(`/flashcards/decks/${id}`),
  getCardsByDeck: (deckId: number, params?: any) => api.get(`/flashcards/decks/${deckId}/cards`, { params }),
  getCardById: (id: number) => api.get(`/flashcards/cards/${id}`),
  createCard: (deckId: number, data: any) => api.post(`/flashcards/decks/${deckId}/cards`, data),
  updateCard: (id: number, data: any) => api.put(`/flashcards/cards/${id}`, data),
  deleteCard: (id: number) => api.delete(`/flashcards/cards/${id}`),
  updateCardReviewStatus: (id: number, reviewStatus: string) => 
    api.put(`/flashcards/cards/${id}/review`, { reviewStatus }),
  getCardsForReview: (params?: any) => api.get('/flashcards/review', { params }),
};

export default api;


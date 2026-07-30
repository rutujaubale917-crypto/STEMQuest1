import api from './api'

export const quizService = {
    getQuiz: (id) => api.get(`/quizzes/${id}`),
    submitQuiz: (id, data) => {
        const payload = Array.isArray(data) ? { answers: data } : data;
        return api.post(`/quizzes/${id}/submit`, payload);
    },
    getResults: (attemptId) => api.get(`/quizzes/results/${attemptId}`),
}
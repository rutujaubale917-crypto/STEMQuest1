import api from './api'

export const userService = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    getEnrolledCourses: () => api.get('/users/enrolled-courses'),
    getProgress: () => api.get('/users/progress'),
    getLeaderboard: () => api.get('/users/leaderboard'),
}
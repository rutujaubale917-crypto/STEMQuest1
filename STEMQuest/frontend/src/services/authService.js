import api from './api'

export const authService = {

    login: (credentials) => {
        const formData = new URLSearchParams()

        formData.append("username", credentials.email)
        formData.append("password", credentials.password)

        return api.post('/auth/login', formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },

    register: (userData) =>
        api.post('/auth/register', {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: "student"
        }),

    getCurrentUser: () =>
        api.get('/auth/me'),

    logout: () =>
        api.post('/auth/logout'),

}
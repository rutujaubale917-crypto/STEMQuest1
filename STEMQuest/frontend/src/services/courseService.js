import api from "./api";

export const courseService = {
    getCourses: async () => {
        const response = await api.get("/courses");
        return response;
    },

    getAll: async () => {
        const response = await api.get("/courses");
        return response;
    },

    getCourseById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response;
    },

    getById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response;
    },

    enroll: async (id) => {
        const response = await api.post(`/courses/${id}/enroll`);
        return response;
    },

    getProgress: async (id) => {
        const response = await api.get(`/courses/${id}/progress`);
        return response;
    }
};
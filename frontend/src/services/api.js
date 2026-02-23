import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true
});

let authToken = null;

export const setAuthToken = (token) => {
    authToken = token;
};

API.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

export const fetchConfessions = () => API.get('/confessions');
export const getMyPosts = () => API.get('/confessions/my');
export const getStats = () => API.get('/confessions/stats');
export const createConfession = (data) => API.post('/confessions', data);
export const updateConfession = (id, data) => API.put(`/confessions/${id}`, data);
export const addReaction = (id, reactionType) => API.patch(`/confessions/${id}/react`, { reactionType });
export const deleteConfession = (id, secretCode) => API.delete(`/confessions/${id}`, { data: { secretCode } });

export default API;

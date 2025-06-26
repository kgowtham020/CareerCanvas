import axios from 'axios';

// The baseURL should contain the '/api' prefix.
const api = axios.create({
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// The interceptor automatically adds the auth token to every request.
api.interceptors.request.use(config => {
    const token = localStorage.getItem('careerCanvasToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
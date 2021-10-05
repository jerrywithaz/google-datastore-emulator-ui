import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8002'
});

export default api;
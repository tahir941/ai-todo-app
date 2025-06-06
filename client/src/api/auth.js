import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ai-todo-db.onrender.com/api', // ✅ relative path works because backend + frontend are together
});

export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);

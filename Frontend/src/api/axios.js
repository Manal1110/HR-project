// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3500', // Update to your API base URL
});

export default axiosInstance;

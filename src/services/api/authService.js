import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Axios instance oluşturalım
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor ekleyelim
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('Current token:', token); // Token'ı kontrol edelim
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('Request config:', config); // İsteğin detaylarını görelim
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor ekleyelim
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token geçersiz veya süresi dolmuş
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const authService = {
    login: async (username, password) => {
        try {
            console.log('Login Request:', {
                url: `${API_URL}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
                data: { username, password }
            });
            
            const response = await axios.post(
                `${API_URL}/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            );
            
            console.log('Login Response:', response.data);
            
            if (response.data) {
                localStorage.setItem('token', response.data);
                console.log('Saved Token:', response.data);
                localStorage.setItem('user', JSON.stringify({
                    username,
                    token: response.data
                }));
            }
            
            return response.data;
        } catch (error) {
            console.error('Login Error:', error.response || error);
            throw error;
        }
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default authService;
export { axiosInstance, API_URL }; 
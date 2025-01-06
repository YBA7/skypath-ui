import axios from 'axios';
import { API_URL } from './authService';

const userService = {
    createUser: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/user/create`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default userService; 
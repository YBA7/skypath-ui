import axios from 'axios';
import { API_URL } from './authService';

const routeService = {
    getRoutes: async (fromLocationId, toLocationId) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token being used:', token);

            if (!token) {
                throw new Error('Token bulunamadı. Lütfen giriş yapın.');
            }

            const response = await axios({
                method: 'get',
                url: `${API_URL}/routes/getRoutes`,
                params: {
                    fromLocationId,
                    toLocationId
                },
                headers: {
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Route Response:', response);
            return response.data;
        } catch (error) {
            console.error('Full error:', error);
            if (error.response) {
                console.error('Error response:', error.response);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            }
            throw error;
        }
    }
};

export default routeService;

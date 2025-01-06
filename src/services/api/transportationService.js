import { axiosInstance, API_URL } from './authService';

const transportationService = {
    createTransportation: async (transportationRequest) => {
        try {
            const response = await axiosInstance.post(`${API_URL}/transportation/create`, transportationRequest);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTransportations: async (page = 0, size = 10) => {
        const response = await axiosInstance.get(`${API_URL}/transportation/get`, {
            params: { page, size }
        });
        return response.data;
    },

    getTransportationById: async (id) => {
        const response = await axiosInstance.get(`${API_URL}/transportation/getById`, {
            params: { id }
        });
        return response.data;
    },

    updateTransportation: async (id, transportationDto) => {
        const response = await axiosInstance.put(`${API_URL}/transportation/updateTransportation`, transportationDto, {
            params: { id }
        });
        return response.data;
    },

    deleteTransportation: async (id) => {
        await axiosInstance.delete(`${API_URL}/transportation/delete`, {
            params: { id }
        });
    }
};

export default transportationService; 
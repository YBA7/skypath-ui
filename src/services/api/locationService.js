import { axiosInstance, API_URL } from './authService';

const locationService = {
    createLocation: async (locationRequest) => {
        const response = await axiosInstance.post(`${API_URL}/location/create`, locationRequest);
        return response.data;
    },

    getLocations: async (page = 0, size = 10) => {
        const response = await axiosInstance.get(`${API_URL}/location/get`, {
            params: { page, size }
        });
        return response.data;
    },

    getLocationById: async (id) => {
        const response = await axiosInstance.get(`${API_URL}/location/getById`, {
            params: { id }
        });
        return response.data;
    },

    updateLocation: async (id, locationDto) => {
        const response = await axiosInstance.put(`${API_URL}/location/updateLocation`, locationDto, {
            params: { id }
        });
        return response.data;
    },

    deleteLocation: async (id) => {
        await axiosInstance.delete(`${API_URL}/location/delete`, {
            params: { id }
        });
    }
};

export default locationService; 
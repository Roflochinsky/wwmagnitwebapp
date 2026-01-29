import api from '../client';

export const objectsService = {
    getAll: async (): Promise<string[]> => {
        const response = await api.get('/api/objects/');
        return response.data;
    },
};

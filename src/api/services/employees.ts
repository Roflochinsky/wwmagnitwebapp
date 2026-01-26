import api from '../client';

export interface Employee {
    id: number;
    tn_number: number;
    name: string;
    department: string | null;
}

export const employeesService = {
    getAll: async (): Promise<Employee[]> => {
        const response = await api.get('/api/employees');
        return response.data;
    },

    getById: async (id: number): Promise<Employee> => {
        const response = await api.get(`/api/employees/${id}`);
        return response.data;
    }
};

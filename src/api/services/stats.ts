import api from '../client';

export interface Metric {
    minutes: number;
    percent: number;
}

export interface ActivityStats {
    activity: Metric;
    idle: Metric;
    work_zone: Metric;
    start_zone: Metric;
}

export const statsService = {
    getDailyStats: async (startDate?: string, endDate?: string): Promise<any> => {
        // Keep for chart data later
        const params: any = {};
        if (startDate) params.date_from = startDate;
        if (endDate) params.date_to = endDate;

        const response = await api.get('/api/stats/daily', { params });
        return response.data;
    },

    getActivityStats: async (startDate?: string, endDate?: string): Promise<ActivityStats> => {
        const params: any = {};
        if (startDate) params.date_from = startDate;
        if (endDate) params.date_to = endDate;

        const response = await api.get('/api/stats/activity', { params });
        return response.data;
    },

    getTopPerformers: async (startDate?: string, endDate?: string, order: 'asc' | 'desc' = 'desc', metric: 'work' | 'idle' | 'rest' = 'work'): Promise<any[]> => {
        const params: any = { order, metric, limit: 5 };
        if (startDate) params.date_from = startDate;
        if (endDate) params.date_to = endDate;

        const response = await api.get('/api/stats/top-performers', { params });
        return response.data;
    }
};

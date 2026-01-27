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
    getDailyStats: async (): Promise<any> => {
        // Keep for chart data later
        const response = await api.get('/api/stats/daily');
        return response.data;
    },

    getActivityStats: async (): Promise<ActivityStats> => {
        const response = await api.get('/api/stats/activity');
        return response.data;
    }
};

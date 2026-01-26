import api from '../client';

export interface StatsData {
    idle_percentage: number;
    activity_percentage: number;
    work_zone_percentage: number;
    rest_zone_percentage: number;
}

export const statsService = {
    getDailyStats: async (): Promise<StatsData> => {
        // TODO: Add date filtering support if backend supports it
        const response = await api.get('/api/stats/daily');
        return response.data;
    },

    // Placeholder for chart data if backend is ready
    getActivityChart: async () => {
        try {
            const response = await api.get('/api/stats/activity-chart');
            return response.data;
        } catch (e) {
            // Fallback or empty data
            return [];
        }
    }
};

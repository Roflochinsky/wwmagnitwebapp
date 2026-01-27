import React, { useEffect, useState } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import TopPerformers from '../components/dashboard/TopPerformers';
import { statsService } from '../api/services/stats';
import type { ActivityStats } from '../api/services/stats';

const AnalyticsPage = () => {
    const [stats, setStats] = useState<ActivityStats | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [activityData, dailyData] = await Promise.all([
                    statsService.getActivityStats(),
                    statsService.getDailyStats()
                ]);
                setStats(activityData);

                // Transform daily stats for chart if needed, or assume backend returns correct structure
                // Backend returns: date, shifts_count, avg_work_percent, avg_idle_percent
                // Chart expects: name (day), value (percent or count)
                // Let's map dailyData to chart format.
                const mappedChartData = dailyData.map((d: any) => ({
                    name: new Date(d.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
                    value: d.shifts_count
                }));
                // If mappedChartData is empty, use 0s or keep previous logic
                setChartData(mappedChartData);

            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Загрузка данных...</div>;
    }

    const formatMetric = (m?: number, p?: number) => `${m ?? 0} мин / ${p ?? 0}%`;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Section: KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard
                    label="Простой"
                    amount={formatMetric(stats?.idle.minutes, stats?.idle.percent)}
                    growth="15% от смены" // TODO: Real comparison
                    bgClass="bg-orange-50"
                />
                <StatsCard
                    label="Активность"
                    amount={formatMetric(stats?.activity.minutes, stats?.activity.percent)}
                    growth="Текущий уровень"
                    bgClass="bg-green-50"
                />
                <StatsCard
                    label={"Нахождение в\nрабочей зоне"}
                    amount={formatMetric(stats?.work_zone.minutes, stats?.work_zone.percent)}
                    growth="от общего времени"
                    bgClass="bg-indigo-50"
                />
                <StatsCard
                    label={"Нахождение в\nзоне отдыха"}
                    amount={formatMetric(stats?.start_zone.minutes, stats?.start_zone.percent)}
                    growth="от общего времени"
                    bgClass="bg-gray-100"
                />
            </div>

            {/* Middle Section: Chart & Top Performers */}
            <div className="grid grid-cols-12 gap-8 mt-8">
                {/* Chart - Left Side (Larger) */}
                <div className="col-span-12 xl:col-span-8 h-[400px]">
                    <ActivityChart data={chartData} />
                </div>

                {/* Top Performers - Right Side */}
                <div className="col-span-12 xl:col-span-4 h-[400px]">
                    <TopPerformers />
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;

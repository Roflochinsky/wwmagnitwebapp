import React, { useEffect, useState } from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import TopPerformers from '../components/dashboard/TopPerformers';
import { statsService } from '../api/services/stats';
import type { StatsData } from '../api/services/stats';

const AnalyticsPage = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await statsService.getDailyStats();
                setStats(data);
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Section: KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard
                    label="Простой"
                    amount={`${stats?.idle_percentage ?? 0}%`}
                    growth="15% от смены" // TODO: Real comparison
                    bgClass="bg-orange-50"
                />
                <StatsCard
                    label="Активность"
                    amount={`${stats?.activity_percentage ?? 0}%`}
                    growth="Текущий уровень"
                    bgClass="bg-green-50"
                />
                <StatsCard
                    label={"Нахождение в\nрабочей зоне"}
                    amount={`${stats?.work_zone_percentage ?? 0}%`}
                    growth="от общего времени"
                    bgClass="bg-indigo-50"
                />
                <StatsCard
                    label={"Нахождение в\nзоне отдыха"}
                    amount={`${stats?.rest_zone_percentage ?? 0}%`}
                    growth="от общего времени"
                    bgClass="bg-gray-100"
                />
            </div>

            {/* Middle Section: Chart & Top Performers */}
            <div className="grid grid-cols-12 gap-8 mt-8">
                {/* Chart - Left Side (Larger) */}
                <div className="col-span-12 xl:col-span-8 h-[400px]">
                    <ActivityChart />
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

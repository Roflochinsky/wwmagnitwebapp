import StatsCard from '../components/dashboard/StatsCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import TopPerformers from '../components/dashboard/TopPerformers';

const AnalyticsPage = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Section: KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatsCard
                    label="Простой"
                    amount="30%"
                    growth="15% от смены"
                    bgClass="bg-orange-50"
                />
                <StatsCard
                    label="Активность"
                    amount="85%"
                    growth="Текущий уровень"
                    bgClass="bg-green-50"
                />
                <StatsCard
                    label={"Нахождение в\nрабочей зоне"}
                    amount="70%"
                    growth="от общего времени"
                    bgClass="bg-indigo-50"
                />
                <StatsCard
                    label={"Нахождение в\nзоне отдыха"}
                    amount="15%"
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

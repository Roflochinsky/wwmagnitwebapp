import DowntimeStats from '../components/downtime/DowntimeStats';
import DowntimeHeatmap from '../components/downtime/DowntimeHeatmap';
import DowntimeChart from '../components/downtime/DowntimeChart';
import WorstPerformers from '../components/downtime/WorstPerformers';
import { useContext } from 'react';
import { FilterContext } from '../context/FilterContext';

const DowntimePage = () => {
    const { dateRange } = useContext(FilterContext);

    // TODO: Pass dateRange to subcomponents or ensure they use the context directly
    // console.log('DowntimePage date range:', dateRange);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-orange-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Анализ простоев</h2>
            </div>

            {/* Top Section: KPI Cards */}
            <DowntimeStats />

            {/* Middle Section: Chart & Heatmap */}
            <div className="grid grid-cols-12 gap-8 mt-8">
                {/* Chart - Left Side */}
                <div className="col-span-12 xl:col-span-5 min-h-[350px]">
                    <DowntimeChart />
                </div>

                {/* Heatmap - Right Side (wider) */}
                <div className="col-span-12 xl:col-span-7 h-auto">
                    <DowntimeHeatmap />
                </div>
            </div>

            {/* Bottom Section: Worst Performers */}
            <div className="grid grid-cols-12 gap-8 mt-8">
                <div className="col-span-12 xl:col-span-6">
                    <WorstPerformers />
                </div>

                {/* Placeholder for future component */}
                <div className="col-span-12 xl:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📊</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Причины простоев</h3>
                        <p className="text-sm text-gray-500">Аналитика по категориям</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DowntimePage;

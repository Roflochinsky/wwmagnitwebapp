import React, { useState, useEffect, useContext } from 'react';
import { User, Medal, Trophy, TrendingUp, TrendingDown, RefreshCcw, Clock, Zap, Coffee } from 'lucide-react';
import { statsService } from '../../api/services/stats';
import { FilterContext } from '../../context/FilterContext';

type MetricType = 'work' | 'idle' | 'rest';

const TopPerformers = () => {
    const { dateRange, selectedObject } = useContext(FilterContext);
    const [isBest, setIsBest] = useState(true);
    const [metric, setMetric] = useState<MetricType>('work');
    const [performers, setPerformers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fromStr = dateRange.from.toISOString().split('T')[0];
                const toStr = dateRange.to.toISOString().split('T')[0];

                // Determine sort order based on metric and "Best/Worst" toggle
                // Activity/Rest: Best = High (DESC), Worst = Low (ASC)
                // Idle: Best = Low (ASC), Worst = High (DESC)
                let order: 'asc' | 'desc' = 'desc';

                if (metric === 'idle') {
                    order = isBest ? 'asc' : 'desc';
                } else {
                    order = isBest ? 'desc' : 'asc';
                }

                const data = await statsService.getTopPerformers(fromStr, toStr, order, metric, selectedObject);
                setPerformers(data);
            } catch (error) {
                console.error("Failed to fetch top performers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isBest, metric, dateRange, selectedObject]);

    const getMetricLabel = () => {
        switch (metric) {
            case 'work': return 'Активность';
            case 'idle': return 'Простой';
            case 'rest': return 'Отдых';
        }
    };

    const getMetricColor = () => {
        switch (metric) {
            case 'work': return isBest ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50';
            case 'idle': return isBest ? 'text-indigo-600 bg-indigo-50' : 'text-red-600 bg-red-50';
            case 'rest': return 'text-teal-600 bg-teal-50';
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 transition-all duration-300">
                        {isBest ? 'Топ Лидеров' : 'Топ Аутсайдеров'}
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">{getMetricLabel()}</span>
                </div>

                {/* Custom Toggle Switch */}
                <button
                    onClick={() => setIsBest(!isBest)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${isBest ? 'bg-teal-500' : 'bg-red-500'}`}
                >
                    <div
                        className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${isBest ? 'translate-x-6' : 'translate-x-0'}`}
                    >
                        {isBest ? (
                            <TrendingUp size={14} className="text-teal-600" />
                        ) : (
                            <TrendingDown size={14} className="text-red-600" />
                        )}
                    </div>
                </button>
            </div>

            {/* Metrics Tabs */}
            <div className="flex p-1 bg-gray-50 rounded-xl mb-4">
                <button
                    onClick={() => setMetric('work')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${metric === 'work' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Zap size={14} />
                </button>
                <button
                    onClick={() => setMetric('idle')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${metric === 'idle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Clock size={14} />
                </button>
                <button
                    onClick={() => setMetric('rest')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${metric === 'rest' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Coffee size={14} />
                </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar relative min-h-[200px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-xl">
                        <RefreshCcw className="animate-spin text-teal-600" />
                    </div>
                ) : null}

                {performers.length === 0 && !loading && (
                    <div className="text-center text-gray-400 py-10 text-sm">Нет данных за выбранный период</div>
                )}

                {performers.map((item, index) => (
                    <div
                        key={`${item.id}-${isBest ? 'best' : 'worst'}-${metric}`}
                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all duration-500 animate-in slide-in-from-right-4 fade-in fill-mode-both"
                        style={{
                            animationDelay: `${index * 50}ms`
                        }}
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Rank */}
                            <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isBest
                                ? (index < 3 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500')
                                : (index < 3 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500')
                                }`}>
                                {index + 1}
                            </div>

                            {/* Avatar */}
                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100">
                                {item.avatar_url ? (
                                    <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={16} />
                                )}
                            </div>

                            {/* Name & Dept */}
                            <div className="flex-1 min-w-0 pr-2">
                                <h4 className="font-bold text-gray-900 text-sm truncate" title={item.name}>{item.name}</h4>
                                <p className="text-[10px] text-gray-500 truncate" title={item.department}>{item.department || "Отдел не указан"}</p>
                            </div>
                        </div>

                        {/* Value Badge */}
                        <div className={`flex-shrink-0 font-bold text-xs px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm transition-colors text-center min-w-[3rem] ${getMetricColor()}`}>
                            {item.value}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopPerformers;

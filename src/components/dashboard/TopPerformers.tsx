import React, { useState, useEffect, useContext } from 'react';
import { User, Medal, Trophy, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import { statsService } from '../../api/services/stats';
import { FilterContext } from '../../context/FilterContext';

const TopPerformers = () => {
    const { dateRange } = useContext(FilterContext);
    const [isBest, setIsBest] = useState(true);
    const [performers, setPerformers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const fromStr = dateRange.from.toISOString().split('T')[0];
                const toStr = dateRange.to.toISOString().split('T')[0];
                const order = isBest ? 'desc' : 'asc';

                const data = await statsService.getTopPerformers(fromStr, toStr, order);
                setPerformers(data);
            } catch (error) {
                console.error("Failed to fetch top performers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isBest, dateRange]);

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 transition-all duration-300">
                        {isBest ? 'Топ Эффективных' : 'Топ Отстающих'}
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">По показателю активности</span>
                </div>

                {/* Custom Toggle Switch */}
                <button
                    onClick={() => setIsBest(!isBest)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${isBest ? 'bg-teal-500' : 'bg-orange-500'}`}
                >
                    <div
                        className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${isBest ? 'translate-x-6' : 'translate-x-0'}`}
                    >
                        {isBest ? (
                            <TrendingUp size={14} className="text-teal-600" />
                        ) : (
                            <TrendingDown size={14} className="text-orange-600" />
                        )}
                    </div>
                </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar relative min-h-[200px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                        <RefreshCcw className="animate-spin text-teal-600" />
                    </div>
                ) : null}

                {performers.length === 0 && !loading && (
                    <div className="text-center text-gray-400 py-10 text-sm">Нет данных за выбранный период</div>
                )}

                {performers.map((item, index) => (
                    <div
                        key={`${item.id}-${isBest ? 'best' : 'worst'}`} // Key change triggers re-mount/anim
                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all duration-500 animate-in slide-in-from-right-4 fade-in fill-mode-both"
                        style={{
                            animationDelay: `${index * 100}ms`
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isBest
                                    ? (index < 3 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500')
                                    : (index < 3 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500')
                                }`}>
                                {index + 1}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                                {item.avatar_url ? (
                                    <img src={item.avatar_url} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={18} />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-500">{item.department || "Отдел не указан"}</p>
                            </div>
                        </div>
                        <div className={`font-bold text-sm bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm transition-colors ${isBest ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                            }`}>
                            {item.value}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopPerformers;

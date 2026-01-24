import React from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';

const routes = [
    { from: 'Склад', to: 'Цех #2', percentage: 42, color: 'bg-indigo-500', time: '8 мин', alert: true },
    { from: 'Офис', to: 'Склад', percentage: 23, color: 'bg-teal-500', time: '4 мин' },
    { from: 'Цех #1', to: 'Цех #2', percentage: 18, color: 'bg-blue-500', time: '3 мин' },
    { from: 'Столовая', to: 'Цех #1', percentage: 12, color: 'bg-purple-500', time: '6 мин' },
    { from: 'Прочие', to: '', percentage: 5, color: 'bg-gray-300', time: '—' },
];

const TopRoutes = () => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Популярные маршруты</h3>
                <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-lg">LIVE</span>
            </div>

            <div className="space-y-5 flex-1">
                {routes.map((route, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">{route.from}</span>
                                {route.to && <ArrowRight size={14} className="text-gray-400" />}
                                <span className="font-medium text-gray-700">{route.to}</span>
                            </div>
                            <span className="font-bold text-gray-900">{route.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${route.color} transition-all duration-1000`}
                                style={{ width: `${route.percentage}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-400">Время: {route.time}</span>
                            {route.alert && (
                                <div className="flex items-center gap-1 text-orange-500 font-medium animate-pulse">
                                    <AlertTriangle size={12} />
                                    <span>Затор (Норма 3 мин)</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRoutes;

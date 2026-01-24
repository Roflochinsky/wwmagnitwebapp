import React from 'react';
import { User, Clock, AlertTriangle } from 'lucide-react';

interface PerformerData {
    name: string;
    downtime: string;
    trend: 'better' | 'worse' | 'same';
    zone: string;
}

const performers: PerformerData[] = [
    { name: 'Сергей Л.', downtime: '95 мин', trend: 'worse', zone: 'Цех #1' },
    { name: 'Иван К.', downtime: '68 мин', trend: 'worse', zone: 'Склад' },
    { name: 'Пётр С.', downtime: '52 мин', trend: 'same', zone: 'Цех #2' },
    { name: 'Анна М.', downtime: '45 мин', trend: 'better', zone: 'Офис' },
    { name: 'Олег Д.', downtime: '38 мин', trend: 'better', zone: 'Цех #1' },
];

const getTrendColor = (trend: string) => {
    switch (trend) {
        case 'worse': return 'text-red-500';
        case 'better': return 'text-green-600';
        default: return 'text-gray-400';
    }
};

const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'worse': return '↑';
        case 'better': return '↓';
        default: return '−';
    }
};

const WorstPerformers = () => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Требуют внимания</h3>
                <div className="p-2 bg-orange-50 rounded-xl">
                    <AlertTriangle size={20} className="text-orange-500" />
                </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {performers.map((person, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-colors -mx-1"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${index < 2 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{person.name}</h4>
                                <p className="text-xs text-gray-500">{person.zone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium ${getTrendColor(person.trend)}`}>
                                {getTrendIcon(person.trend)}
                            </span>
                            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg">
                                <Clock size={14} className="text-orange-600" />
                                <span className="font-bold text-sm text-orange-700">{person.downtime}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                    Показать всех сотрудников →
                </button>
            </div>
        </div>
    );
};

export default WorstPerformers;

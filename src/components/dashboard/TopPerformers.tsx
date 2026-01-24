import React, { useState } from 'react';
import { User, Medal, Trophy, TrendingUp, Clock, Coffee, AlertCircle } from 'lucide-react';

type FilterType = 'activity' | 'downtime' | 'rest';

const TopPerformers = () => {
    const [filter, setFilter] = useState<FilterType>('activity');

    const data = {
        activity: [
            { name: 'Алексей П.', value: '98%', label: 'Активность', color: 'text-green-600', bg: 'bg-green-50' },
            { name: 'Мария И.', value: '96%', label: 'Активность', color: 'text-green-600', bg: 'bg-green-50' },
            { name: 'Иван К.', value: '94%', label: 'Активность', color: 'text-green-600', bg: 'bg-green-50' },
            { name: 'Елена С.', value: '92%', label: 'Активность', color: 'text-green-600', bg: 'bg-green-50' },
            { name: 'Дмитрий В.', value: '91%', label: 'Активность', color: 'text-green-600', bg: 'bg-green-50' },
        ],
        downtime: [
            { name: 'Елена С.', value: '5 мин', label: 'Простой', color: 'text-indigo-600', bg: 'bg-indigo-50' }, // Least downtime is best
            { name: 'Мария И.', value: '8 мин', label: 'Простой', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { name: 'Алексей П.', value: '12 мин', label: 'Простой', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { name: 'Дмитрий В.', value: '15 мин', label: 'Простой', color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { name: 'Иван К.', value: '20 мин', label: 'Простой', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ],
        rest: [
            { name: 'Дмитрий В.', value: '45 мин', label: 'В зоне отдыха', color: 'text-teal-600', bg: 'bg-teal-50' }, // Closest to norm? Or least? Assuming "Best" means reasonable rest
            { name: 'Иван К.', value: '48 мин', label: 'В зоне отдыха', color: 'text-teal-600', bg: 'bg-teal-50' },
            { name: 'Алексей П.', value: '50 мин', label: 'В зоне отдыха', color: 'text-teal-600', bg: 'bg-teal-50' },
            { name: 'Елена С.', value: '55 мин', label: 'В зоне отдыха', color: 'text-teal-600', bg: 'bg-teal-50' },
            { name: 'Мария И.', value: '60 мин', label: 'В зоне отдыха', color: 'text-teal-600', bg: 'bg-teal-50' },
        ]
    };

    const currentData = data[filter];

    const getIcon = () => {
        switch (filter) {
            case 'activity': return TrendingUp;
            case 'downtime': return Clock; // or AlertCircle
            case 'rest': return Coffee;
            default: return User;
        }
    };

    const MetricIcon = getIcon();

    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Топ Лучших</h3>
                <div className="p-2 bg-gray-50 rounded-xl">
                    <Trophy size={20} className="text-amber-400" />
                </div>
            </div>

            {/* Filters */}
            <div className="flex p-1 bg-gray-50 rounded-xl mb-6">
                <button
                    onClick={() => setFilter('downtime')}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${filter === 'downtime' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Простой
                </button>
                <button
                    onClick={() => setFilter('activity')}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${filter === 'activity' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Активность
                </button>
                <button
                    onClick={() => setFilter('rest')}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-all ${filter === 'rest' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Отдых
                </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {currentData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors -mx-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${index < 3 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                                {index + 1}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                <p className="text-xs text-gray-500">{item.label}</p>
                            </div>
                        </div>
                        <div className={`font-bold text-sm bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm ${item.color}`}>
                            {item.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopPerformers;

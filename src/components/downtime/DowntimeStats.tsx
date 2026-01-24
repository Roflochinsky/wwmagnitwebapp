import React from 'react';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';

export interface DowntimeStatCardProps {
    label: string;
    value: string;
    description: string;
    trend?: 'up' | 'down';
    trendValue?: string;
    bgClass: string;
}

const DowntimeStatCard = ({ label, value, description, trend, trendValue, bgClass }: DowntimeStatCardProps) => {
    return (
        <div className={`p-6 rounded-3xl ${bgClass} flex flex-col justify-between h-[160px] relative group hover:shadow-sm transition-shadow`}>
            <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium whitespace-pre-line">{label}</span>
                <button className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors">
                    <ArrowUpRight size={16} className="text-gray-500" />
                </button>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    {trend && trendValue && (
                        <>
                            {trend === 'down' ? (
                                <TrendingDown size={14} className="text-green-600" />
                            ) : (
                                <TrendingUp size={14} className="text-red-500" />
                            )}
                            <span className={trend === 'down' ? 'text-green-600' : 'text-red-500'}>
                                {trendValue}
                            </span>
                        </>
                    )}
                    <span className="opacity-70">{description}</span>
                </p>
            </div>
        </div>
    );
};

const DowntimeStats = () => {
    const stats: DowntimeStatCardProps[] = [
        {
            label: 'Всего простоя',
            value: '2.3 ч',
            description: 'за сегодня',
            trend: 'down',
            trendValue: '-12%',
            bgClass: 'bg-orange-50',
        },
        {
            label: '% от смены',
            value: '18%',
            description: 'норма < 15%',
            bgClass: 'bg-amber-50',
        },
        {
            label: 'Эпизодов\n> 10 мин',
            value: '7',
            description: 'требуют внимания',
            trend: 'up',
            trendValue: '+2',
            bgClass: 'bg-red-50',
        },
        {
            label: 'vs прошлая\nнеделя',
            value: '↓ 12%',
            description: 'улучшение',
            bgClass: 'bg-green-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <DowntimeStatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DowntimeStats;

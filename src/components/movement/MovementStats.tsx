import React from 'react';
import { Clock, Repeat, Footprints, MapPin, ArrowUpRight } from 'lucide-react';

export interface MovementStatCardProps {
    label: string;
    value: string;
    description: string;
    icon: typeof Clock;
    iconBg: string;
    iconColor: string;
    bgClass: string;
}

const MovementStatCard = ({ label, value, description, icon: Icon, iconBg, iconColor, bgClass }: MovementStatCardProps) => {
    return (
        <div className={`p-6 rounded-3xl ${bgClass} flex flex-col justify-between h-[160px] border border-transparent hover:border-indigo-100 transition-all group`}>
            <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={20} className={iconColor} />
                </div>
                <button className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
                    <ArrowUpRight size={16} className="text-gray-500" />
                </button>
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    <span className="text-xs text-gray-400 font-normal">{description}</span>
                </div>
            </div>
        </div>
    );
};

const MovementStats = () => {
    const stats: MovementStatCardProps[] = [
        {
            label: 'Время в пути',
            value: '48 мин',
            description: '/ день на чел.',
            icon: Clock,
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            bgClass: 'bg-white',
        },
        {
            label: 'Переходы',
            value: '127',
            description: 'между зонами',
            icon: Repeat,
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600',
            bgClass: 'bg-white',
        },
        {
            label: 'Активность "в пути"',
            value: '8.4%',
            description: 'от смены',
            icon: Footprints,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            bgClass: 'bg-white',
        },
        {
            label: 'Топ маршрут',
            value: 'Склад ➔ Цех #2',
            description: '45% всех путей',
            icon: MapPin,
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            bgClass: 'bg-white',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <MovementStatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default MovementStats;

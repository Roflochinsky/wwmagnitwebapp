import React from 'react';
import { Users, UserCheck, Zap, AlertCircle, ArrowUpRight } from 'lucide-react';

export interface UserStatCardProps {
    label: string;
    value: string;
    description: string;
    icon: typeof Users;
    iconBg: string;
    iconColor: string;
    bgClass: string;
    trend?: string;
}

const UserStatCard = ({ label, value, description, icon: Icon, iconBg, iconColor, bgClass, trend }: UserStatCardProps) => {
    return (
        <div className={`p-6 rounded-3xl ${bgClass} flex flex-col justify-between h-[160px] border border-transparent hover:border-teal-100 transition-all group`}>
            <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={20} className={iconColor} />
                </div>
                {trend && (
                    <div className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                        {trend}
                    </div>
                )}
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

const UserStats = () => {
    const stats: UserStatCardProps[] = [
        {
            label: 'Всего сотрудников',
            value: '127',
            description: 'в штате',
            icon: Users,
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            bgClass: 'bg-white',
        },
        {
            label: 'Онлайн сейчас',
            value: '98',
            description: 'на связи',
            icon: UserCheck,
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            bgClass: 'bg-white',
            trend: '+5',
        },
        {
            label: 'Средняя активность',
            value: '85%',
            description: 'за 7 дней',
            icon: Zap,
            iconBg: 'bg-teal-100',
            iconColor: 'text-teal-600',
            bgClass: 'bg-white',
        },
        {
            label: 'Ниже нормы',
            value: '12',
            description: 'требуют внимания',
            icon: AlertCircle,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            bgClass: 'bg-white',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <UserStatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default UserStats;

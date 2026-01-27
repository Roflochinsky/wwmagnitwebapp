import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface StatsCardProps {
    label: string;
    amount: string;
    growth: string;
    bgClass: string;
}

const StatsCard = ({ label, amount, growth, bgClass }: StatsCardProps) => {
    return (
        <div className={`p-6 rounded-3xl ${bgClass} flex flex-col justify-between h-[160px] relative group hover:shadow-sm transition-shadow`}>
            <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium whitespace-pre-line">{label}</span>
                <button className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors">
                    <ArrowUpRight size={16} className="text-gray-500" />
                </button>
            </div>
            <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{amount}</h3>
                <p className="text-xs text-gray-500 font-medium" style={{ display: 'inline-flex', gap: '4px', alignItems: 'center' }}>
                    <span className="text-green-600">{growth.split(' ')[0]}</span>
                    <span className="opacity-70">{growth.split(' ').slice(1).join(' ')}</span>
                </p>
            </div>
        </div>
    );
};

export default StatsCard;

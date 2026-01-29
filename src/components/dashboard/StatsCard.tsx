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
        <div className={`p-6 rounded-3xl ${bgClass} flex flex-col h-[160px] relative group hover:shadow-sm transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-gray-600 font-medium whitespace-pre-line leading-tight">{label}</span>
                <button className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors flex-shrink-0 ml-2">
                    <ArrowUpRight size={16} className="text-gray-500" />
                </button>
            </div>

            <div className="mt-auto">
                <h3 className="text-[28px] font-bold text-gray-900 mb-2 truncate" title={amount}>{amount}</h3>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                    <span className="text-green-600">{growth.split(' ')[0]}</span>
                    <span className="opacity-70 truncate">{growth.split(' ').slice(1).join(' ')}</span>
                </p>
            </div>
        </div>
    );
};

export default StatsCard;

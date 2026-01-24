import React from 'react';
import { Home, Smartphone, Zap, Wifi, Fuel, MoreHorizontal } from 'lucide-react';

const bills = [
    { icon: Home, label: 'Home Rent', amount: '$1200', bg: 'bg-indigo-50 text-indigo-600' },
    { icon: Smartphone, label: 'Mobile Bill', amount: '$12.00', bg: 'bg-orange-50 text-orange-600' },
    { icon: Zap, label: 'Electric Bill', amount: '$200', bg: 'bg-blue-50 text-blue-600' },
    { icon: Wifi, label: 'Internet Bill', amount: '$5.00', bg: 'bg-red-50 text-red-600' }, // Approximation
    { icon: Fuel, label: 'Gasoline', amount: '$60.00', bg: 'bg-purple-50 text-purple-600' },
];

const BillPayments = () => {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Spending</h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {bills.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-32 p-4 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-md hover:scale-105 transition-all cursor-pointer border border-transparent hover:border-gray-100">
                        <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center mb-3`}>
                            <item.icon size={18} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-1">{item.label}</h4>
                        <p className="text-sm font-bold text-gray-900">{item.amount}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BillPayments;

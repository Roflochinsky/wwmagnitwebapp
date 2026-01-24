import React from 'react';

const distributionData = [
    { label: '< 60% (Критично)', value: 8, color: 'bg-red-500', count: 10 },
    { label: '60-80% (Низкая)', value: 23, color: 'bg-orange-500', count: 29 },
    { label: '80-90% (Норма)', value: 45, color: 'bg-teal-500', count: 57 },
    { label: '> 90% (Высокая)', value: 24, color: 'bg-green-500', count: 31 },
];

const UserDistribution = () => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-gray-900">Распределение активности</h3>
                <div className="text-[11px] font-bold text-gray-400 uppercase">Сотрудников: 127</div>
            </div>

            <div className="space-y-6 flex-1 justify-center flex flex-col">
                {distributionData.map((item, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-medium text-gray-500">{item.label}</span>
                            <div className="text-right">
                                <span className="text-sm font-bold text-gray-900">{item.value}%</span>
                                <span className="text-[10px] text-gray-300 ml-1">({item.count} чел)</span>
                            </div>
                        </div>
                        <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                style={{ width: `${item.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
                <div className="p-4 bg-teal-50 rounded-2xl flex items-start gap-3">
                    <span className="text-teal-600 text-sm italic">💡</span>
                    <p className="text-xs text-teal-900 leading-relaxed">
                        Большинство сотрудников (<strong>69%</strong>) показывают активность выше 80%, что соответствует целевым показателям.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserDistribution;

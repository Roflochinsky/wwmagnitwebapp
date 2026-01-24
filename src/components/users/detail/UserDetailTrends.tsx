import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { day: 'Пн', value: 85 },
    { day: 'Вт', value: 92 },
    { day: 'Ср', value: 78 },
    { day: 'Чт', value: 88 },
    { day: 'Пт', value: 95 },
    { day: 'Сб', value: 60 },
    { day: 'Вс', value: 0 },
];

const UserDetailTrends = () => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Динамика эффективности (7 дней)</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span className="text-sm text-gray-500">Активность</span>
                </div>
            </div>

            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f766e', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any) => [`${value}%`, 'Эффективность']}
                        />
                        {/* Norma Line */}
                        <Area type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-teal-50 rounded-2xl flex items-start gap-3">
                <span className="text-teal-600 font-bold text-sm">💡 Инсайт:</span>
                <p className="text-xs text-teal-800 leading-relaxed">
                    В среду наблюдалось падение эффективности на 15% ниже нормы. Возможная причина: задержка поставок материалов в первой половине дня.
                </p>
            </div>
        </div>
    );
};

export default UserDetailTrends;

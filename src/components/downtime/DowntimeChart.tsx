import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, YAxis } from 'recharts';

const data = [
    { name: 'Пн', value: 18 },
    { name: 'Вт', value: 12 },
    { name: 'Ср', value: 25 },
    { name: 'Чт', value: 15 },
    { name: 'Пт', value: 32 },
    { name: 'Сб', value: 8 },
    { name: 'Вс', value: 5 },
];

const DowntimeChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const maxValueIndex = data.findIndex(d => d.value === maxValue);

    return (
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-6 h-full relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-lg font-semibold">Простои по дням</h2>
                <div className="text-white/80 text-sm font-medium">
                    % от смены
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} barSize={28}>
                        <defs>
                            <pattern id="worstDayPattern" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                                <rect width="100%" height="100%" fill="#fef3c7" />
                                <path d="M 0 0 L 0 4 M 4 0 L 4 4" stroke="#f97316" strokeWidth="2" />
                            </pattern>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 500 }}
                            dy={15}
                            interval={0}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 'auto']}
                            dx={-10}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.1)', radius: 4 }}
                            contentStyle={{ backgroundColor: '#ea580c', border: 'none', borderRadius: '12px', color: '#fff', padding: '8px 12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
                            formatter={(value: any) => [`${value}%`, 'Простой']}
                        />
                        <Bar
                            dataKey="value"
                            radius={[6, 6, 6, 6]}
                            className="transition-all duration-300 hover:opacity-90"
                            fill="#fef3c7"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DowntimeChart;

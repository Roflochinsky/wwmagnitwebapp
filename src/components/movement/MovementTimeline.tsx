import React from 'react';

const zones = [
    { id: 'warehouse', name: 'Склад', color: 'bg-indigo-500' },
    { id: 'shop1', name: 'Цех #1', color: 'bg-teal-500' },
    { id: 'shop2', name: 'Цех #2', color: 'bg-blue-500' },
    { id: 'office', name: 'Офис', color: 'bg-gray-400' },
];

const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00

// Seeded random activity generator
const generateActivity = (seed: number) => {
    return Array.from({ length: 22 }, (_, i) => {
        const val = Math.sin(seed + i * 0.5) + Math.random();
        if (val > 1.2) return 'high';
        if (val > 0.5) return 'medium';
        return 'low';
    });
};

const MovementTimeline = () => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Активность по зонам (Timeline)</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <span className="text-xs text-gray-500">Высокая</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-teal-200" />
                        <span className="text-xs text-gray-500">Средняя</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                {zones.map((zone, zIdx) => (
                    <div key={zone.id} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-gray-600">{zone.name}</div>
                        <div className="flex-1 flex gap-1 h-6">
                            {generateActivity(zIdx * 10).map((act, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-sm transition-all hover:scale-y-125 cursor-help ${act === 'high'
                                            ? zone.color
                                            : act === 'medium'
                                                ? zone.color.replace('500', '200')
                                                : 'bg-gray-50'
                                        }`}
                                    title={`${act === 'high' ? 'Высокая' : act === 'medium' ? 'Средняя' : 'Низкая'} активность`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-between pl-24 text-[10px] text-gray-400 font-mono">
                {hours.map((h) => (
                    <span key={h}>{h}:00</span>
                ))}
            </div>
        </div>
    );
};

export default MovementTimeline;

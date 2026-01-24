import React from 'react';

const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Mock data: downtime intensity 0-5 (0 = no downtime, 5 = heavy downtime)
const heatmapData: number[][] = [
    [0, 1, 2, 1, 0, 0, 0, 1, 2, 1], // Пн
    [1, 0, 1, 2, 3, 1, 0, 0, 1, 0], // Вт
    [2, 3, 1, 0, 1, 4, 2, 1, 0, 0], // Ср
    [0, 1, 0, 1, 2, 1, 0, 0, 1, 2], // Чт
    [1, 2, 3, 2, 1, 0, 1, 2, 3, 4], // Пт
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 1], // Сб
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], // Вс
];

const getHeatColor = (value: number): string => {
    const colors = [
        'bg-teal-50',      // 0 - отлично
        'bg-teal-100',     // 1
        'bg-amber-100',    // 2
        'bg-orange-200',   // 3
        'bg-orange-300',   // 4
        'bg-red-400',      // 5 - критично
    ];
    return colors[Math.min(value, 5)];
};

const getTooltipText = (value: number): string => {
    const labels = ['Нет простоев', 'Минимальный', 'Небольшой', 'Умеренный', 'Высокий', 'Критический'];
    return labels[Math.min(value, 5)];
};

const DowntimeHeatmap = () => {
    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Карта простоев</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Меньше</span>
                    <div className="flex gap-0.5">
                        <div className="w-3 h-3 rounded bg-teal-50 border border-gray-200" />
                        <div className="w-3 h-3 rounded bg-teal-100" />
                        <div className="w-3 h-3 rounded bg-amber-100" />
                        <div className="w-3 h-3 rounded bg-orange-200" />
                        <div className="w-3 h-3 rounded bg-orange-300" />
                        <div className="w-3 h-3 rounded bg-red-400" />
                    </div>
                    <span>Больше</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                    {/* Hours header */}
                    <div className="flex mb-2">
                        <div className="w-10" /> {/* Empty corner */}
                        {hours.map((hour) => (
                            <div key={hour} className="flex-1 text-center text-xs text-gray-400 font-medium">
                                {hour}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="space-y-1">
                        {days.map((day, dayIndex) => (
                            <div key={day} className="flex items-center gap-1">
                                <div className="w-10 text-xs text-gray-500 font-medium">{day}</div>
                                {heatmapData[dayIndex].map((value, hourIndex) => (
                                    <div
                                        key={hourIndex}
                                        className={`flex-1 h-8 rounded-lg ${getHeatColor(value)} cursor-pointer hover:ring-2 hover:ring-teal-300 transition-all group relative`}
                                        title={`${day} ${hours[hourIndex]}: ${getTooltipText(value)}`}
                                    >
                                        {/* Tooltip on hover */}
                                        <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                            {getTooltipText(value)}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Паттерн:</span> Наибольшие простои в пятницу после обеда и среду 13:00-14:00
                </p>
            </div>
        </div>
    );
};

export default DowntimeHeatmap;

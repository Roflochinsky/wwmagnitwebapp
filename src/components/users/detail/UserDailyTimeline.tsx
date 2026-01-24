import React from 'react';

const UserDailyTimeline = () => {
    // 8:00 to 18:00
    const hours = Array.from({ length: 11 }, (_, i) => i + 8);

    // Mock timeline segments
    const segments = [
        { type: 'work', start: 0, width: 20 }, // 8:00-10:00
        { type: 'down', start: 20, width: 5 },  // 10:00-10:30 (Break)
        { type: 'work', start: 25, width: 25 }, // 10:30-13:00
        { type: 'lunch', start: 50, width: 10 }, // 13:00-14:00 (Lunch)
        { type: 'move', start: 60, width: 5 }, // 14:00-14:30
        { type: 'work', start: 65, width: 30 }, // 14:30-17:30
        { type: 'down', start: 95, width: 5 }, // 17:30-18:00
    ];

    const getColor = (type: string) => {
        switch (type) {
            case 'work': return 'bg-indigo-500';
            case 'down': return 'bg-orange-400';
            case 'lunch': return 'bg-gray-300 pattern-diagonal-lines'; // pattern idea
            case 'move': return 'bg-purple-400';
            default: return 'bg-gray-200';
        }
    };

    const getLabel = (type: string) => {
        switch (type) {
            case 'work': return 'Работа';
            case 'down': return 'Простой';
            case 'lunch': return 'Обед';
            case 'move': return 'Перемещение';
            default: return '';
        }
    }

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Таймлайн смены</h3>
                <div className="flex gap-4">
                    {['Работа', 'Простой', 'Перемещение', 'Обед'].map((label, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${label === 'Работа' ? 'bg-indigo-500' :
                                    label === 'Простой' ? 'bg-orange-400' :
                                        label === 'Перемещение' ? 'bg-purple-400' : 'bg-gray-300'
                                }`} />
                            <span className="text-xs text-gray-500 font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative h-16 w-full bg-gray-50 rounded-xl overflow-hidden mb-2 flex">
                {/* Grid lines for hours */}
                {hours.map((_, i) => (
                    <div key={i} className="absolute h-full border-l border-gray-200/50" style={{ left: `${i * 10}%` }} />
                ))}

                {/* Activity Segments */}
                {segments.map((seg, i) => (
                    <div
                        key={i}
                        className={`h-full ${getColor(seg.type)} relative group cursor-pointer transition-all hover:brightness-110 hover:shadow-lg`}
                        style={{ width: `${seg.width}%` }}
                    >
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-xl whitespace-nowrap z-10 transition-opacity pointer-events-none">
                            {getLabel(seg.type)}
                        </div>
                    </div>
                ))}

                {/* Anomaly Marker Example at 10:15 (22.5%) */}
                <div className="absolute top-0 bottom-0 w-1 bg-red-500 animate-pulse z-10" style={{ left: '22.5%' }}>
                    <div className="absolute -top-1 -left-[3px] w-2.5 h-2.5 bg-red-500 rounded-full" />
                </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400 font-mono px-0.5">
                {hours.map(h => <span key={h}>{h}:00</span>)}
            </div>
        </div>
    );
};

export default UserDailyTimeline;

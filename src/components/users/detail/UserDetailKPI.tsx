import React from 'react';
import { AlertTriangle, Clock, Activity, Coffee, Footprints } from 'lucide-react';

interface UserDetailKPIProps {
    user: any;
}

const UserDetailKPI = ({ user }: UserDetailKPIProps) => {
    // Mock data for T-1 report
    const stats = {
        efficiency: 92,
        workHours: '6ч 42м',
        downtimeHours: '25м',
        movementHours: '45м',
        anomalies: [
            { id: 1, time: '10:15', msg: 'Простой > 25 мин (Зона отдыха)' },
            { id: 2, time: '16:50', msg: 'Ранний уход со смены (на 10 мин)' }
        ]
    };

    return (
        <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Main Efficiency Score */}
            <div className="col-span-12 xl:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between">
                <div>
                    <h3 className="text-gray-500 font-medium mb-1">Эффективность смены</h3>
                    <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-bold text-gray-900">{stats.efficiency}%</span>
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg">+5% к норме</span>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Структура дня</p>
                    <div className="flex h-4 rounded-full overflow-hidden w-full">
                        <div className="h-full bg-indigo-500" style={{ width: '75%' }} title="Работа" />
                        <div className="h-full bg-orange-400" style={{ width: '15%' }} title="Простой" />
                        <div className="h-full bg-purple-400" style={{ width: '10%' }} title="Перемещение" />
                    </div>
                    <div className="flex justify-between mt-2 text-xs font-medium text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-indigo-500" />
                            <span>Работа {stats.workHours}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                            <span>{stats.downtimeHours}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Time Breakdown Cards */}
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 grid grid-cols-2 gap-4">
                <div className="bg-indigo-50/50 p-5 rounded-3xl border border-indigo-50 flex flex-col justify-center items-center text-center hover:bg-indigo-50 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                        <Activity className="text-indigo-600" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-indigo-900">6.7 ч</div>
                    <div className="text-xs text-indigo-400 font-medium">Чистое время</div>
                </div>

                <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-50 flex flex-col justify-center items-center text-center hover:bg-orange-50 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                        <Coffee className="text-orange-500" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-orange-900">25 мин</div>
                    <div className="text-xs text-orange-400 font-medium">Суммарный простой</div>
                </div>

                <div className="bg-purple-50/50 p-5 rounded-3xl border border-purple-50 flex flex-col justify-center items-center text-center hover:bg-purple-50 transition-colors">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                        <Footprints className="text-purple-500" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-purple-900">3.2 км</div>
                    <div className="text-xs text-purple-400 font-medium">Пробег за смену</div>
                </div>

                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col justify-center items-center text-center">
                    <div className="text-sm font-bold text-gray-400">Рейтинг</div>
                    <div className="text-3xl font-bold text-gray-900 mt-1">#3</div>
                    <div className="text-[10px] text-gray-400 mt-1">из 45 в отделе</div>
                </div>
            </div>

            {/* Anomalies List */}
            <div className="col-span-12 sm:col-span-6 xl:col-span-4 bg-red-50/30 rounded-3xl border border-red-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={18} className="text-red-500" />
                    <h3 className="font-bold text-gray-900">Аномалии и инциденты</h3>
                </div>

                <div className="space-y-3">
                    {stats.anomalies.map((item) => (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex items-start gap-3">
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded mt-0.5">{item.time}</span>
                            <p className="text-sm text-gray-700 leading-snug">{item.msg}</p>
                        </div>
                    ))}
                    <button className="w-full py-2 text-xs font-bold text-red-400 hover:text-red-600 transition-colors mt-2">
                        Показать все события
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailKPI;

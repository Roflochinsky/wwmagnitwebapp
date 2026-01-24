import React from 'react';
import { Mail, Phone, Calendar, MapPin, Zap, Info } from 'lucide-react';

const UserProfileMini = ({ selectedUser }: { selectedUser: any }) => {
    if (!selectedUser) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4">
                    <Info size={24} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Выберите сотрудника</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">Нажмите на строку в таблице для просмотра деталей</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-teal-100 rounded-3xl flex items-center justify-center text-teal-700 font-bold text-xl">
                    {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-sm text-teal-600 font-medium">{selectedUser.department}</p>
                </div>
            </div>

            <div className="space-y-6 flex-1">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Активность</p>
                        <p className="text-xl font-bold text-gray-900">{selectedUser.activity}%</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Простой</p>
                        <p className="text-xl font-bold text-gray-900">{selectedUser.downtime} мин</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail size={16} className="text-gray-400" />
                        <span>user@workwatch.ru</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400" />
                        <span>Зона: {selectedUser.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Zap size={16} className="text-gray-400" />
                        <span>ID устройства: #0921-X</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span>В штате с 2023</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">Сравнение с нормой</h4>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">vs Отдел</span>
                            <span className="text-teal-600 font-bold">+5%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 left-[80%] w-0.5 h-full bg-red-400 z-10" /> {/* Норма line */}
                            <div className="h-full bg-teal-500" style={{ width: `${selectedUser.activity}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 text-center italic">Красная линия — корпоративная норма (80%)</p>
                    </div>
                </div>
            </div>

            <button className="mt-6 w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all">
                Полный отчет
            </button>
        </div>
    );
};

export default UserProfileMini;

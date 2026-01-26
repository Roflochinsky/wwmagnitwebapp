import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { employeesService } from '../../api/services/employees';
import type { Employee } from '../../api/services/employees';

// Extended type for UI logic, should ideally come from backend or computed
interface EmployeeUI extends Employee {
    activity: number;
    downtime: number;
    status: 'online' | 'offline';
    trend: 'up' | 'down';
}

const UserTable = ({ onUserSelect }: { onUserSelect: (user: EmployeeUI) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [employees, setEmployees] = useState<EmployeeUI[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await employeesService.getAll();
                // Transform data for UI TODO: Get real activity stats
                const mapped: EmployeeUI[] = data.map(emp => ({
                    ...emp,
                    activity: Math.floor(Math.random() * 100), // Mock for now
                    downtime: Math.floor(Math.random() * 60),  // Mock for now
                    status: Math.random() > 0.2 ? 'online' : 'offline', // Mock
                    trend: Math.random() > 0.5 ? 'up' : 'down' // Mock
                }));
                setEmployees(mapped);
            } catch (error) {
                console.error("Failed to fetch employees", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const filteredUsers = employees.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div className="bg-white p-6 rounded-3xl text-center text-gray-500">Загрузка сотрудников...</div>;
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="font-bold text-gray-900">Список сотрудников</h3>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Поиск..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                            <th className="px-6 py-4">Сотрудник</th>
                            <th className="px-6 py-4">Отдел</th>
                            <th className="px-6 py-4">Активность</th>
                            <th className="px-6 py-4">Простой</th>
                            <th className="px-6 py-4">Тренд</th>
                            <th className="px-6 py-4 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                                onClick={() => onUserSelect(user)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm relative">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                            {user.status === 'online' && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                            <div className="text-[10px] text-gray-400">{user.status === 'online' ? 'В сети' : 'Не в сети'}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {user.department}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 min-w-[60px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${user.activity > 80 ? 'bg-teal-500' : 'bg-orange-500'} transition-all`}
                                                style={{ width: `${user.activity}%` }}
                                            />
                                        </div>
                                        <span className={`text-sm font-bold ${user.activity > 80 ? 'text-teal-600' : 'text-orange-600'}`}>{user.activity}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                                    {user.downtime} мин
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.trend === 'up' ? (
                                        <TrendingUp size={16} className="text-teal-500" />
                                    ) : (
                                        <TrendingDown size={16} className="text-red-500" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-medium">
                <div>Показано 1-{filteredUsers.length} из {employees.length}</div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-50" disabled>Назад</button>
                    <button className="px-3 py-1 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">Вперед</button>
                </div>
            </div>
        </div>
    );
};

export default UserTable;

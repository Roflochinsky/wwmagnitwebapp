import React, { useContext } from 'react';
import { PieChart, Activity, ArrowLeftRight, LayoutGrid, LogOut } from 'lucide-react';
import logo from '../../assets/logoByCo.svg';
import type { PageType } from '../../context/PageContext';
import { PageContext } from '../../context/PageContext';

const Sidebar = () => {
    const { currentPage, setCurrentPage, isSidebarCollapsed } = useContext(PageContext);

    const menuItems: { icon: typeof PieChart; label: string; page: PageType }[] = [
        { icon: PieChart, label: 'Аналитика', page: 'analytics' },
        { icon: Activity, label: 'Простои', page: 'downtime' },
        { icon: ArrowLeftRight, label: 'Перемещение', page: 'movement' },
        { icon: LayoutGrid, label: 'Пользователи', page: 'users' },
    ];

    return (
        <div
            className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-[width,padding] duration-300 ease-in-out z-50 overflow-hidden will-change-[width] ${isSidebarCollapsed ? 'w-20 p-4' : 'w-64 p-6'
                }`}
        >
            <div className={`flex items-center gap-2 mb-10 pl-2 overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'justify-center pl-0' : ''}`}>
                <img src={logo} alt="WorkWatch Logo" className={`h-8 w-auto transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0 absolute' : 'w-auto opacity-100'}`} />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="mb-8">
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setCurrentPage(item.page)}
                                title={isSidebarCollapsed ? item.label : undefined}
                                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'} py-3 rounded-xl text-sm font-medium transition-all duration-300 ${currentPage === item.page
                                    ? 'bg-gray-50 text-gray-900'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className={`flex items-center transition-all duration-300 ${isSidebarCollapsed ? 'justify-center w-full gap-0' : 'gap-3'}`}>
                                    <item.icon
                                        size={20}
                                        className={`transition-colors duration-300 ${currentPage === item.page ? "text-gray-900" : "text-gray-400"}`}
                                        strokeWidth={1.5}
                                    />
                                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}>{item.label}</span>
                                </div>
                                <div className={`h-1.5 rounded-full bg-teal-500 transition-all duration-300 ${currentPage === item.page && !isSidebarCollapsed ? 'w-1.5 opacity-100 scale-100' : 'w-0 opacity-0 scale-0'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-1">
                <button
                    title={isSidebarCollapsed ? "Выход" : undefined}
                    className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors`}
                >
                    <LogOut size={20} className="text-gray-400" strokeWidth={1.5} />
                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-16 opacity-100'}`}>Выход</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

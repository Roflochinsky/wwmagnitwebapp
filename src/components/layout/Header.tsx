import React, { useState, useContext } from 'react';
import { Mail, Bell, ChevronDown, Calendar, Search, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { PageContext } from '../../context/PageContext';
import { FilterContext } from '../../context/FilterContext';

const Header = () => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { isSidebarCollapsed, setSidebarCollapsed } = useContext(PageContext);
    const { dateRange, setDateRange, selectedObject, setSelectedObject } = useContext(FilterContext);

    // Helper to format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    // Quick range helpers
    const setQuickRange = (days: number) => {
        const to = new Date();
        const from = new Date();
        if (days === 365) {
            from.setFullYear(from.getFullYear() - 1); // Year
        } else {
            from.setDate(from.getDate() - days);
        }
        setDateRange({ from, to });
    };

    const handleCalendarApply = () => {
        // Logic to apply manual calendar selection would go here. 
        // For now, let's just close it as we haven't built the visual date picker logic fully.
        // We'll trust the 1D/7D/30D buttons for now or assume the user selected something.
        setIsCalendarOpen(false);
    };

    return (
        <header className="flex justify-between items-center py-6 px-8 bg-white/95 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100 transition-all duration-300">
            {/* Left: Title & Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                    className="p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать!</h1>
                    <button
                        className="text-sm text-gray-500 mt-1 flex items-center gap-1 hover:text-teal-600 transition-colors"
                        onClick={() => {
                            // Mock toggle object
                            const nextId = (selectedObject?.id || 0) + 1;
                            setSelectedObject({ id: nextId, name: `Объект ${nextId}` });
                        }}
                    >
                        {selectedObject ? selectedObject.name : "Выбор объекта"} <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Middle: Data Filter & Search */}
            <div className="flex items-center gap-4 bg-white/60 p-1.5 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm relative hidden xl:flex">
                <div
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={`flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-teal-200 transition-all group select-none ${isCalendarOpen ? 'ring-2 ring-teal-100 border-teal-200' : ''}`}
                >
                    <Calendar size={18} className="text-teal-600 group-hover:text-teal-700" />
                    <span className="text-sm font-semibold text-gray-700">
                        {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                    </span>
                    <ChevronDown size={14} className={`text-gray-400 group-hover:text-gray-600 transition-transform duration-300 ${isCalendarOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Calendar Dropdown */}
                {isCalendarOpen && (
                    <div className="absolute top-full left-0 mt-3 bg-white rounded-3xl shadow-xl border border-gray-100 p-5 w-80 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="font-bold text-gray-900">Январь 2026</span>
                            <div className="flex gap-1">
                                <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronLeft size={18} /></button>
                                <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"><ChevronRight size={18} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                                <span key={d} className="text-xs font-medium text-gray-400 py-1">{d}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty days for offset */}
                            {[...Array(3)].map((_, i) => <div key={`empty-${i}`} />)}

                            {/* Days - Visual only for now */}
                            {[...Array(31)].map((_, i) => {
                                const day = i + 1;
                                const isSelected = day >= 10 && day <= 20;
                                const isStart = day === 10;
                                const isEnd = day === 20;

                                return (
                                    <button
                                        key={day}
                                        className={`
                                            h-9 w-9 rounded-lg text-sm font-medium flex items-center justify-center transition-all relative
                                            ${isSelected ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50 text-gray-700'}
                                            ${isStart ? '!bg-teal-600 !text-white shadow-md z-10' : ''}
                                            ${isEnd ? '!bg-teal-600 !text-white shadow-md z-10' : ''}
                                        `}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                            <button onClick={() => setIsCalendarOpen(false)} className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-3 py-2">Отмена</button>
                            <button onClick={handleCalendarApply} className="text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 px-4 py-2 rounded-xl shadow-sm shadow-teal-200 transition-colors">Применить</button>
                        </div>
                    </div>
                )}

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                <div className="flex gap-1 bg-gray-100/50 p-1 rounded-lg">
                    {[
                        { label: '1Д', days: 1 },
                        { label: '7Д', days: 7 },
                        { label: '30Д', days: 30 }
                        // { label: 'Год', days: 365 }
                    ].map((p) => (
                        <button
                            key={p.label}
                            onClick={() => setQuickRange(p.days)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all ${
                                // Simple active check logic (approximate)
                                Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) === p.days
                                    ? 'bg-white text-teal-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-6">
                <div className="flex gap-2">
                    <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full transition-all relative">
                        <Search size={20} strokeWidth={1.5} />
                    </button>
                    <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-full transition-all relative">
                        <Bell size={20} strokeWidth={1.5} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border border-white"></span>
                    </button>
                </div>

                <div className="h-8 w-px bg-gray-200"></div>

                <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700 leading-none group-hover:text-teal-700 transition-colors">Алексей М.</span>
                        <span className="text-[10px] text-gray-400 font-medium">Администратор</span>
                    </div>
                    <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
                </div>
            </div>
        </header>
    );
};

export default Header;

import React from 'react';
import { Warehouse, Factory, Building2, Coffee } from 'lucide-react';

const MovementMap = () => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Карта перемещений (Схема)</h3>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs text-gray-500">Live Traffic</span>
                </div>
            </div>

            <div className="flex-1 relative min-h-[300px] border-2 border-dashed border-gray-50 rounded-2xl flex items-center justify-center p-8 bg-gray-50/30">
                {/* Visualizing the Zones */}
                <div className="grid grid-cols-2 gap-16 relative z-10 w-full max-w-[400px]">
                    {/* Warehouse */}
                    <div className="relative group">
                        <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm group-hover:bg-indigo-200 transition-colors">
                            <Warehouse size={28} className="text-indigo-600 mb-1" />
                            <span className="text-[10px] font-bold text-indigo-700">СКЛАД</span>
                        </div>
                        {/* Traffic Line to Shop 2 */}
                        <div className="absolute top-1/2 -right-16 w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500" />
                    </div>

                    {/* Shop 1 */}
                    <div className="relative group">
                        <div className="w-20 h-20 bg-teal-100 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm group-hover:bg-teal-200 transition-colors">
                            <Factory size={28} className="text-teal-600 mb-1" />
                            <span className="text-[10px] font-bold text-teal-700">ЦЕХ #1</span>
                        </div>
                        {/* Traffic Line to Warehouse */}
                        <div className="absolute top-1/3 -left-16 w-16 h-0.5 bg-gray-300" />
                    </div>

                    {/* Office */}
                    <div className="relative group">
                        <div className="w-20 h-20 bg-gray-100 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm group-hover:bg-gray-200 transition-colors">
                            <Building2 size={28} className="text-gray-600 mb-1" />
                            <span className="text-[10px] font-bold text-gray-700">ОФИС</span>
                        </div>
                        {/* Traffic Line to Shop 1 */}
                        <div className="absolute -top-16 left-1/2 w-0.5 h-16 bg-gray-300" />
                    </div>

                    {/* Shop 2 */}
                    <div className="relative group">
                        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex flex-col items-center justify-center border-2 border-white shadow-sm group-hover:bg-blue-200 transition-colors">
                            <Factory size={28} className="text-blue-600 mb-1" />
                            <span className="text-[10px] font-bold text-blue-700">ЦЕХ #2</span>
                        </div>
                        {/* Traffic Line to Shop 1 */}
                        <div className="absolute -top-16 left-1/2 w-1 h-16 bg-gradient-to-t from-blue-500 to-teal-500" />

                        {/* Traffic Indicator */}
                        <div className="absolute -top-8 left-1/2 -translateX-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 animate-bounce flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Legend or Annotation */}
                <div className="absolute bottom-6 right-6 max-w-[150px] p-3 bg-white/80 backdrop-blur rounded-xl border border-gray-100 text-[10px] text-gray-500 shadow-sm">
                    <p className="font-bold text-gray-800 mb-1">Анализ потоков:</p>
                    <p>Толщина линий указывает на интенсивность перемещений.</p>
                </div>
            </div>
        </div>
    );
};

export default MovementMap;

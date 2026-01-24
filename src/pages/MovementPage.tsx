import MovementStats from '../components/movement/MovementStats';
import MovementTimeline from '../components/movement/MovementTimeline';
import TopRoutes from '../components/movement/TopRoutes';
import MovementMap from '../components/movement/MovementMap';

const MovementPage = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Аналитика перемещений</h2>
            </div>

            {/* Top Section: KPI Cards */}
            <MovementStats />

            {/* Middle Section: Timeline & Map */}
            <div className="grid grid-cols-12 gap-8 mt-8">
                {/* Timeline - Left Side */}
                <div className="col-span-12 xl:col-span-7">
                    <MovementTimeline />
                </div>

                {/* Map - Right Side */}
                <div className="col-span-12 xl:col-span-5 h-[350px]">
                    <MovementMap />
                </div>
            </div>

            {/* Bottom Section: Top Routes & Insights */}
            <div className="grid grid-cols-12 gap-8 mt-8">
                <div className="col-span-12 xl:col-span-5">
                    <TopRoutes />
                </div>

                {/* Analysis Card */}
                <div className="col-span-12 xl:col-span-7 bg-white rounded-3xl p-8 border border-gray-100 flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Автоматические инсайты</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <span className="text-indigo-600 text-sm">💡</span>
                            </div>
                            <p className="text-sm text-indigo-900 leading-relaxed">
                                Маршрут <strong>Склад → Цех #2</strong> занимает на 40% больше времени, чем аналогичные пути. Рекомендуется проверить наличие препятствий или оптимизировать логистику.
                            </p>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                                <span className="text-teal-600 text-sm">✓</span>
                            </div>
                            <p className="text-sm text-teal-900 leading-relaxed">
                                Время перемещений сократилось на 5% после изменения расположения расходных материалов в <strong>Цехе #1</strong>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovementPage;

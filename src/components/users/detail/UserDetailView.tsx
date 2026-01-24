import React, { useState } from 'react';
import UserDetailHeader from './UserDetailHeader';
import UserDetailKPI from './UserDetailKPI';
import UserDailyTimeline from './UserDailyTimeline';
import UserDetailTrends from './UserDetailTrends';
import { LayoutDashboard, TrendingUp, History } from 'lucide-react';

interface UserDetailViewProps {
    user: any;
    onBack: () => void;
}

const UserDetailView = ({ user, onBack }: UserDetailViewProps) => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="max-w-[1600px] mx-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UserDetailHeader user={user} onBack={onBack} />

            {/* Tabs Navigation */}
            <div className="flex gap-1 mb-8 bg-gray-100/50 p-1 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <LayoutDashboard size={18} />
                    <span>Обзор смены</span>
                </button>
                <button
                    onClick={() => setActiveTab('trends')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'trends'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <TrendingUp size={18} />
                    <span>Тренды</span>
                </button>
                <button
                    disabled
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-gray-300 cursor-not-allowed"
                >
                    <History size={18} />
                    <span>История</span>
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <UserDetailKPI user={user} />
                    <UserDailyTimeline />
                </div>
            )}

            {activeTab === 'trends' && (
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-12 xl:col-span-8">
                        <UserDetailTrends />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetailView;

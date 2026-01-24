import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Download, MoreVertical, ShieldCheck, AlertTriangle } from 'lucide-react';

interface UserDetailHeaderProps {
    user: any;
    onBack: () => void;
}

const UserDetailHeader = ({ user, onBack }: UserDetailHeaderProps) => {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 mb-6">
            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6">

                {/* User Info & Back Button */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xl">
                            {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                {user.activity >= 80 ? (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg border border-green-100">
                                        <ShieldCheck size={14} className="text-green-600" />
                                        <span className="text-xs font-bold text-green-700">Надежный</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg border border-red-100">
                                        <AlertTriangle size={14} className="text-red-500" />
                                        <span className="text-xs font-bold text-red-600">Риск</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{user.department}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span>ID: #8921-X</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Navigation & Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-gray-900 shadow-sm transition-all">
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-2 px-4 py-1">
                            <Calendar size={16} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-700">Вчера, 21 Янв</span>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-gray-400 hover:text-gray-900 shadow-sm transition-all" disabled>
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <div className="h-8 w-[1px] bg-gray-200 mx-2" />

                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-bold">
                        <Download size={16} />
                        <span>Табель</span>
                    </button>

                    <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default UserDetailHeader;

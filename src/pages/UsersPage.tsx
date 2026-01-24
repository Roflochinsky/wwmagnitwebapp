import React, { useState } from 'react';
import UserStats from '../components/users/UserStats';
import UserTable from '../components/users/UserTable';
import UserDistribution from '../components/users/UserDistribution';
import UserProfileMini from '../components/users/UserProfileMini';
import UserDetailView from '../components/users/detail/UserDetailView';

const UsersPage = () => {
    const [selectedUser, setSelectedUser] = useState<any>(null);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-teal-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900">Управление сотрудниками</h2>
            </div>

            {/* Top Section: KPI Cards */}
            <UserStats />

            {/* Main Content Area: Detail View or List View */}
            <div className="mt-8">
                {selectedUser ? (
                    <UserDetailView user={selectedUser} onBack={() => setSelectedUser(null)} />
                ) : (
                    /* Middle Section: Table & Profile */
                    <div className="grid grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
                        {/* Table - Left Side */}
                        <div className="col-span-12 xl:col-span-8">
                            <UserTable onUserSelect={setSelectedUser} />
                        </div>

                        {/* Profile/Details - Right Side */}
                        <div className="col-span-12 xl:col-span-4 sticky top-28">
                            <div className="space-y-8">
                                <div className="h-[500px]">
                                    <UserProfileMini selectedUser={null} />
                                </div>
                                <div className="h-[300px]">
                                    <UserDistribution />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersPage;

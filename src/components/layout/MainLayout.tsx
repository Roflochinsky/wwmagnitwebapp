import React, { useContext } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { PageContext } from '../../context/PageContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const { isSidebarCollapsed } = useContext(PageContext);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-teal-100 selection:text-teal-900">
            <Sidebar />

            {/* 
              Performance Optimization:
              - Use specific transition properties (margin-left) instead of 'all'
              - Will-change hint for browser
            */}
            <div
                className={`min-h-screen flex flex-col transition-[margin-left] duration-300 ease-in-out will-change-[margin-left] ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
            >
                <Header />
                <main className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;

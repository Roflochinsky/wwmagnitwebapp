import React, { createContext } from 'react';

export type PageType = 'analytics' | 'downtime' | 'movement' | 'users';

export const PageContext = createContext<{
    currentPage: PageType;
    setCurrentPage: (page: PageType) => void;
    isSidebarCollapsed: boolean;
    setSidebarCollapsed: (collapsed: boolean) => void;
}>({
    currentPage: 'analytics',
    setCurrentPage: () => { },
    isSidebarCollapsed: false,
    setSidebarCollapsed: () => { },
});

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPage, setCurrentPage] = React.useState<PageType>('analytics');
    const [isSidebarCollapsed, setSidebarCollapsed] = React.useState(false);

    return (
        <PageContext.Provider value={{ currentPage, setCurrentPage, isSidebarCollapsed, setSidebarCollapsed }}>
            {children}
        </PageContext.Provider>
    );
};

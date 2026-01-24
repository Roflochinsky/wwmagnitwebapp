import { createContext } from 'react';

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

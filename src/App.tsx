import React, { useState } from 'react';
import type { PageType } from './context/PageContext';
import { PageContext } from './context/PageContext';
import AnalyticsPage from './pages/AnalyticsPage';
import DowntimePage from './pages/DowntimePage';
import MovementPage from './pages/MovementPage';
import UsersPage from './pages/UsersPage';
import MainLayout from './components/layout/MainLayout';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('analytics');
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'analytics':
        return <AnalyticsPage />;
      case 'downtime':
        return <DowntimePage />;
      case 'movement':
        return <MovementPage />;
      case 'users':
        return <UsersPage />;
      default:
        return <AnalyticsPage />;
    }
  };

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage, isSidebarCollapsed, setSidebarCollapsed }}>
      <MainLayout>
        {renderPage()}
      </MainLayout>
    </PageContext.Provider>
  );
}

export default App;

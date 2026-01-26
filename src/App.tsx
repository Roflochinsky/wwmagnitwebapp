import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PageProvider } from './context/PageContext';
import LoginPage from './pages/LoginPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DowntimePage from './pages/DowntimePage';
import MovementPage from './pages/MovementPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PageProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/analytics" replace />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/downtime" element={<DowntimePage />} />
              <Route path="/movement" element={<MovementPage />} />
              <Route path="/users" element={<UsersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/analytics" replace />} />
          </Routes>
        </PageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from './layout/MainLayout';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    // If auth status is unknown (loading), we might want a spinner, but for now:
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    );
};

export default ProtectedRoute;

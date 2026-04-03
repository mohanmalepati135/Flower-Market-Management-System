import React from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import FarmerDashboard from './pages/FarmerDashboard';

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-bold text-indigo-600">Loading...</div>
      </div>
    );
  }
  
  if (!user) return <Login />;
  
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'BUYER':
      return <BuyerDashboard />;
    case 'FARMER':
      return <FarmerDashboard />;
    default:
      return <Login />;
  }
};

export default AppContent;
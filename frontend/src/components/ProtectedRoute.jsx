// src/components/ProtectedRoute.jsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  // Jab tak user status check ho raha hai, kuch na dikhayein
  if (loading) {
    return <div>Loading...</div>; // Ya ek accha sa spinner dikha sakte hain
  }
  
  // Agar user logged in hai aur role match karta hai (ya role zaroori nahi hai)
  if (user && (!role || user.role === role)) {
    return <Outlet />;
  }

  // Agar user logged in nahi hai, toh login page par bhej dein
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
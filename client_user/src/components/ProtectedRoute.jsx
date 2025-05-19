import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // Check if token and user exist
  const isAuthenticated = token && user;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected route
  return <Outlet />;
}
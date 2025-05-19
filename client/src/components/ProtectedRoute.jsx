import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  if (!token || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
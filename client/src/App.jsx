import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './components/Vehicles';
import ParkingSlots from './components/ParkingSlots';
import SlotRequests from './components/SlotRequests';
import ProtectedRoute from './components/ProtectedRoute';
import SignUp from './pages/Signup';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute>
            <Vehicles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parking-slots"
        element={
          <ProtectedRoute>
            <ParkingSlots />
          </ProtectedRoute>
        }
      />
      <Route
        path="/slot-requests"
        element={
          <ProtectedRoute>
            <SlotRequests />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}
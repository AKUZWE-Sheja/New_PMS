import { Route, Router, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SignUp from './pages/Signup'
import NotFound from './utils/not-found'
import './constants/colors.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import VerifyOtp from './pages/VerifyOtp'
import Vehicles from './pages/Vehicles'
import ParkingSlots from './pages/ParkingSlots'
import SlotRequests from './pages/SlotRequests'
import ProtectedRoute from './components/ProtectedRoute'



export default function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/parking-slots" element={<ParkingSlots />} />
          <Route path="/slot-requests" element={<SlotRequests />} />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path='*' element={< NotFound/>} />
      </Routes>
  );
}
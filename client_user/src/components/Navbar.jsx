import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();

  let user = {};
  
  try {
    const storedUser = localStorage.getItem('user');
    // Only parse if storedUser is truthy and not "undefined"
    user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    user = {};
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-green-800 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          RRA<span className="text-gray-200"> PMS</span>
        </Link>
        <div className="flex space-x-4 items-center">
          <Link to="/vehicles" className="hover:text-gray-200">Vehicles</Link>
          <Link to="/parking-slots" className="hover:text-gray-200">Parking Slots</Link>
          <Link to="/slot-requests" className="hover:text-gray-200">Slot Requests</Link>
          {user.role === 'admin' && (
            <Link to="http://localhost:3000/login" className="hover:text-gray-200">Admin</Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-white text-green-800 px-3 py-1 rounded-lg hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
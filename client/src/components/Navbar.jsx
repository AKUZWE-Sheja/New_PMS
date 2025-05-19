import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import { FaHome, FaCar, FaParking, FaListAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { 
    if (window.confirm("Are you sure you want to logout??")) {
      logout();
      navigate('/login');
    }
  }

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaHome className="mr-2" /> },
    { to: '/vehicles', label: 'Vehicles', icon: <FaCar className="mr-2" /> },
    { to: '/parking-slots', label: 'Parking Slots', icon: <FaParking className="mr-2" /> },
    { to: '/slot-requests', label: 'Slot Requests', icon: <FaListAlt className="mr-2" /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/dashboard" 
              className="flex items-center text-xl font-bold tracking-tight"
            >
              <span>RRA<span className="text-amber-200"> PMS</span> </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? 'bg-green-800 text-white shadow-inner'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center ml-4 px-3 py-2 rounded-md text-sm font-medium text-green-100 hover:bg-red-500 hover:text-white transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Log out
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-green-200 hover:text-white hover:bg-green-700 focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-green-700 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.to
                    ? 'bg-green-800 text-white'
                    : 'text-green-100 hover:bg-green-600 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-green-100 hover:bg-red-600 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
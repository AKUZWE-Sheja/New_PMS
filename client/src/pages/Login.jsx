import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import ErrorMessage from '../utils/error-msg';
import { FaCar, FaSignInAlt, FaUserPlus, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    api: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters long' };
    }
    return { isValid: true, error: '' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "", api: "" }));

    if (name === "password") {
      const { isValid, error } = checkPasswordStrength(value);
      setErrors((prev) => ({ ...prev, password: isValid ? "" : error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { isValid, error } = checkPasswordStrength(formData.password);
    if (!isValid) {
      setErrors((prev) => ({ ...prev, password: error }));
      setIsLoading(false);
      return;
    }

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        api: error.response?.data?.error || 'Login failed',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-50 to-amber-50">
      {/* Left Panel - Branding */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 md:p-12 bg-green-700 rounded-br-3xl">
        <div className="text-center md:text-left max-w-xs">
          <div className="flex items-center justify-center mb-6">
            <FaCar className="text-white text-4xl mr-3" />
            <h1 className="text-4xl font-bold text-white">
              RRA<span className="text-amber-200"> PMS</span>
            </h1>
          </div>
          <p className="text-green-100 mt-4 text-lg">
            RRA Parking Management System
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-3/5 bg-white rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-green-100 opacity-20"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-amber-100 opacity-20"></div>

        <div className="max-w-md mx-auto w-full relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-green-800 flex items-center justify-center">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2">Sign in to manage your parking system</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Optional Name Input */}
            {/* 
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="text-sm w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Your Name"
              />
              <ErrorMessage message={errors.name} />
            </div>
            */}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`text-sm w-full px-4 py-3 pl-10 border outline-none ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg`}
                  placeholder="your@email.com"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              <ErrorMessage message={errors.email} />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`text-sm w-full px-4 py-3 pl-10 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg outline-none transition bg-white`}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEye className="h-5 w-5" /> : <FaEyeSlash className="h-5 w-5" />}
                </button>
              </div>
              <ErrorMessage message={errors.password} />
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 checked:bg-pink-600 checked:border-transparent"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            <ErrorMessage message={errors.api} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium shadow-sm transition-colors duration-300 ${
                isLoading
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              New to RRA PMS?{' '}
              <Link to="/signup" className="font-medium text-green-600 hover:text-green-500 inline-flex items-center">
                <FaUserPlus className="mr-1" />
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FaEyeSlash, FaEye, FaUser, FaEnvelope, FaLock, FaCar } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkPasswordStrength } from "../utils/password-check";
import ErrorMessage from "../utils/error-msg";
import { register } from "../services/api";

export default function SignUp() {
  const navigate = useNavigate();

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
    setErrors({ name: "", email: "", password: "", api: "" });

    const { isValid, error } = checkPasswordStrength(formData.password);
    if (!isValid) {
      setErrors((prev) => ({ ...prev, password: error }));
      return;
    }

    try {
      const { userId } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard", { state: { userId, email: formData.email } });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Sign-up failed. Please try again.";
      setErrors((prev) => ({ ...prev, api: errorMsg }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-green-700 to-green-600">
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

      {/* Right Panel - Signup Form */}
      <div className="w-full md:w-3/5 bg-white rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-green-100 opacity-20"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-amber-100 opacity-20"></div>
        
        <div className="max-w-md mx-auto w-full relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-green-800 flex items-center justify-center">
              Create Account
            </h1>
            <p className="text-gray-500 mt-2">Register to manage your parking system</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`text-sm w-full px-4 py-3 pl-10 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white`}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <ErrorMessage message={errors.name} />
            </div>

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
                  placeholder="your@email.com"
                  className={`text-sm w-full px-4 py-3 pl-10 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white`}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <ErrorMessage message={errors.email} />
            </div>

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
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white`}
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
              <ErrorMessage message={errors.password || errors.api} />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-colors duration-300 flex items-center justify-center"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
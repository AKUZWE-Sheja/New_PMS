import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkPasswordStrength } from "../utils/password-check";
import ErrorMessage from "../utils/error-msg";
import { login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "",
  });
    
    // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

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
    setErrors({ email: "", password: "", api: "" });

    const { isValid, error } = checkPasswordStrength(formData.password);
    if (!isValid) {
      setErrors((prev) => ({ ...prev, password: error }));
      return;
    }

    try {
      await login({ email: formData.email, password: formData.password });
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed. Please try again.";
      if (error.response?.status === 403) {
        const { userId } = error.response.data;
        navigate("/verify-otp", { state: { userId, email: formData.email } });
      } else {
        setErrors((prev) => ({ ...prev, api: errorMsg }));
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-green-800">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            RRA<span className="text-white"> PMS</span>
          </h1>
          <p className="text-white mt-2 text-lg">Seamless Vehicle Parking Management</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold text-gray-800">Login to RRA PMS</h1>
            <p className="text-gray-500 text-sm mt-2">
              Enter your email and password below
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className={`text-sm w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none transition`}
                required
              />
              <ErrorMessage message={errors.email} />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                PASSWORD
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`text-sm w-full px-4 py-3 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none transition pr-10`}
                aria-describedby={errors.password ? "password-error" : undefined}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <ErrorMessage message={errors.password || errors.api} id="password-error" />
            </div>

            <button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-colors duration-300"
            >
              Log In
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-800 hover:text-green-700 font-medium"
              >
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-500">
              Forgot your password?{" "}
              <Link
                to="/forgot-password"
                className="text-green-800 hover:text-green-700 font-medium"
              >
                Reset
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
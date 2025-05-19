import { FaEyeSlash, FaEye } from "react-icons/fa";
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
      navigate("/verify-otp", { state: { userId, email: formData.email } });
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Sign-up failed. Please try again.";
      setErrors((prev) => ({ ...prev, api: errorMsg }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-green-700">
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
            <h1 className="text-2xl font-bold text-gray-800">Sign Up for RRA PMS</h1>
            <p className="text-gray-500 text-sm mt-2">
              Create an account to manage your parking
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                NAME
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                className={`text-sm w-full px-4 py-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition`}
                required
              />
              <ErrorMessage message={errors.name} />
            </div>

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
                } rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition`}
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
                } rounded-lg focus:ring-2 focus:ring-green-700 focus:border-green-700 outline-none transition pr-10`}
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
              className="w-full bg-green-700 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-700 hover:text-green-700 font-medium"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
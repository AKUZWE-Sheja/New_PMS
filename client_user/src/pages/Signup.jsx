import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkPasswordStrength } from "../utils/password-check";
import ErrorMessage from "../utils/error-msg";
import { register } from "../services/api";

// ...existing code...
// This is the Signup page component
export default function Signup() {
  const navigate = useNavigate();

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // State for form data, now includes firstName and lastName
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // State for error messages
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
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

  // Handle input changes for all fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "", api: "" }));

    // Password strength check on change
    if (name === "password") {
      const { isValid, error } = checkPasswordStrength(value);
      setErrors((prev) => ({ ...prev, password: isValid ? "" : error }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ firstName: "", lastName: "", email: "", password: "", api: "" });

    // Simple validation for first and last name
    if (!formData.firstName.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
      return;
    }
    if (!formData.lastName.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "Last name is required" }));
      return;
    }

    // Use the password check utility here
    const { isValid, error } = checkPasswordStrength(formData.password);
    if (!isValid) {
      setErrors((prev) => ({ ...prev, password: error }));
      return;
    }

    try {
  // Call register API 
  const res = await register({ 
    email: formData.email, 
    password: formData.password,
    fname: formData.firstName,
    lname: formData.lastName,
  });
  // Redirect to OTP verification with userId and email
  navigate("/verify-otp", { state: { userId: res.userId, email: formData.email } });
} catch (error) {
  const errorMsg = error.response?.data?.error || "Signup failed. Please try again.";
  setErrors((prev) => ({ ...prev, api: errorMsg }));
}
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-green-800">
      {/* Left side: Branding and welcome */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            XYZ<span className="text-white"> PMS</span>
          </h1>
          <p className="text-white mt-2 text-lg">Seamless Vehicle Parking Management</p>
        </div>
      </div>

      {/* Right side: Signup form */}
      <div className="w-full md:w-1/2 bg-white rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm font-medium mb-1">Welcome !!!</p>
            <h1 className="text-2xl font-bold text-gray-800">Signup to XYZ PMS</h1>
            <p className="text-gray-500 text-sm mt-2">
              Enter your details below to sinup
            </p>
          </div>

          {/* LogSignupin form starts here */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Name Field */}
            <div>
              {/* Just your first name, nothing fancy! */}
              <label
                htmlFor="firstName"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                FIRST NAME
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className={`text-sm w-full px-4 py-3 border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none transition`}
                required
              />
              <ErrorMessage message={errors.firstName} />
            </div>

            {/* Last Name Field */}
            <div>
              {/* And your last name, please! */}
              <label
                htmlFor="lastName"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                LAST NAME
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className={`text-sm w-full px-4 py-3 border ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none transition`}
                required
              />
              <ErrorMessage message={errors.lastName} />
            </div>

            {/* Email Field */}
            <div>
              {/* Don't forget your email! */}
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

            {/* Password Field */}
            <div className="relative">
              {/* Shhh... your password is safe with us! */}
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
                // Toggle password visibility, because sometimes you just need to check!
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <ErrorMessage message={errors.password || errors.api} id="password-error" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-colors duration-300"
            >
              Signup
            </button>
          </form>

          {/* Links for signup and forgot password */}
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-800 hover:text-green-700 font-medium"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
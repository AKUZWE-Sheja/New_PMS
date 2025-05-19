import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ErrorMessage from "../utils/error-msg";
import { verifyOtp, resendOtp } from "../services/api";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { userId, email } = state || {};

  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState({ otpCode: "", api: "" });

  const handleChange = (e) => {
    setOtpCode(e.target.value);
    setErrors({ otpCode: "", api: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setErrors((prev) => ({ ...prev, otpCode: "Please enter a 6-digit OTP" }));
      return;
    }

    try {
      await verifyOtp({ userId, otpCode });
      navigate("/dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Invalid or expired OTP";
      setErrors((prev) => ({ ...prev, api: errorMsg }));
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ userId });
      setErrors((prev) => ({ ...prev, api: "OTP resent. Check your email (including spam)." }));
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrors((prev) => ({ ...prev, api: "Failed to resend OTP. Please try again." }));
    }
  };

  if (!userId || !email) {
    navigate("/login");
    return null;
  }

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
            <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
            <p className="text-gray-500 text-sm mt-2">
              Enter the 6-digit OTP sent to {email}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="otpCode"
                className="block text-xs font-medium text-gray-500 mb-1"
              >
                OTP CODE
              </label>
              <input
                type="text"
                name="otpCode"
                id="otpCode"
                value={otpCode}
                onChange={handleChange}
                placeholder="Enter 6-digit OTP"
                className={`text-sm w-full px-4 py-3 border ${
                  errors.otpCode ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-green-800 focus:border-green-800 outline-none transition`}
                maxLength={6}
                required
              />
              <ErrorMessage message={errors.otpCode || errors.api} />
            </div>

            <button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium shadow-sm transition-colors duration-300"
            >
              Verify OTP
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-gray-500">
              Didn't receive the OTP?{" "}
              <button
                onClick={handleResend}
                className="text-green-800 hover:text-green-700 font-medium"
              >
                Resend OTP
              </button>
            </p>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-800 hover:text-green-700 font-medium"
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
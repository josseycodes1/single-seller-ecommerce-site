"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyForgotPassword() {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    new_password: "",
    confirm_password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Pre-fill email from query params if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam && !formData.email) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams, formData.email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = [];
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.push("Please enter a valid email address.");
    }
    
    // Code validation
    if (!formData.code.trim()) {
      newErrors.push("Verification code is required.");
    }
    
    // Password validation
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!formData.new_password.trim() || !strongPassword.test(formData.new_password.trim())) {
      newErrors.push("Password must be at least 8 characters and contain letters and numbers.");
    }
    
    // Confirm password validation
    if (formData.new_password !== formData.confirm_password) {
      newErrors.push("Passwords do not match.");
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setMessage("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/password-reset/confirm/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email.trim(),
            code: formData.code.trim(),
            new_password: formData.new_password.trim()
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => {
          router.push("/seller/login?message=Password reset successful. Please login with your new password.");
        }, 2000);
      } else {
        setErrors([data.message || "Failed to reset password. Please check your code and try again."]);
      }
    } catch (error) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Password
            </h1>
            <p className="text-gray-600">
              Enter the verification code and your new password
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
              {message}
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent transition-colors"
                placeholder="you@business.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Verification Code
              </label>
              <input
                name="code"
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent transition-colors"
                placeholder="Enter 6-digit code"
                value={formData.code}
                onChange={handleChange}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Check your email for the verification code we sent you
              </p>
            </div>

            <div>
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  name="new_password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent transition-colors pr-10"
                  placeholder="Create a new password"
                  value={formData.new_password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Use at least 8 characters with a mix of letters, numbers and symbols
              </p>
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  name="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC46AA] focus:border-transparent transition-colors pr-10"
                  placeholder="Confirm your new password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={loading}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FC46AA] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#F699CD] transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#FC46AA] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive the code?{" "}
              <Link
                href="/forgot-password"
                className="text-[#FC46AA] hover:text-[#F699CD] font-medium transition-colors"
              >
                Resend code
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden lg:block relative w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FC46AA] to-[#F699CD] opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white text-center max-w-md">
            <h2 className="text-3xl font-bold mb-4">Secure Your Account</h2>
            <p className="text-lg opacity-90 mb-6">
              Create a strong, unique password to protect your seller account and business data.
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>Use a combination of letters, numbers, and symbols</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>Avoid common words or personal information</span>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>Consider using a password manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
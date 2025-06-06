import React, { useState } from 'react';
import axios from 'axios';

const AuthModal = ({ onClose, open }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isSignUp && !formData.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const loginUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://https://online-auction-platform-1.onrender.com/login",
        // "https://online-auction-platform-4qje.onrender.com/login",

        {
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      setIsLoading(false);
      onClose();
      return true;
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed');
      setIsLoading(false);
      return false;
    }
  };

  const signupUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://online-auction-platform-1.onrender.com/signup",
        // "https://online-auction-platform-4qje.onrender.com/signup",
        
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      // Fetch dashboard data after signup
      const dashboardResponse = await axios.get("https://online-auction-platform-1.onrender.com/api/user/dashboard", {
        headers: {
          "Authorization": `Bearer ${response.data.token}`,
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("dashboardData", JSON.stringify(dashboardResponse.data));
      setIsLoading(false);
      onClose();
      return true;
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Signup failed');
      setIsLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    const success = isSignUp ? await signupUser() : await loginUser();
    if (success) {
      window.location.href = '/';
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-blur-sm bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required={isSignUp}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 bg-indigo-600 text-white rounded-md font-medium
              ${isLoading 
                ? 'opacity-75 cursor-not-allowed' 
                : 'hover:bg-indigo-700'} 
              transition-all duration-200`}
          >
            {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={toggleForm}
              className="ml-1 text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
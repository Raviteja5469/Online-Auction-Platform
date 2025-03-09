import React, { useState } from 'react';

const LoginPopUp = ({ setShowLogin }) => {
  const [currentState, setCurrentState] = useState("LOGIN");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 overflow-hidden">
        <form className="p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{currentState}</h2>
            <button 
              onClick={() => setShowLogin(false)}
              className="text-white/70 hover:text-white transition-colors"
              type="button"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {currentState === "SIGNUP" && (
              <input
                type="text"
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 backdrop-blur-sm"
              />
            )}
            <input
              type="email"
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 backdrop-blur-sm"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 backdrop-blur-sm"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 ease-in-out shadow-lg hover:shadow-orange-500/25"
          >
            {currentState === "SIGNUP" ? "Create Account" : "Login"}
          </button>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-2">
            <input 
              type="checkbox" 
              required 
              className="mt-1 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500"
            />
            <p className="text-sm text-white/70">
              By continuing, I agree to the terms and conditions & privacy policy.
            </p>
          </div>

          {/* Toggle Login/Signup */}
          <div className="text-center">
            {currentState === "LOGIN" ? (
              <p className="text-white/70">
                Create a new account?{' '}
                <span 
                  onClick={() => setCurrentState("SIGNUP")}
                  className="text-orange-400 hover:text-orange-300 cursor-pointer underline transition-colors"
                >
                  Click Here
                </span>
              </p>
            ) : (
              <p className="text-white/70">
                Already have an account?{' '}
                <span 
                  onClick={() => setCurrentState("LOGIN")}
                  className="text-orange-400 hover:text-orange-300 cursor-pointer underline transition-colors"
                >
                  Login Here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopUp;

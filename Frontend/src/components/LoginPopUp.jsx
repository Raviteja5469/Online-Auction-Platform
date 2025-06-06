import React, { useState } from "react";
import axios from "axios";

const LoginPopup = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // For sign-up
  const [errorMessage, setErrorMessage] = useState("");

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrorMessage(""); // Clear error message on toggle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error

    const payload = isSignUp
      ? { name, email, password }
      : { email, password };

    const endpoint = isSignUp
      ? "https://online-auction-platform-1.onrender.com/api/signup"
      : "https://online-auction-platform-1.onrender.com/api/signin";

    try {
      const response = await axios.post(endpoint, payload);
      console.log(response.data); // Handle the response from your backend (e.g., set tokens, navigate user, etc.)
      onClose(); // Close the popup after successful auth
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
          <button
            className="absolute top-4 right-4 text-xl font-bold"
            onClick={onClose}
          >
            X
          </button>
          <h2 className="text-2xl mb-6 text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-sm text-center">
            {isSignUp
              ? "Already have an account? "
              : "Don't have an account? "}
            <span
              onClick={toggleForm}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    )
  );
};

export default LoginPopup;

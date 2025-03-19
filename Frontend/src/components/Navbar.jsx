import React, { useState, useEffect } from 'react';
import './import.css';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for token on mount and handle scroll
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to home after logout
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Auctions', href: '/on-going-Auctions' },
    // { name: 'Dashboard', href: '/dashboard' },
    { name: 'Post Auction', href: '/post-auction' },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a
                href="/"
                className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-indigo-600' : 'text-white'
                }`}
              >
                Auction App
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-[20px] font-medium transition-colors duration-300 ${
                    isScrolled
                      ? 'text-gray-700 hover:text-indigo-600'
                      : 'text-white hover:text-indigo-200'
                  }`}
                >
                  {link.name}
                </a>
              ))}

              {/* Auth/Dashboard Section */}
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    <a
                      href="/dashboard"
                      className={`px-4 py-2 flex rounded-md text-[18px] font-medium transition-all duration-300 ${
                        isScrolled
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-white text-indigo-600 hover:bg-indigo-50'
                      }`}
                    > Dashboard
                    </a>
                    <span className={`${isScrolled ? 'text-indigo-600' : 'text-white'}`}>
                      
                    </span>
                    <button
                      onClick={handleLogout}
                      className={`px-4 py-2 rounded-md text-m font-medium transition-all duration-300 ${
                        isScrolled
                          ? 'text-indigo-600 hover:text-indigo-800'
                          : 'text-white hover:text-indigo-200'
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isScrolled
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    LOGIN
                  </button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
              >
                {link.name}
              </a>
            ))}
            <div className="mt-4 px-3 space-y-2">
              {isLoggedIn ? (
                <>
                  <a
                    href="/dashboard"
                    className="block w-full px-4 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 text-center"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 rounded-md text-base font-medium text-indigo-600 hover:text-indigo-800 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="block w-full px-4 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => {
          setShowAuthModal(false);
          setIsLoggedIn(!!localStorage.getItem('token')); // Update login status after auth
        }} />
      )}
    </>
  );
};

export default Navbar;
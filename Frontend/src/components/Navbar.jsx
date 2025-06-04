import React, { useState, useEffect } from 'react';
import './import.css';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from '../components/Authmodal';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ openLoginModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

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

  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirect to home after logout
  };

  const handleAuctionsClick = (e) => {
    e.preventDefault();
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      // Navigate to /on-going-Auctions
      navigate('/on-going-Auctions');
    } else {
      // Show login modal
      openLoginModal();
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Auctions', href: '/on-going-Auctions' },
    { name: 'Post Auction', href: '/post-auction' },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          isScrolled ? (theme === 'dark' ? 'bg-gray-900/90 shadow-lg' : 'bg-white/90 shadow-lg') : (theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-white to-gray-100')
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a
                href="/"
                className={`text-2xl font-bold font-playfair transition-colors duration-300 ${theme === 'dark' ? 'text-white hover:text-d4a017' : 'text-gray-900 hover:text-d4a017'}`}
              >
                Auction App
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                // List of links that require login
                const requiresLogin = ['Auctions', 'Post Auction'];
                const isProtected = requiresLogin.includes(link.name);

                // Desktop links
                return isProtected ? (
                  <button
                    key={link.name}
                    onClick={(e) => {
                      e.preventDefault();
                      const isLoggedIn = !!localStorage.getItem('token');
                      if (isLoggedIn) {
                        navigate(link.href);
                      } else {
                        openLoginModal();
                      }
                    }}
                    className={`px-3 py-2 rounded-md text-[20px] font-medium font-inter transition-colors duration-300 text-white hover:text-d4a017`}
                  >
                    {link.name}
                  </button>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-[20px] font-medium font-inter transition-colors duration-300 text-white hover:text-d4a017`}
                  >
                    {link.name}
                  </a>
                );
              })}

              {/* Auth/Dashboard Section */}
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    <a
                      href="/dashboard"
                      className={`px-4 py-2 flex rounded-md text-[18px] font-medium font-inter transition-all duration-300 bg-white text-gray-900 hover:bg-gray-200`}
                    >
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className={`px-4 py-2 rounded-md text-[18px] font-medium font-inter transition-all duration-300 text-white hover:text-d4a017`}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className={`px-4 py-2 rounded-md text-[18px] font-medium font-inter transition-all duration-300 bg-white text-gray-900 hover:bg-gray-200`}
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
                className={`inline-flex items-center justify-center p-2 rounded-md text-white hover:text-d4a017 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-d4a017`}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 shadow-lg">
            {navLinks.map((link) => {
              const requiresLogin = ['Auctions', 'Post Auction'];
              const isProtected = requiresLogin.includes(link.name);

              return isProtected ? (
                <button
                  key={link.name}
                  onClick={(e) => {
                    e.preventDefault();
                    const isLoggedIn = !!localStorage.getItem('token');
                    if (isLoggedIn) {
                      navigate(link.href);
                      setIsOpen(false);
                    } else {
                      openLoginModal();
                      setIsOpen(false);
                    }
                  }}
                  className={`block w-full px-3 py-2 rounded-md text-base font-medium font-inter text-left text-white hover:text-d4a017 hover:bg-gray-700`}
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium font-inter text-white hover:text-d4a017 hover:bg-gray-700`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="mt-4 px-3 space-y-2">
              {isLoggedIn ? (
                <>
                  <a
                    href="/dashboard"
                    className="block w-full px-4 py-2 rounded-md text-base font-medium font-inter bg-white text-gray-900 hover:bg-gray-200 text-center"
                  >
                    Dashboard
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 rounded-md text-base font-medium font-inter text-white hover:text-d4a017 hover:bg-gray-700 text-center"
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
                  className="block w-full px-4 py-2 rounded-md text-base font-medium font-inter bg-white text-gray-900 hover:bg-gray-200"
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
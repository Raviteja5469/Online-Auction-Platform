import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Stars Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <motion.div
        className="absolute top-20 right-20 w-20 h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-2 right-4 w-4 h-4 rounded-full bg-gray-600 opacity-30" />
        <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-gray-600 opacity-30" />
      </motion.div>

      {/* Road Line */}
      <div className="absolute bottom-32 w-full">
        <motion.div
          className="h-[2px] w-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #4B5563 50%, transparent 100%)',
            backgroundSize: '200% 100%',
          }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />
      </div>

      {/* Cyclist Container */}
      <motion.div
        className="relative mb-32"
        animate={{
          y: [-4, 4]
        }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.8,
          ease: "easeInOut"
        }}
      >
        <svg width="240" height="240" viewBox="0 0 120 120" className="transform -scale-x-100">
          {/* Bicycle Glow Effect */}
          <motion.circle
            cx="50"
            cy="70"
            r="35"
            className="opacity-20"
            style={{
              fill: 'url(#glowGradient)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Define Gradient */}
          <defs>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Wheels with Spokes */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }}
          >
            <circle cx="70" cy="70" r="12" stroke="#60A5FA" strokeWidth="2" fill="none" />
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="70"
                y1="70"
                x2={70 + Math.cos(i * Math.PI / 4) * 12}
                y2={70 + Math.sin(i * Math.PI / 4) * 12}
                stroke="#60A5FA"
                strokeWidth="1"
              />
            ))}
          </motion.g>

          <motion.g
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }}
          >
            <circle cx="30" cy="70" r="12" stroke="#60A5FA" strokeWidth="2" fill="none" />
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="30"
                y1="70"
                x2={30 + Math.cos(i * Math.PI / 4) * 12}
                y2={70 + Math.sin(i * Math.PI / 4) * 12}
                stroke="#60A5FA"
                strokeWidth="1"
              />
            ))}
          </motion.g>

          {/* Enhanced Bicycle Frame */}
          <path
            d="M30,70 L45,50 L70,50 L70,70 M45,50 L50,35 L65,35 M50,35 L40,35"
            stroke="#60A5FA"
            strokeWidth="3"
            fill="none"
            strokeLinejoin="round"
          />

          {/* Cyclist */}
          <motion.g
            animate={{
              y: [-2, 2]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.5
            }}
          >
            {/* Body */}
            <path
              d="M50,36 C50,36 52,42 50,45 C48,48 45,55 45,55"
              stroke="#60A5FA"
              strokeWidth="3"
              fill="none"
            />

            {/* Head with Helmet */}
            <path
              d="M46,30 Q50,25 54,30"
              stroke="#60A5FA"
              strokeWidth="3"
              fill="none"
            />
            <circle cx="50" cy="30" r="6" fill="#60A5FA" />

            {/* Animated Arms */}
            <motion.path
              d="M50,45 L60,50"
              stroke="#60A5FA"
              strokeWidth="3"
              fill="none"
              animate={{
                d: ["M50,45 L60,50", "M50,45 L58,48", "M50,45 L60,50"]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.5,
                ease: "easeInOut"
              }}
            />

            {/* Animated Legs */}
            <motion.path
              d="M50,45 L45,55"
              stroke="#60A5FA"
              strokeWidth="3"
              fill="none"
              animate={{
                d: ["M50,45 L45,55", "M50,45 L48,52", "M50,45 L45,55"]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.5,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
          404
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Looks like you've pedaled off the trail!
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          <span className="mr-2">Ride back home</span>
          <svg 
            className="w-5 h-5" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

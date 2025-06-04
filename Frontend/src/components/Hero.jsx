import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-[url('/auction-hero-bg.png')] bg-cover bg-center opacity-50 animate-bg-move"
          style={{
            backgroundImage: `url('/auction-hero-bg.png')`,
            backgroundAttachment: 'fixed',
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better text contrast */}
        {/* Animated floating shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/4 top-1/3 w-32 h-32 bg-d4a017 opacity-20 rounded-full blur-2xl animate-float-slow" />
          <div className="absolute right-1/4 bottom-1/4 w-24 h-24 bg-blue-400 opacity-20 rounded-full blur-2xl animate-float-fast" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 py-20 sm:py-24">
        {/* Text Content */}
        <div className="text-center lg:text-left lg:w-1/2">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-playfair animate-fade-in-up">
            Discover Rare Treasures
          </h1>
          <p className="mt-6 max-w-md mx-auto lg:mx-0 text-lg sm:text-xl lg:text-2xl text-gray-300 font-inter animate-fade-in-up animation-delay-200">
            Experience the thrill of our exclusive auction platform. Bid on unique collectibles, manage your auctions seamlessly, and join a vibrant community of enthusiasts.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-white text-gray-900 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-fade-in-up animation-delay-400 shadow-glow"
            >
              Start Bidding Now
            </a>
            <a
              href="#learn-more"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-full bg-transparent border-2 border-white text-white hover:bg-white/10 hover:text-white transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-600"
            >
              Explore Auctions
            </a>
          </div>
        </div>
        {/* Hero Image */}
        <div className="lg:w-1/2 animate-scale-in">
          <img
            src="/auction-hero.png"
            alt="Vintage auction collectibles"
            className="w-full max-w-md mx-auto lg:mx-0 rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Tailwind Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity        opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatFast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 1s ease-out forwards;
        }
        .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
        .animate-float-fast { animation: floatFast 4s ease-in-out infinite; }
        .shadow-glow {
          box-shadow: 0 0 16px 4px #d4a01766, 0 2px 8px 0 #0002;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </section>
  );
};

export default Hero;
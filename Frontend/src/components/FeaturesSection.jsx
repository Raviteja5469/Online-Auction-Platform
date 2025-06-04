import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Easy Bidding',
      description: 'Place your bids quickly with an intuitive, user-friendly interface.',
      icon: '💰',
    },
    {
      title: 'Secure Transactions',
      description: 'Experience safe and secure payment processing for every auction.',
      icon: '🔒',
    },
    {
      title: 'Community Feedback',
      description: 'Engage with a vibrant community and get real-time updates.',
      icon: '💬',
    },
    {
      title: 'Dashboard Management',
      description: 'Keep track of all your bids and auctions in one comprehensive dashboard.',
      icon: '📊',
    },
    {
      title: 'Post Auction Easily',
      description: 'List your items for auction effortlessly with our user-friendly posting tool.',
      icon: '📝',
    },
  ];

  return (
    <section className="bg-white py-16"style={{ backgroundColor: 'rgb(233 233 233)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-extrabold tracking-tight text-gray-900 font-semibold text-d4a017 uppercase tracking-wide font-inter animate-fade-in">
            Features
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-playfair animate-fade-in">
            What Makes Us Unique
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto font-inter animate-fade-in animation-delay-200">
            Our platform delivers a seamless auction experience with powerful features.
          </p>
        </div>
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-d4a017 hover:scale-105 transition-all duration-300 animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-d4a017/20 group-hover:bg-d4a017/40 transition-colors duration-300 mx-auto">
                <span className="text-4xl text-d4a017">{feature.icon}</span>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-gray-900 font-inter text-center">{feature.title}</h3>
              <p className="mt-2 text-gray-600 font-inter text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
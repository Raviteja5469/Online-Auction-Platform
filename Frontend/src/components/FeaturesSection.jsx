import React from 'react'

const FeaturesSection = () => {
    const features = [
        {
          title: 'Easy Bidding',
          description: 'Place your bids quickly with an intuitive, user-friendly interface.',
          icon: '💰'
        },
        {
          title: 'Secure Transactions',
          description: 'Experience safe and secure payment processing for every auction.',
          icon: '🔒'
        },
        {
          title: 'Community Feedback',
          description: 'Engage with a vibrant community and get real-time updates.',
          icon: '💬'
        },
        {
          title: 'Dashboard Management',
          description: 'Keep track of all your bids and auctions in one comprehensive dashboard.',
          icon: '📊'
        },
        {
          title: 'Post Auction Easily',
          description: 'List your items for auction effortlessly with our user-friendly posting tool.',
          icon: '📝'
        },
      ];
      return (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                What makes us unique
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Our platform delivers a seamless auction experience with powerful features.
              </p>
            </div>
            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="mt-4 text-2xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
}

export default FeaturesSection

import React from 'react';

const Faqs = () => {
  const faqs = [
    {
      question: "How do I start bidding?",
      answer: "To start bidding, create an account, verify your email, and browse active auctions. Click on any item you're interested in and place your bid above the current highest bid."
    },
    {
      question: "How does the payment process work?",
      answer: "We support multiple payment methods including credit cards, PayPal, and bank transfers. Once you win an auction, you'll receive payment instructions and have 48 hours to complete the transaction."
    },
    {
      question: "What if I win an auction?",
      answer: "When you win an auction, you'll receive an email notification with next steps. You'll need to complete the payment within the specified timeframe and coordinate shipping details with the seller."
    },
    {
      question: "How do I post an item for auction?",
      answer: "Click the 'Post Auction' button in the navigation menu, fill out the item details form including description, starting bid, photos, and auction duration. Once submitted, our team will review and approve your listing."
    },
    {
      question: "Is there a buyer or seller protection policy?",
      answer: "Yes, we offer comprehensive protection for both buyers and sellers. All transactions are monitored, and we have a dispute resolution system in place to handle any issues that may arise."
    },
    {
      question: "What fees are involved?",
      answer: "Buyers pay no platform fees. Sellers pay a small commission (typically 5-10%) on successful sales. There may be additional fees for premium listing features."
    },
  ];

  return (
    <section className="bg-white py-16" style={{ backgroundColor: 'rgb(233 233 233)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-extrabold tracking-tight text-gray-900 font-semibold text-d4a017 uppercase tracking-wide font-inter animate-fade-in">
            FAQ's
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl font-playfair animate-fade-in">
            Frequently Asked Questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto font-inter animate-fade-in animation-delay-200">
            Everything you need to know about using our auction platform.
          </p>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group mb-8 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="p-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 font-inter">
                  {faq.question}
                </h3>
                <svg
                  className="h-5 w-5 text-d4a017 group-hover:rotate-180 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-300">
                <p className="px-6 pb-6 text-gray-600 font-inter">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4 font-inter">
            Still have questions? We're here to help!
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-900 bg-white hover:bg-d4a017 hover:text-white shadow-sm transition-all duration-300 font-inter"
          >
            Contact Support
          </a>
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

export default Faqs;
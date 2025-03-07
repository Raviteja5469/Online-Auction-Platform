import React from 'react'

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
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-wide">FAQ</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Everything you need to know about using our auction platform.
          </p>
        </div>
        
        <div className="mt-12 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="mb-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-500">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );    
}

export default Faqs

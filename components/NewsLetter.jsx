import React, { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setMessage("Please enter a valid email address");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
      const url = `${base}/api/newsletter/subscribe/`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        setMessage("Successfully subscribed to our newsletter! 🎉");
        setIsError(false);
        setEmail(""); // Clear the input
      } else {
        // Handle different error response formats
        const errorMessage = data.detail || data.email || data.message || data.error || 
                            (typeof data === 'string' ? data : "Failed to subscribe. Please try again.");
        setMessage(errorMessage);
        setIsError(true);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage("Network error. Please check your connection and try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14 px-4">
      <h1 className="md:text-4xl text-2xl font-medium">
        Subscribe now & get 20% off
      </h1>
      <p className="md:text-base text-gray-500/80 pb-8 max-w-2xl">
        Stay updated with our latest products, exclusive deals, and special offers.
        Be the first to know about new arrivals and promotions!
      </p>
      
      {/* Message display */}
      {message && (
        <div className={`w-full max-w-2xl p-3 rounded-md ${
          isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center justify-between max-w-2xl w-full md:h-14 h-12 gap-4 md:gap-0">
        <input
          className="border border-gray-500/30 rounded-md h-full outline-none w-full px-3 text-gray-500 focus:border-josseypink2 transition-colors"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />
        <button 
          type="submit"
          disabled={loading}
          className="md:px-12 px-8 h-full text-white bg-josseypink2 rounded-md hover:bg-josseypink1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </div>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
      
      <p className="text-xs text-gray-400 mt-4 max-w-2xl">
        By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time.
        We respect your privacy and will never share your information with third parties.
      </p>
    </div>
  );
};

export default NewsLetter;
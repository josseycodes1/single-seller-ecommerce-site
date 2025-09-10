import React, { useState, useEffect } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Auto-dismiss message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

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
      const url = `${base}/api/newsletter/`;
      
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
    <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-2 pt-8 pb-14 px-4 md:px-0">
      <h1 className="md:text-4xl text-2xl font-medium px-4 md:px-0">
        Subscribe now & get 20% off
      </h1>
      <p className="md:text-base text-sm text-gray-500/80 pb-6 md:pb-8 max-w-2xl px-2 md:px-0">
        Stay updated with our latest products, exclusive deals, and special offers.
        Be the first to know about new arrivals and promotions!
      </p>
      
      {/* Message display with close button */}
      {message && (
        <div className={`w-full max-w-2xl p-3 rounded-md relative ${
          isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
          <button
            onClick={() => setMessage("")}
            className="absolute top-2 right-2 text-lg font-bold hover:opacity-70 transition-opacity"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center justify-center md:justify-between max-w-2xl w-full md:h-14 h-auto gap-4 md:gap-3">
        <input
          className="border border-gray-500/30 rounded-md h-12 md:h-full outline-none w-full px-4 text-gray-500 focus:border-josseypink2 transition-colors text-base md:text-sm"
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
          className="w-full md:w-auto md:px-8 px-6 h-12 md:h-full text-white bg-josseypink2 rounded-md hover:bg-josseypink1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] text-base md:text-sm font-medium"
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
      
      <p className="text-xs text-gray-400 mt-4 max-w-2xl px-4 md:px-0 text-center">
        By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time.
        We respect your privacy and will never share your information with third parties.
      </p>
    </div>
  );
};

export default NewsLetter;
"use client"
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

const MobileSearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-search-container')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
        const res = await fetch(`${base}/api/products/?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || data);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (productId) => {
    setQuery("");
    setResults([]);
    onClose();
    router.push(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-white z-50 mobile-search-container">
      {/* Search Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Search Input */}
        <div className="flex-1 flex items-center border rounded-full px-4 py-2 bg-gray-50">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="outline-none bg-transparent px-2 py-1 text-base w-full"
          />
          <Image src={assets.search_icon} alt="search" className="w-5 h-5" />
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4">
        {query && (
          <div className="bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-josseypink2 mx-auto mb-2"></div>
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(product.id)}
                >
                  <Image
                    src={product.images?.[0]?.image_url || "/placeholder-image.jpg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {product.description || "No description available"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No products found</p>
                <p className="text-xs mt-1">Try different keywords</p>
              </div>
            )}
          </div>
        )}

        {/* Recent Searches or Empty State */}
        {!query && (
          <div className="text-center py-8">
            <Image 
              src={assets.search_icon} 
              alt="search" 
              className="w-12 h-12 mx-auto mb-4 opacity-50"
            />
            <p className="text-gray-500">Search for products</p>
            <p className="text-sm text-gray-400 mt-1">Type to see results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchBar;
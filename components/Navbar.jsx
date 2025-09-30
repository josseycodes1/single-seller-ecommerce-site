"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

const MobileSearch = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-focus on input when component mounts
  useEffect(() => {
    const input = document.getElementById("mobile-search-input");
    if (input) {
      input.focus();
    }
  }, []);

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
    onClose(); // Close the search overlay
    router.push(`/product/${productId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center border rounded-full px-4 py-3 bg-white shadow-sm">
        <input
          id="mobile-search-input"
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="outline-none px-2 py-1 text-base w-full"
          autoComplete="off"
        />
        <Image src={assets.search_icon} alt="search" className="w-5 h-5" />
      </div>

      {/* Search Results Dropdown */}
      {query && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-josseypink2 mx-auto mb-2"></div>
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((product) => (
              <div
                key={product.id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelect(product.id)}
              >
                <Image
                  src={product.images?.[0]?.image_url || "/placeholder-image.jpg"}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {product.description || "No description available"}
                  </p>
                </div>
                <div className="text-sm font-semibold text-josseypink2">
                  ${parseFloat(product.offer_price || product.price).toFixed(2)}
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
    </div>
  );
};

export default MobileSearch;
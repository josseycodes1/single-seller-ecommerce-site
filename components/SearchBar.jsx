"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // fetch products as user types (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
        const res = await fetch(`${base}/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []); // adjust depending on your API response
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400); // 400ms debounce so it doesn’t spam API

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (productId) => {
    setQuery("");
    setResults([]);
    router.push(`/product/${productId}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) router.push(`/search?query=${encodeURIComponent(query)}`);
        }}
        className="flex items-center border rounded-full px-3 py-1 bg-white"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none px-2 py-1 text-sm w-full"
        />
        <button type="submit">
          <Image src={assets.search_icon} alt="search" className="w-4 h-4" />
        </button>
      </form>

      {/* dropdown results */}
      {query && results.length > 0 && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((product) => (
            <div
              key={product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => handleSelect(product.id)}
            >
              <Image
                src={product.images?.[0]?.image_url || "/placeholder-image.jpg"}
                alt={product.name}
                width={32}
                height={32}
                className="w-8 h-8 object-cover rounded"
              />
              <span className="text-sm text-gray-700">{product.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* empty state */}
      {query && !loading && results.length === 0 && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50 p-3 text-sm text-gray-500">
          No products found
        </div>
      )}
    </div>
  );
};

export default SearchBar;

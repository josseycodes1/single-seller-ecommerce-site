"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center border rounded-full px-3 py-1">
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
  );
};

export default SearchBar;

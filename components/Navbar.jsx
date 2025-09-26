"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
  const { isSeller, router, cart } = useAppContext();

 
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <h1 className="text-josseypink2">
        <Link href="/" className="hover:underline">
          JOSSEYCART
        </Link>
      </h1>

      {/* Middle Links */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push("/sellerdashboard")}
            className="text-xs bg-josseypink2 hover:bg-josseypink1 text-white border px-4 py-1.5 rounded-full"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* SearchBar */}
        <div className="hidden md:block w-48">
          <SearchBar />
        </div>

        {/* Cart Icon */}
        <button
          onClick={() => router.push("/cart")}
          className="relative flex items-center gap-2 hover:text-gray-900 transition"
        >
          <Image src={assets.cart_icon} alt="cart icon" className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-josseypink2 text-white text-xs px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

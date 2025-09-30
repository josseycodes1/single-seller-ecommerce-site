"use client"
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";

const Navbar = () => {
  const { isSeller, router, cart } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-3 border-b border-gray-300 text-gray-700 bg-white relative z-50">
        {/* Left - Logo */}
        <div className="flex items-center">
          <h1 className="text-josseypink2 text-xl font-bold">
            <Link href="/" className="hover:underline">
              JOSSEYCART
            </Link>
          </h1>
        </div>

        {/* Middle Links - Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="hover:text-josseypink2 transition font-medium">
            Home
          </Link>
          <Link href="/all-products" className="hover:text-josseypink2 transition font-medium">
            Shop
          </Link>
          <Link href="/about" className="hover:text-josseypink2 transition font-medium">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-josseypink2 transition font-medium">
            Contact
          </Link>

          {isSeller && (
            <button
              onClick={() => router.push("/sellerdashboard")}
              className="text-xs bg-josseypink2 hover:bg-josseypink1 text-white px-4 py-2 rounded-full font-medium"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Bar - Visible on medium screens and up */}
          <div className="hidden md:block w-48">
            <SearchBar />
          </div>

          {/* Search Icon - Mobile */}
          <button className="md:hidden flex items-center justify-center w-8 h-8 hover:text-josseypink2 transition">
            <Image src={assets.search_icon} alt="search icon" className="w-5 h-5" />
          </button>

          {/* Cart Icon - Always visible */}
          <button
            onClick={() => router.push("/cart")}
            className="relative flex items-center justify-center w-8 h-8 hover:text-josseypink2 transition"
          >
            <Image src={assets.cart_icon} alt="cart icon" className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-josseypink2 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu - Mobile */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 transition"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu}></div>
        )}

        {/* Mobile Menu Slide-in */}
        <div className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="p-6">
            {/* Navigation Links */}
            <div className="space-y-4 mb-8">
              <Link 
                href="/" 
                className="block py-3 text-lg font-medium text-gray-800 hover:text-josseypink2 transition border-b border-gray-100"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                href="/all-products" 
                className="block py-3 text-lg font-medium text-gray-800 hover:text-josseypink2 transition border-b border-gray-100"
                onClick={closeMenu}
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="block py-3 text-lg font-medium text-gray-800 hover:text-josseypink2 transition border-b border-gray-100"
                onClick={closeMenu}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="block py-3 text-lg font-medium text-gray-800 hover:text-josseypink2 transition border-b border-gray-100"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </div>

            {/* Mobile Search Bar */}
            <div className="mb-6">
              <SearchBar onSearch={closeMenu} />
            </div>

            {/* Seller Dashboard Button */}
            {isSeller && (
              <button
                onClick={() => {
                  router.push("/sellerdashboard");
                  closeMenu();
                }}
                className="w-full bg-josseypink2 hover:bg-josseypink1 text-white py-3 rounded-lg font-medium transition mb-4"
              >
                Seller Dashboard
              </button>
            )}

            {/* Additional Mobile-only Features */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Need help?</span>
                <Link href="/contact" className="text-josseypink2 hover:underline" onClick={closeMenu}>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Bar for Tablet - Below navbar */}
      <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <SearchBar />
      </div>
    </>
  );
};

export default Navbar;
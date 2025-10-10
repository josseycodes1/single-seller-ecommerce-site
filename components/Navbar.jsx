"use client"
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import MobileSearchBar from "@/components/MobileSearchBar"; 

const Navbar = () => {
  const { isSeller, router, cart } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-3 border-b border-gray-300 text-gray-700 bg-white relative z-50">
        {/* left side - hamburger + logo */}
        <div className="flex items-center gap-4">
          {/* hamburger menu for mobile*/}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 transition"
          >
            <span className={`block w-6 h-0.5 bg-josseypink2 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-josseypink2 transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-josseypink2 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* logo */}
          <h1 className="text-josseypink2 text-xl font-bold">
            <Link href="/" className="hover:underline">
              JOSSEYCART
            </Link>
          </h1>
        </div>

        {/* middle links for desktop */}
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

        {/* right side - search + cart */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* search bar - visible on medium screens and up */}
          <div className="hidden md:block w-48">
            <SearchBar />
          </div>

          {/* search icon for mobile*/}
          <button 
            onClick={openSearch}
            className="md:hidden flex items-center justify-center w-8 h-8 hover:text-josseypink2 transition"
          >
            <Image src={assets.search_icon} alt="search icon" className="w-5 h-5" />
          </button>

          {/* cart icon */}
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
        </div>

        {/* mobile menu overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu}></div>
        )}

        {/* Mmobile menu slide-in from lEFT */}
        <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* menu header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-josseypink2 text-white">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-2 hover:bg-josseypink1 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* menu content */}
          <div className="p-6">
            {/* navigation links */}
            <div className="space-y-2 mb-8">
              <Link 
                href="/" 
                className="flex items-center gap-3 py-3 px-4 text-lg font-medium text-gray-800 hover:bg-josseypink2 hover:text-white rounded-lg transition group"
                onClick={closeMenu}
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <Link 
                href="/all-products" 
                className="flex items-center gap-3 py-3 px-4 text-lg font-medium text-gray-800 hover:bg-josseypink2 hover:text-white rounded-lg transition group"
                onClick={closeMenu}
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-3 py-3 px-4 text-lg font-medium text-gray-800 hover:bg-josseypink2 hover:text-white rounded-lg transition group"
                onClick={closeMenu}
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </Link>
              <Link 
                href="/contact" 
                className="flex items-center gap-3 py-3 px-4 text-lg font-medium text-gray-800 hover:bg-josseypink2 hover:text-white rounded-lg transition group"
                onClick={closeMenu}
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </Link>
            </div>

            {/* quick search button in menu */}
            <button
              onClick={() => {
                closeMenu();
                openSearch();
              }}
              className="w-full bg-gray-100 hover:bg-josseypink2 hover:text-white text-gray-800 py-3 rounded-lg font-medium transition mb-4 flex items-center justify-center gap-2"
            >
              <Image src={assets.search_icon} alt="search" className="w-5 h-5" />
              Search Products
            </button>

            {/* seller dashboard button */}
            {isSeller && (
              <button
                onClick={() => {
                  router.push("/sellerdashboard");
                  closeMenu();
                }}
                className="w-full bg-josseypink2 hover:bg-josseypink1 text-white py-3 rounded-lg font-medium transition mb-4 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Seller Dashboard
              </button>
            )}

            {/* additional info */}
            <div className="pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p>Need help?</p>
                <Link href="/contact" className="text-josseypink2 hover:underline font-medium" onClick={closeMenu}>
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile search overlay */}
      <MobileSearchBar isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
};

export default Navbar;
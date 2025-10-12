import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h1 className="text-xl md:text-2xl font-bold text-josseypink2">JOSSEYCART</h1>
            <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600 leading-relaxed">
              Your trusted partner in e-commerce success. JosseyCart provides sellers with powerful tools 
              to manage products, track orders, and grow your online business.
            </p>
          </div>

          {/* Dashboard Links */}
          <div>
            <h2 className="font-semibold text-josseypink2 mb-3 md:mb-4 text-sm md:text-base">Dashboard</h2>
            <ul className="text-xs md:text-sm space-y-1 md:space-y-2 text-gray-600">
              <li>
                <a className="hover:text-josseypink2 transition-colors duration-200 block py-1" href="/sellerdashboard">
                  Add Products
                </a>
              </li>
              <li>
                <a className="hover:text-josseypink2 transition-colors duration-200 block py-1" href="/sellerdashboard/product-list">
                  View Products
                </a>
              </li>
              <li>
                <a className="hover:text-josseypink2 transition-colors duration-200 block py-1" href="/sellerdashboard/orders">
                  Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h2 className="font-semibold text-josseypink2 mb-3 md:mb-4 text-sm md:text-base">Support</h2>
            <ul className="text-xs md:text-sm space-y-1 md:space-y-2 text-gray-600">
              <li>
                <a className="hover:text-josseypink2 transition-colors duration-200 block py-1" href="/contact">
                  Help Center
                </a>
              </li>
              <li>
                <a className="hover:text-josseypink2 transition-colors duration-200 block py-1" href="/contact">
                  Contact Support
                </a>
              </li>
              <li>
                <a className="hover:text-josseypink2 transition-colors duration-200 block py-1" href="/privacypolicy">
                  Seller Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="font-semibold text-josseypink2 mb-3 md:mb-4 text-sm md:text-base">Get in touch</h2>
            <div className="text-xs md:text-sm space-y-1 md:space-y-2 text-gray-600">
              <p className="flex items-start gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span className="break-words">contact@josseycodes.dev</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                +234-813-037-553
              </p>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 mt-4">
              <a href="https://www.linkedin.com/in/josseycodes" className="text-gray-400 hover:text-josseypink2 transition-colors duration-200">
                <Image src={assets.facebook_icon} alt="linkedin_icon" width={16} height={16} className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="https://www.twitter.com/in/josseycodes" className="text-gray-400 hover:text-josseypink2 transition-colors duration-200">
                <Image src={assets.twitter_icon} alt="twitter_icon" width={16} height={16} className="w-4 h-4 md:w-5 md:h-5" />
              </a>
              <a href="https://www.instagram.com/in/josseycodes" className="text-gray-400 hover:text-josseypink2 transition-colors duration-200">
                <Image src={assets.instagram_icon} alt="instagram_icon" width={16} height={16} className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-josseypink2 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-white text-xs">
            Copyright 2025 © josseycodes.dev All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer
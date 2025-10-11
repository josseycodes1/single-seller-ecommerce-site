import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="flex flex-col md:flex-row items-start justify-between px-6 md:px-16 lg:px-32 gap-10 py-14 text-gray-600">
        {/* Brand Section */}
        <div className="md:w-2/5">
          <h1 className="text-2xl font-bold text-josseypink2">JOSSEYCART</h1>
          <p className="mt-6 text-sm leading-relaxed">
            Your trusted partner in e-commerce success. JosseyCart provides sellers with powerful tools 
            to manage products, track orders, and grow your online business. Streamline your operations 
            and focus on what matters most - growing your brand.
          </p>
        </div>

        {/* Dashboard Links */}
        <div className="md:w-1/5">
          <h2 className="font-semibold text-josseypink2 mb-5 text-lg">Dashboard</h2>
          <ul className="text-sm space-y-3">
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/sellerdashboard">
                Add Products
              </a>
            </li>
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/sellerdashboard/product-list">
                View Products
              </a>
            </li>
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/sellerdashboard/orders">
                Orders
              </a>
            </li>
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/analytics">
                Analytics
              </a>
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="md:w-1/5">
          <h2 className="font-semibold text-josseypink2 mb-5 text-lg">Support</h2>
          <ul className="text-sm space-y-3">
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/help">
                Help Center
              </a>
            </li>
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/contact">
                Contact Support
              </a>
            </li>
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/seller-guide">
                Seller Guide
              </a>
            </li>
            <li>
              <a className="hover:text-josseypink2 transition-colors duration-200" href="/faq">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:w-1/5">
          <h2 className="font-semibold text-josseypink2 mb-5 text-lg">Get in touch</h2>
          <div className="text-sm space-y-3">
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              contact@josseycodes.dev
            </p>
            <p className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              +234-813-037-553
            </p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex items-center gap-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-josseypink2 transition-colors duration-200">
              <Image src={assets.facebook_icon} alt="facebook_icon" width={20} height={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-josseypink2 transition-colors duration-200">
              <Image src={assets.twitter_icon} alt="twitter_icon" width={20} height={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-josseypink2 transition-colors duration-200">
              <Image src={assets.instagram_icon} alt="instagram_icon" width={20} height={20} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright Section */}
      <div className="bg-josseypink2 py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-32">
          <p className="text-center text-white text-xs md:text-sm">
            Copyright 2025 © josseycodes.dev All Right Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
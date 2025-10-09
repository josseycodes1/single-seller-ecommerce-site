import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <h1 className=" text-josseypink2">JOSSEYCART</h1>
          <p className="mt-6 text-sm">
            Discover the perfect balance of elegance and comfort with JosseyCart’s premium range of fragrances and diffusers. 
            Designed to do more than just scent your space, our diffusers create an inviting atmosphere that speaks of warmth, 
            relaxation, and sophistication. Elevate your space today and let JosseyCart fragrance and diffuser redefine the way your world smells.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-josseypink2 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">Home</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/about">About us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/contact">Contact us</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/privacypolicy">Privacy policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-josseypink2 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+234-813-037-553</p>
              <p>contact@josseycodes.dev</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm bg-josseypink2 text-white">
        Copyright 2025 © josseycodes.dev All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
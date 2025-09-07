import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10 bg-josseypink2">
      <div className="flex items-center gap-4 text-centre">
        <div className="hidden md:block h-7 w-px"></div>
        <p className="py-4 text-center text-xs md:text-sm text-white">
          Copyright 2025 © jossseycodes.dev All Right Reserved.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a href="#">
          <Image src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
          <Image src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <Image src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </div>
    
  );
};

export default Footer;
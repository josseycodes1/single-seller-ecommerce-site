import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-josseypink2 my-16 rounded-xl overflow-hidden">
      <Image
        className="hidden md:block max-w-80"
        src={"/diffuser3.png"}
        alt="md_controller_image"
        width={900}   
        height={900}
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-white text-2xl md:text-3xl font-semibold max-w-[290px]">
          Level Up Your Scent Experience
        </h2>
        <p className="max-w-[343px] font-medium text-white">
          From affordability to precise strength—everything you need to win
        </p>
        <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-white rounded text-josseypink1">
          Buy now
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block max-w-80"
        src={"/diffuser3.png"}
        alt="md_controller_image"
        width={200}   
        height={200}
      />
      <Image
        className="md:hidden"
        src={"/diffuser3.png"}
        alt="sm_controller_image"
        width={200}   
        height={200}
      />
    </div>
  );
};

export default Banner;
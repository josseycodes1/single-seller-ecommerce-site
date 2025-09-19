import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!API_BASE_URL) {
          throw new Error("API base URL is not defined");
        }

        const response = await axios.get(`${API_BASE_URL}/api/banners/`);

        if (response.data && response.data.length > 0) {
          const activeBanners = response.data.filter((b) => b.is_active);
          setBanner(
            activeBanners.length > 0 ? activeBanners[0] : response.data[0]
          );
        } else {
          setError("No banners found");
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
        setError("Failed to load banner");
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-josseypink2 my-16 rounded-xl overflow-hidden h-64 animate-pulse">
        <div className="w-full h-full bg-gray-300 opacity-30"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center bg-gray-100 my-16 rounded-xl p-8">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between bg-josseypink2 my-16 rounded-xl overflow-hidden p-8 md:p-12">
      {/* Left image */}
      {banner?.secondary_image && (
        <div className="hidden md:flex items-center justify-center w-1/4">
          <div className="relative w-48 h-55">
            <Image
              src={banner.secondary_image}
              alt="Banner secondary image"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      {/* Center content */}
      <div className="flex flex-col items-center justify-center text-center w-full md:w-2/4 z-10 space-y-4">
        {banner?.title && (
          <h2 className="text-white text-2xl md:text-3xl font-bold max-w-md">
            {banner.title}
          </h2>
        )}

        {banner?.subtitle && (
          <p className="text-white text-lg max-w-md font-medium">
            {banner.subtitle}
          </p>
        )}

        {banner?.discount_text && (
          <p className="text-white font-bold text-xl bg-josseypink1 p-3">
            {banner.discount_text}
          </p>
        )}

        <button className="group flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-full text-josseypink2
         font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg">
          {banner?.button_text || "Buy now"}
          <svg
            className="group-hover:translate-x-1 transition-transform"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 8H15M15 8L8 1M15 8L8 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Right image */}
      {banner?.image && (
        <div className="hidden md:flex items-center justify-center w-1/4">
          <div className="relative w-48 h-48">
            <Image
              src={banner.image}
              alt="Banner product image"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}

      {/* Mobile image */}
      {(banner?.image_mobile || banner?.image) && (
        <div className="md:hidden mt-6">
          <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white bg-white shadow-lg">
            <Image
              src={banner.image_mobile || banner.image}
              alt="Banner mobile image"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;

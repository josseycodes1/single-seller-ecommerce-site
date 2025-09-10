import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!API_BASE_URL) {
          throw new Error("API base URL is not defined");
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/banners/`);
        
        if (response.data && response.data.length > 0) {
          // Filter for active banners if needed, or get the first one
          const activeBanners = response.data.filter(b => b.is_active);
          setBanner(activeBanners.length > 0 ? activeBanners[0] : response.data[0]);
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

  // Function to check if URL is from Cloudinary
  const isCloudinaryUrl = (url) => {
    return url && url.includes('cloudinary.com');
  }

  // Function to get optimized Cloudinary URL
  const getOptimizedCloudinaryUrl = (url, width = 900, height = 900) => {
    if (!url || !isCloudinaryUrl(url)) return url
    
    const optimizationParams = `c_fill,w_${width},h_${height},q_auto,f_auto`
    return url.replace('/upload/', `/upload/${optimizationParams}/`)
  }

  // Handle image errors
  const handleImageError = (imageType) => {
    setImageErrors(prev => ({ ...prev, [imageType]: true }));
  }

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-gray-200 my-16 rounded-xl overflow-hidden animate-pulse">
        <div className="hidden md:block w-80 h-80 bg-gray-300"></div>
        <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-0">
          <div className="h-8 bg-gray-300 rounded w-64"></div>
          <div className="h-6 bg-gray-300 rounded w-80"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="hidden md:block w-80 h-80 bg-gray-300"></div>
        <div className="md:hidden w-48 h-48 bg-gray-300"></div>
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
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-josseypink2 my-16 rounded-xl overflow-hidden">
      {/* Left image - desktop only (using secondary_image if available) */}
      {banner?.secondary_image && !imageErrors.secondary_image ? (
        <Image
          className="hidden md:block max-w-80"
          src={getOptimizedCloudinaryUrl(banner.secondary_image)}
          alt="Banner secondary image"
          width={900}
          height={900}
          priority
          onError={() => handleImageError('secondary_image')}
          unoptimized={!isCloudinaryUrl(banner.secondary_image)}
        />
      ) : banner?.image && !imageErrors.image ? (
        <Image
          className="hidden md:block max-w-80"
          src={getOptimizedCloudinaryUrl(banner.image)}
          alt="Banner product image"
          width={900}
          height={900}
          priority
          onError={() => handleImageError('image')}
          unoptimized={!isCloudinaryUrl(banner.image)}
        />
      ) : (
        <div className="hidden md:block w-80 h-80 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
      
      {/* Center content - properly centered */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 px-4 md:px-0 mx-auto">
        <h2 className="text-white text-2xl md:text-3xl font-semibold max-w-[290px] md:max-w-none">
          {banner?.title || "Level Up Your Scent Experience"}
        </h2>
        <p className="max-w-[343px] font-medium text-white">
          {banner?.subtitle || "From affordability to precise strength—everything you need to win"}
        </p>
        
        {banner?.discount_text && (
          <p className="text-white font-semibold">{banner.discount_text}</p>
        )}
        
        <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-white rounded text-josseypink1 hover:bg-gray-100 transition-colors">
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
      
      {/* Right image - desktop only (using secondary_image if available) */}
      {banner?.secondary_image && !imageErrors.secondary_image_right ? (
        <Image
          className="hidden md:block max-w-80"
          src={getOptimizedCloudinaryUrl(banner.secondary_image, 200, 200)}
          alt="Banner secondary image"
          width={200}
          height={200}
          onError={() => handleImageError('secondary_image_right')}
          unoptimized={!isCloudinaryUrl(banner.secondary_image)}
        />
      ) : banner?.image && !imageErrors.image_right ? (
        <Image
          className="hidden md:block max-w-80"
          src={getOptimizedCloudinaryUrl(banner.image, 200, 200)}
          alt="Banner product image"
          width={200}
          height={200}
          onError={() => handleImageError('image_right')}
          unoptimized={!isCloudinaryUrl(banner.image)}
        />
      ) : (
        <div className="hidden md:block w-80 h-80 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
      
      {/* Mobile image (using image_mobile if available) */}
      {banner?.image_mobile && !imageErrors.image_mobile ? (
        <Image
          className="md:hidden max-w-48"
          src={getOptimizedCloudinaryUrl(banner.image_mobile, 200, 200)}
          alt="Banner mobile image"
          width={200}
          height={200}
          onError={() => handleImageError('image_mobile')}
          unoptimized={!isCloudinaryUrl(banner.image_mobile)}
        />
      ) : banner?.image && !imageErrors.image_mobile_fallback ? (
        <Image
          className="md:hidden max-w-48"
          src={getOptimizedCloudinaryUrl(banner.image, 200, 200)}
          alt="Banner product image"
          width={200}
          height={200}
          onError={() => handleImageError('image_mobile_fallback')}
          unoptimized={!isCloudinaryUrl(banner.image)}
        />
      ) : (
        <div className="md:hidden w-48 h-48 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">No image</span>
        </div>
      )}
    </div>
  );
};

export default Banner;